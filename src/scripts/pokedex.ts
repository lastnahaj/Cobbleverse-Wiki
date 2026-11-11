import { spawnConditionRows } from "../lib/spawnConditions";
interface Stats {
  hp: number;
  attack: number;
  defence: number;
  special_attack: number;
  special_defence: number;
  speed: number;
}
type DataValue =
  string | number | boolean | null | DataValue[] | { [key: string]: DataValue };
interface Evolution {
  result: string;
  variant: string;
  requiredContext?: string;
  requirements?: Record<string, DataValue>[];
}
interface Spawn {
  bucket?: string;
  level?: string;
  weight?: number;
  spawnablePositionType?: string;
  condition?: Record<string, DataValue>;
  anticondition?: Record<string, DataValue>;
}
interface Drop {
  item?: string;
  tag?: string;
  quantityRange?: string;
  percentage?: number;
}
interface Form {
  name: string;
  primaryType?: string;
  secondaryType?: string;
  baseStats?: Stats;
  abilities?: string[];
  moves?: string[];
  evolutions?: Evolution[];
  height?: number;
  weight?: number;
  battleOnly?: boolean;
  riding?: Record<string, DataValue>;
}
interface Pokemon extends Form {
  nationalPokedexNumber: number;
  implemented: boolean;
  labels?: string[];
  preEvolution?: string;
  forms?: Form[];
  eggGroups?: string[];
  catchRate?: number;
  baseFriendship?: number;
  evYield?: Partial<Stats>;
  spawns?: Spawn[];
  drops?: { entries?: Drop[] };
  experienceGroup?: string;
  eggCycles?: number;
}
interface Move {
  id: string;
  name: string;
  type: string;
  category: string;
  basePower: number;
  accuracy: number | boolean;
  pp: number;
  shortDescription?: string;
  description?: string;
}
interface Ability {
  id: string;
  name: string;
  shortDescription?: string;
  description?: string;
}
interface Artwork {
  static: string;
  animated?: string;
  sharedAppearance?: boolean;
}
const root = document.querySelector<HTMLElement>("[data-pokedex]");
if (root) initialize(root);

function initialize(root: HTMLElement) {
  const base = root.dataset.base ?? "/";
  const search = root.querySelector<HTMLInputElement>("[data-dex-search]")!;
  const type = root.querySelector<HTMLSelectElement>("[data-dex-type]")!;
  const generation = root.querySelector<HTMLSelectElement>(
    "[data-dex-generation]",
  )!;
  const sort = root.querySelector<HTMLSelectElement>("[data-dex-sort]")!;
  const mount = root.querySelector<HTMLInputElement>("[data-dex-mount]")!;
  const grid = root.querySelector<HTMLElement>("[data-dex-grid]")!;
  const status = root.querySelector<HTMLElement>("[data-dex-status]")!;
  const more = root.querySelector<HTMLButtonElement>("[data-dex-more]")!;
  const dialog = root.querySelector<HTMLDialogElement>("[data-dex-dialog]")!;
  const entry = root.querySelector<HTMLElement>("[data-dex-entry]")!;
  let pokemon: Pokemon[] = [],
    filtered: Pokemon[] = [],
    visible = 48,
    selected: Pokemon | undefined,
    formIndex = -1,
    activeTab = "overview",
    moves: Move[] = [],
    abilities: Ability[] = [];
  let referencePromise: Promise<void> | undefined;
  let formArt: Record<string, Artwork> = {};
  const motionPreference = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  );
  let animate = !motionPreference.matches;
  motionPreference.addEventListener("change", (event) => {
    animate = !event.matches;
    if (dialog.open) renderEntry();
  });
  let focusBefore: HTMLElement | null = null;
  const statNames: Record<keyof Stats, string> = {
    hp: "HP",
    attack: "Attack",
    defence: "Defense",
    special_attack: "Sp. Atk",
    special_defence: "Sp. Def",
    speed: "Speed",
  };
  const keys = Object.keys(statNames) as (keyof Stats)[];
  const esc = (v: unknown) =>
    String(v ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#39;");
  const slug = (v: string) => v.toLowerCase().replace(/[^a-z0-9]/g, "");
  const title = (v: unknown) =>
    String(v ?? "")
      .replace(/^#?[^: ]+:/, "")
      .replace(/^is_/, "")
      .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
      .replaceAll("_", " ")
      .replaceAll("-", " ")
      .replace(/\b\w/g, (x) => x.toUpperCase());
  const number = (p: Pokemon) =>
    `#${String(p.nationalPokedexNumber).padStart(4, "0")}`;
  const artwork = (p: Pokemon) =>
    `${base}assets/pokemon/${p.nationalPokedexNumber}.webp`;
  const total = (p: Form) =>
    keys.reduce((sum, key) => sum + (p.baseStats?.[key] ?? 0), 0);
  const types = (p: Form) =>
    [p.primaryType, p.secondaryType].filter((v): v is string => !!v);
  const chips = (p: Form) =>
    types(p)
      .map(
        (t) =>
          `<span class="dex-type" data-type="${esc(t)}">${esc(title(t))}</span>`,
      )
      .join("");
  const generationNumber = (id: number) =>
    [151, 251, 386, 493, 649, 721, 809, 905, 1025].findIndex(
      (max) => id <= max,
    ) + 1;
  const initial = new URLSearchParams(location.search);
  search.value = initial.get("q") ?? "";
  type.value = initial.get("type") ?? "";
  generation.value = initial.get("gen") ?? "";
  sort.value = initial.get("sort") ?? "number";
  mount.checked = initial.get("mount") === "1";
  mount.addEventListener("change", () => {
    visible = 48;
    saveFilters();
    renderGrid();
  });

  function saveFilters() {
    const url = new URL(location.href);
    for (const [key, value] of [
      ["q", search.value],
      ["type", type.value],
      ["gen", generation.value],
      ["sort", sort.value === "number" ? "" : sort.value],
      ["mount", mount.checked ? "1" : ""],
    ]) {
      if (value) url.searchParams.set(key, value);
      else url.searchParams.delete(key);
    }
    history.replaceState(null, "", url);
  }
  function renderGrid() {
    const query = slug(search.value);
    filtered = pokemon.filter((p) => {
      const matchesQuery =
        !query ||
        slug(
          [
            p.name,
            p.nationalPokedexNumber,
            ...(p.abilities ?? []),
            ...(p.labels ?? []),
          ].join(" "),
        ).includes(query);
      return (
        matchesQuery &&
        (!mount.checked || !!p.riding) &&
        (!type.value || types(p).includes(type.value)) &&
        (!generation.value ||
          generationNumber(p.nationalPokedexNumber) ===
            Number(generation.value))
      );
    });
    filtered.sort((a, b) =>
      sort.value === "name"
        ? a.name.localeCompare(b.name)
        : sort.value === "stats"
          ? total(b) - total(a) ||
            a.nationalPokedexNumber - b.nationalPokedexNumber
          : a.nationalPokedexNumber - b.nationalPokedexNumber,
    );
    status.textContent = `${filtered.length.toLocaleString()} Pokémon${filtered.length !== pokemon.length ? ` of ${pokemon.length.toLocaleString()}` : ""}`;
    const shown = filtered.slice(0, visible);
    grid.innerHTML = shown.length
      ? shown
          .map(
            (p) =>
              `<button type="button" class="dex-card" data-pokemon="${p.nationalPokedexNumber}" data-primary="${esc(p.primaryType)}" aria-label="Open ${esc(p.name)} ${number(p)}"><span class="dex-card__number">${number(p)}</span><span class="dex-card__art"><img src="${artwork(p)}" width="475" height="475" alt="${esc(p.name)}" loading="lazy" decoding="async" /></span><strong>${esc(p.name)}</strong><span class="dex-card__types">${chips(p)}</span><span class="dex-card__meta">${p.forms?.length ? `${p.forms.length} alternate forms` : `Generation ${generationNumber(p.nationalPokedexNumber)}`}<span aria-hidden="true">↗</span></span></button>`,
          )
          .join("")
      : `<div class="dex-empty"><h2>No Pokémon found</h2><p>Try another name, number, type, or generation.</p><button type="button" data-clear>Clear filters</button></div>`;
    more.hidden = shown.length >= filtered.length;
    more.textContent = `Show more Pokémon · ${Math.max(0, filtered.length - shown.length)} remaining`;
  }
  function reset() {
    mount.checked = false;
    search.value = "";
    type.value = "";
    generation.value = "";
    sort.value = "number";
    visible = 48;
    saveFilters();
    renderGrid();
    search.focus();
  }
  for (const control of [search, type, generation, sort])
    control.addEventListener(control === search ? "input" : "change", () => {
      visible = 48;
      saveFilters();
      renderGrid();
    });
  root.querySelector("[data-dex-reset]")?.addEventListener("click", reset);
  more.addEventListener("click", () => {
    visible += 48;
    renderGrid();
  });
  grid.addEventListener("click", (event) => {
    const button = (event.target as Element).closest<HTMLElement>(
      "[data-pokemon]",
    );
    if (button) open(Number(button.dataset.pokemon));
    if ((event.target as Element).closest("[data-clear]")) reset();
  });

  function referenceData() {
    referencePromise ??= Promise.all([
      fetch(`${base}data/cobbleverse-guides/moves.json`).then((r) => {
        if (!r.ok) throw Error("Moves unavailable");
        return r.json();
      }),
      fetch(`${base}data/cobbleverse-guides/abilities.json`).then((r) => {
        if (!r.ok) throw Error("Abilities unavailable");
        return r.json();
      }),
    ]).then(([m, a]) => {
      moves = m;
      abilities = a;
    });
    return referencePromise;
  }
  function getSpecies(name: string) {
    return pokemon.find((p) => slug(p.name) === slug(name.split(" ")[0]));
  }
  function value(v: DataValue): string {
    if (v === null) return "Not specified";
    if (Array.isArray(v)) return v.map(value).join(", ");
    if (typeof v === "object")
      return Object.entries(v)
        .map(([k, x]) => `${title(k)}: ${value(x)}`)
        .join(" · ");
    return typeof v === "string" ? title(v) : String(v);
  }
  function dataList(data: Record<string, DataValue> | undefined) {
    if (!data || !Object.keys(data).length)
      return '<p class="dex-muted">No additional conditions listed.</p>';
    return `<dl class="dex-conditions">${spawnConditionRows(data)
      .map(
        ([label, text]) =>
          `<div><dt>${esc(label)}</dt><dd>${esc(text)}</dd></div>`,
      )
      .join("")}</dl>`;
  }
  function evolutionCondition(e: Evolution) {
    const parts: string[] = [];
    if (e.requiredContext) parts.push(title(e.requiredContext));
    for (const req of e.requirements ?? []) {
      const variant = req.variant;
      if (variant === "level")
        parts.push(`Level ${req.minLevel ?? "required"}`);
      else if (variant === "friendship")
        parts.push(`Friendship ${req.amount ?? "required"}`);
      else if (variant === "time_range") parts.push(title(req.range));
      else if (variant === "has_move_type")
        parts.push(`Knows a ${title(req.type)} move`);
      else
        parts.push(
          `${title(variant)}${Object.entries(req)
            .filter(([k]) => k !== "variant")
            .map(([k, v]) => ` · ${title(k)}: ${value(v)}`)
            .join("")}`,
        );
    }
    return parts.join(" · ") || title(e.variant);
  }
  function evolutionTree(p: Pokemon) {
    let first = p;
    const seen = new Set<number>();
    while (first.preEvolution) {
      if (seen.has(first.nationalPokedexNumber)) break;
      seen.add(first.nationalPokedexNumber);
      const parent = getSpecies(first.preEvolution);
      if (!parent) break;
      first = parent;
    }
    const edges: string[] = [];
    const visited = new Set<number>();
    function walk(current: Pokemon) {
      if (visited.has(current.nationalPokedexNumber)) return;
      visited.add(current.nationalPokedexNumber);
      for (const e of current.evolutions ?? []) {
        const next = getSpecies(e.result);
        if (!next) continue;
        edges.push(
          `<div class="dex-evolution-pair">${evoButton(current)}<div class="dex-evolution-rule"><span aria-hidden="true">→</span><p>${esc(evolutionCondition(e))}</p></div>${evoButton(next)}</div>`,
        );
        walk(next);
      }
    }
    walk(first);
    return edges.length
      ? edges.join("")
      : `<p class="dex-muted">No evolution is listed for this species.</p>`;
  }
  function evoButton(p: Pokemon) {
    return `<button type="button" class="dex-evolution-species${selected?.nationalPokedexNumber === p.nationalPokedexNumber ? " is-current" : ""}" data-entry="${p.nationalPokedexNumber}"><img src="${artwork(p)}" width="100" height="100" alt="" loading="lazy" /><small>${number(p)}</small><strong>${esc(p.name)}</strong></button>`;
  }

  function ridingPanel(p: Pokemon, record: Pokemon | Form) {
    const riding = record.riding ?? p.riding;
    if (!riding) return "";
    const modes = riding.behaviours as
      Record<string, { stats?: Record<string, DataValue> }> | undefined;
    return (
      '<section><h3>Riding</h3><p class="dex-muted">Snapshot stat ranges for each travel mode. These values are not measured blocks per second; server settings and Aprijuice can affect your mount.</p>' +
      Object.entries(modes ?? {})
        .map(
          ([mode, config]) =>
            `<h4>${esc(title(mode.toLowerCase()))}</h4><dl class="dex-facts">${Object.entries(
              config.stats ?? {},
            )
              .map(
                ([name, range]) =>
                  `<div><dt>${esc(title(name.toLowerCase()))}</dt><dd>${esc(String(range).replace(/(\d)-(\d)/g, "$1–$2"))}</dd></div>`,
              )
              .join("")}</dl>`,
        )
        .join("") +
      "</section>"
    );
  }
  function overview(p: Pokemon, record: Pokemon | Form) {
    const stats = record.baseStats ?? p.baseStats;
    const abilityHtml = (record.abilities ?? p.abilities ?? [])
      .map((id) => {
        const hidden = id.startsWith("h:");
        const clean = id.replace(/^h:/, "");
        const a = abilities.find((a) => a.id === clean);
        return `<div class="dex-ability"><h4><a href="${base}battle/abilities/?ability=${encodeURIComponent(clean)}">${esc(a?.name ?? title(clean))}</a>${hidden ? " <span>Hidden ability</span>" : ""}</h4><p>${esc(a?.shortDescription ?? a?.description ?? "Ability description is unavailable in this snapshot.")}</p></div>`;
      })
      .join("");
    return `<section><h3>Base stats <span>Total ${total({ ...record, baseStats: stats })}</span></h3><div class="dex-stats">${keys.map((key) => `<div><span>${statNames[key]}</span><strong>${stats?.[key] ?? "—"}</strong><span class="dex-stat-track"><span style="width:${Math.min(100, ((stats?.[key] ?? 0) / 255) * 100)}%"></span></span></div>`).join("")}</div></section><section><h3>Abilities</h3>${abilityHtml || "<p>No ability data is listed.</p>"}</section><section><h3>Species details</h3><dl class="dex-facts">${[
      [
        "Height",
        record.height !== undefined ? `${record.height / 10} m` : "Not listed",
      ],
      [
        "Weight",
        record.weight !== undefined ? `${record.weight / 10} kg` : "Not listed",
      ],
      ["Egg groups", (p.eggGroups ?? []).map(title).join(", ") || "Not listed"],
      ["Catch rate", p.catchRate ?? "Not listed"],
      ["Base friendship", p.baseFriendship ?? "Not listed"],
      ["Experience group", title(p.experienceGroup) || "Not listed"],
      [
        "EV yield",
        keys
          .filter((k) => p.evYield?.[k])
          .map((k) => `${p.evYield?.[k]} ${statNames[k]}`)
          .join(", ") || "Not listed",
      ],
      ["Implemented in snapshot", p.implemented ? "Yes" : "No"],
    ]
      .map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`)
      .join("")}</dl></section>${ridingPanel(p, record)}`;
  }
  function movePanel(p: Pokemon, record: Pokemon | Form) {
    const learned = record.moves ?? p.moves ?? [];
    return `<section><h3>Learnset <span>${learned.length} entries</span></h3><label class="dex-move-filter">Search this learnset<input type="search" data-move-query placeholder="Move name, type, or method…" /></label><div class="dex-move-table"><table><thead><tr><th>Method</th><th>Move</th><th>Type</th><th>Category</th><th>Power</th><th>Accuracy</th><th>PP</th></tr></thead><tbody>${learned
      .map((raw) => {
        const [method, id] = raw.split(":");
        const m = moves.find((m) => m.id === id);
        const methodLabel = /^\d+$/.test(method)
          ? `Level ${method}`
          : title(method);
        return `<tr data-move-search="${esc([methodLabel, m?.name ?? id, m?.type, m?.category].join(" ").toLowerCase())}"><td>${esc(methodLabel)}</td><td><strong><a href="${base}battle/moves/?move=${encodeURIComponent(id)}">${esc(m?.name ?? title(id))}</a></strong>${m?.shortDescription ? `<small>${esc(m.shortDescription)}</small>` : ""}</td><td>${m?.type ? `<span class="dex-type" data-type="${esc(m.type.toLowerCase())}">${esc(m.type)}</span>` : "—"}</td><td>${esc(m?.category ?? "—")}</td><td>${m?.basePower || "—"}</td><td>${m?.accuracy === true ? "Always" : (m?.accuracy ?? "—")}</td><td>${m?.pp ?? "—"}</td></tr>`;
      })
      .join(
        "",
      )}</tbody></table></div><p class="dex-muted" data-move-empty hidden>No moves match this search.</p></section>`;
  }
  function spawnPanel(p: Pokemon) {
    return `<section><h3>Where to find it</h3><p class="dex-muted">Each encounter has its own requirements. Biome groups can contain several biomes; all listed types of requirement must be met. Excluded environments are shown separately.</p>${(p.spawns ?? []).map((s, i) => `<article class="dex-spawn"><header><strong>Spawn rule ${i + 1}</strong><span>${esc(title(s.bucket ?? "Not specified"))} · Lv. ${esc(s.level ?? "varies")}</span></header>${s.spawnablePositionType ? `<p>Encounter: ${esc(({ grounded: "On land", submerged: "Underwater", fishing: "Fishing", surface: "On the water surface" } as Record<string, string>)[s.spawnablePositionType] ?? title(s.spawnablePositionType))}</p>` : ""}${dataList(s.condition)}${s.anticondition ? `<h4>Excluded environments</h4><p class="dex-muted">The conditions below describe where this spawn rule does not apply.</p>${dataList(s.anticondition)}` : ""}</article>`).join("") || "<p>No natural spawn rule is listed. This does not rule out a structure, evolution, or special encounter route.</p>"}</section><section><h3>Drops</h3>${p.drops?.entries?.length ? `<div class="dex-drop-list">${p.drops.entries.map((d) => `<div><strong>${esc(title(d.item ?? d.tag ?? "Drop"))}</strong><span>${d.quantityRange !== undefined ? esc(d.quantityRange) : "Quantity not listed"}${d.percentage !== undefined ? ` · ${d.percentage}%` : ""}</span></div>`).join("")}</div>` : "<p>No drop data is listed.</p>"}</section>`;
  }

  function renderEntry() {
    if (!selected) return;
    const p = selected;
    const form = p.forms?.[formIndex];
    const visual =
      formArt[
        form
          ? `${p.nationalPokedexNumber}:${form.name}`
          : String(p.nationalPokedexNumber)
      ] ??
      (!form
        ? { static: `assets/pokemon/${p.nationalPokedexNumber}.webp` }
        : undefined);
    const image = visual
      ? `<img src="${base}${animate && visual.animated ? visual.animated : visual.static}" width="475" height="475" alt="${esc(p.name)}${form ? ` ${esc(form.name)}` : ""}${animate && visual.animated ? " animated sprite" : " artwork"}" />`
      : `<div class="dex-art-unavailable" role="img" aria-label="Artwork unavailable for ${esc(p.name)} ${esc(form?.name)}"><span aria-hidden="true">?</span><small>Form artwork unavailable</small></div>`;
    const artControls = visual?.animated
      ? `<button type="button" class="dex-share" data-animation aria-pressed="${animate}">${animate ? "Pause animation" : "Play animation"}</button>`
      : visual
        ? '<p class="dex-muted">Static artwork · animation unavailable</p>'
        : "";
    const record: Pokemon | Form = form
      ? {
          ...p,
          ...form,
          secondaryType: form.primaryType
            ? form.secondaryType
            : p.secondaryType,
        }
      : p;
    const index = filtered.findIndex(
      (x) => x.nationalPokedexNumber === p.nationalPokedexNumber,
    );
    const pool = index >= 0 ? filtered : pokemon;
    const poolIndex = pool.findIndex(
      (x) => x.nationalPokedexNumber === p.nationalPokedexNumber,
    );
    entry.innerHTML = `<div class="dex-entry-toolbar"><span>${number(p)} · Generation ${generationNumber(p.nationalPokedexNumber)}</span><div><button type="button" data-previous aria-label="Previous Pokémon" ${poolIndex <= 0 ? "disabled" : ""}>←</button><button type="button" data-next aria-label="Next Pokémon" ${poolIndex >= pool.length - 1 ? "disabled" : ""}>→</button><button type="button" class="dex-close" data-close aria-label="Close Pokémon entry">✕</button></div></div><div class="dex-entry-layout"><aside class="dex-profile"><div class="dex-profile-art" data-primary="${esc(record.primaryType)}">${image}<span aria-hidden="true">${number(p)}</span></div><div class="dex-profile-copy"><h2>${esc(p.name)}</h2><div class="dex-profile-types">${chips(record)}</div>${p.forms?.length ? `<label>Form<select data-form><option value="-1" ${formIndex < 0 ? "selected" : ""}>Base form</option>${p.forms.map((f, i) => `<option value="${i}" ${formIndex === i ? "selected" : ""}>${esc(f.name)}</option>`).join("")}</select></label>` : ""}${form ? `<p class="dex-form-note">${esc(form.name)}${visual?.sharedAppearance ? " · Shares the base appearance." : !visual ? " · No matching artwork is available for this custom form." : ""}${form.battleOnly ? " This form is battle-only in the snapshot." : ""}</p>` : ""}${artControls}<p class="dex-muted">Cobbleverse 1.7.42 reference data.</p><button type="button" class="dex-share" data-share>Copy entry link</button></div></aside><div class="dex-entry-main"><div class="dex-tabs" role="tablist" aria-label="Pokémon details">${[
      ["overview", "Overview"],
      ["evolution", "Evolution"],
      ["moves", "Moves"],
      ["spawns", "Spawns & drops"],
    ]
      .map(
        ([id, label]) =>
          `<button type="button" role="tab" id="dex-tab-${id}" aria-controls="dex-panel" aria-selected="${id === activeTab}" tabindex="${id === activeTab ? 0 : -1}" data-tab="${id}">${label}</button>`,
      )
      .join(
        "",
      )}</div><div class="dex-panel" id="dex-panel" role="tabpanel" aria-labelledby="dex-tab-${activeTab}">${activeTab === "overview" ? overview(p, record) : activeTab === "moves" ? movePanel(p, record) : activeTab === "spawns" ? spawnPanel(p) : `<section><h3>Evolution family</h3><div class="dex-evolutions">${evolutionTree(p)}</div>${form ? `<h3>${esc(form.name)} evolution routes</h3>${(form.evolutions ?? []).map((e) => `<p>${esc(title(e.result))} · ${esc(evolutionCondition(e))}</p>`).join("") || "<p>No separate evolution route is listed for this form.</p>"}` : ""}</section>`}</div></div></div>`;
  }
  async function open(id: number, push = true) {
    const p = pokemon.find((p) => p.nationalPokedexNumber === id);
    if (!p) return;
    focusBefore = document.activeElement as HTMLElement;
    selected = p;
    formIndex = -1;
    activeTab = "overview";
    if (push) {
      const url = new URL(location.href);
      url.searchParams.set("pokemon", String(id));
      url.searchParams.delete("form");
      history.pushState(null, "", url);
    }
    renderEntry();
    if (!dialog.open) dialog.showModal();
    document.body.classList.add("dex-is-open");
    entry.querySelector<HTMLButtonElement>("[data-close]")?.focus();
    try {
      await referenceData();
      if (selected === p) renderEntry();
    } catch {
      const panel = entry.querySelector(".dex-panel");
      panel?.insertAdjacentHTML(
        "beforeend",
        '<p class="dex-muted">Move and ability descriptions could not be loaded. Close and reopen the entry to try again.</p>',
      );
      referencePromise = undefined;
    }
  }
  function close() {
    dialog.close();
    document.body.classList.remove("dex-is-open");
    const url = new URL(location.href);
    url.searchParams.delete("pokemon");
    url.searchParams.delete("form");
    history.replaceState(null, "", url);
    focusBefore?.focus();
  }
  dialog.addEventListener("cancel", (event) => {
    event.preventDefault();
    close();
  });
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) close();
  });
  entry.addEventListener("click", (event) => {
    const element = event.target as Element;
    if (element.closest("[data-animation]")) {
      animate = !animate;
      renderEntry();
      entry.querySelector<HTMLButtonElement>("[data-animation]")?.focus();
    }
    if (element.closest("[data-close]")) close();
    const tab = element.closest<HTMLElement>("[data-tab]");
    if (tab) {
      activeTab = tab.dataset.tab!;
      renderEntry();
      entry
        .querySelector<HTMLButtonElement>(`[data-tab="${activeTab}"]`)
        ?.focus();
    }
    const evo = element.closest<HTMLElement>("[data-entry]");
    if (evo) open(Number(evo.dataset.entry));
    if (element.closest("[data-next], [data-previous]") && selected) {
      const index = filtered.findIndex(
        (p) => p.nationalPokedexNumber === selected?.nationalPokedexNumber,
      );
      const pool = index >= 0 ? filtered : pokemon;
      const i =
        pool.findIndex((p) => p === selected) +
        (element.closest("[data-next]") ? 1 : -1);
      if (pool[i]) open(pool[i].nationalPokedexNumber);
    }
    if (element.closest("[data-share]")) {
      navigator.clipboard
        .writeText(location.href)
        .then(() => {
          const button = entry.querySelector("[data-share]");
          if (button) button.textContent = "Link copied";
        })
        .catch(() => {
          const button = entry.querySelector("[data-share]");
          if (button) button.textContent = "Copy the address from your browser";
        });
    }
  });
  entry.addEventListener("change", (event) => {
    const target = event.target as HTMLSelectElement;
    if (target.matches("[data-form]")) {
      formIndex = Number(target.value);
      const url = new URL(location.href);
      if (formIndex >= 0) url.searchParams.set("form", String(formIndex));
      else url.searchParams.delete("form");
      history.replaceState(null, "", url);
      renderEntry();
      entry.querySelector<HTMLSelectElement>("[data-form]")?.focus();
    }
  });
  entry.addEventListener("input", (event) => {
    const input = event.target as HTMLInputElement;
    if (!input.matches("[data-move-query]")) return;
    let visible = 0;
    entry.querySelectorAll<HTMLElement>("[data-move-search]").forEach((row) => {
      row.hidden = !row.dataset.moveSearch?.includes(input.value.toLowerCase());
      if (!row.hidden) visible++;
    });
    const empty = entry.querySelector<HTMLElement>("[data-move-empty]");
    if (empty) empty.hidden = visible > 0;
  });
  entry.addEventListener("keydown", (event) => {
    const target = event.target as HTMLElement;
    if (
      !target.matches("[data-tab]") ||
      !["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)
    )
      return;
    event.preventDefault();
    const tabs = ["overview", "evolution", "moves", "spawns"];
    let i = tabs.indexOf(activeTab);
    i =
      event.key === "Home"
        ? 0
        : event.key === "End"
          ? 3
          : (i + (event.key === "ArrowRight" ? 1 : 3)) % 4;
    activeTab = tabs[i];
    renderEntry();
    entry
      .querySelector<HTMLButtonElement>(`[data-tab="${activeTab}"]`)
      ?.focus();
  });
  window.addEventListener("popstate", () => {
    const id = Number(new URLSearchParams(location.search).get("pokemon"));
    if (id) open(id, false);
    else {
      dialog.close();
      document.body.classList.remove("dex-is-open");
    }
  });
  Promise.all([
    fetch(`${base}data/cobbleverse-guides/pokemon-art.json`)
      .then((r) => {
        if (!r.ok) throw Error("Artwork catalogue unavailable");
        return r.json();
      })
      .then((data: Record<string, Artwork>) => {
        formArt = data;
      })
      .catch(() => {
        /* Base artwork remains available when the catalogue cannot load. */
      }),
    fetch(`${base}data/cobbleverse-guides/pokemon.json`).then((r) => {
      if (!r.ok) throw Error("Pokédex data unavailable");
      return r.json();
    }),
  ])
    .then(([, data]: [void, Pokemon[]]) => {
      pokemon = data;
      renderGrid();
      const id = Number(initial.get("pokemon"));
      if (id)
        open(id, false).then(() => {
          const f = Number(initial.get("form"));
          if (initial.has("form") && selected?.forms?.[f]) {
            formIndex = f;
            renderEntry();
          }
        });
    })
    .catch(() => {
      status.textContent =
        "The Pokédex could not load. Refresh the page to try again.";
    });
}
