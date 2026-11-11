export {};
interface Move {
  id: string;
  name: string;
  type: string;
  category: string;
  basePower: number;
  accuracy: number | boolean;
  pp: number;
  priority?: number;
  target?: string;
  flags?: Record<string, number>;
  description?: string;
  shortDescription?: string;
  isNonstandard?: string;
}
interface Ability {
  id: string;
  name: string;
  description?: string;
  shortDescription?: string;
  isNonstandard?: string;
}
interface Entry {
  id: string;
  title: string;
  type: string;
  subtitle?: string;
  keywords?: string[];
  metadata?: {
    category?: string;
    source?: string;
    badge?: string;
    merchantName?: string;
    price?: number;
    storeType?: string;
    matchKind?: string;
  };
}
interface Form {
  name: string;
  abilities?: string[];
  moves?: string[];
}
interface Species extends Form {
  nationalPokedexNumber: number;
  forms?: Form[];
}
interface User {
  id: number;
  name: string;
  form: number;
  formName?: string;
  method: string;
}
type RecordEntry = Move | Ability | Entry;
const root = document.querySelector<HTMLElement>("[data-catalogue]");
if (root) initialize(root);
function initialize(root: HTMLElement) {
  const kind = root.dataset.kind!;
  const base = root.dataset.base!;
  const query = root.querySelector<HTMLInputElement>("[data-query]")!;
  const filter = root.querySelector<HTMLSelectElement>("[data-filter]")!;
  const category = root.querySelector<HTMLSelectElement>("[data-category]");
  const sort = root.querySelector<HTMLSelectElement>("[data-sort]")!;
  const results = root.querySelector<HTMLElement>("[data-results]")!;
  const status = root.querySelector<HTMLElement>("[data-status]")!;
  const more = root.querySelector<HTMLButtonElement>("[data-more]")!;
  const parameters = new URLSearchParams(location.search);
  let requestedId = parameters.get(kind);
  let records: RecordEntry[] = [],
    visible = 30;
  let species: Species[] = [];
  let art: Record<string, { static: string }> = {};
  let itemArt: Record<string, string> = {};
  let speciesPromise: Promise<void> | undefined;
  const userCache = new Map<string, User[]>();
  const esc = (v: unknown) =>
    String(v ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#39;");
  const normalize = (v: string) => v.toLowerCase().replace(/[^a-z0-9]/g, "");
  const title = (v: string) =>
    v
      .replaceAll("_", " ")
      .replaceAll("-", " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());
  const name = (r: RecordEntry) => ("name" in r ? r.name : r.title);
  const badge = (value: string, type = "") =>
    `<span class="catalogue-badge"${type ? ` data-type="${esc(type.toLowerCase())}"` : ""}>${esc(value)}</span>`;
  const money = (price?: number) =>
    price === undefined ? "Not listed" : `$${price.toLocaleString()}`;
  const icon = (entry: Entry) => {
    const path = itemArt[normalize(entry.title)];
    return path
      ? `<img class="catalogue-item-icon" src="${base}${path}" width="48" height="48" alt="" loading="lazy" />`
      : "";
  };
  const stock = (r: Entry) =>
    /random/i.test(r.metadata?.storeType ?? "") ? "random" : "fixed";
  function filterValue(r: RecordEntry) {
    if (kind === "move") return (r as Move).type;
    if (kind === "ability") return (r as Ability).isNonstandard ?? "Standard";
    return kind === "shop"
      ? (r as Entry).metadata?.merchantName
      : (r as Entry).metadata?.category;
  }
  function syncUrl() {
    requestedId = null;
    const url = new URL(location.href);
    for (const [key, value] of [
      ["q", query.value],
      ["filter", filter.value],
      ["category", category?.value ?? ""],
      ["sort", sort.value === "name" ? "" : sort.value],
    ]) {
      if (value) url.searchParams.set(key, value);
      else url.searchParams.delete(key);
    }
    history.replaceState(null, "", url);
  }
  function moveCard(r: Move) {
    return `<details class="catalogue-card" name="catalogue-entry" data-record="${esc(r.id)}"><summary aria-label="${esc(r.name)}"><h2>${esc(r.name)}</h2><div class="catalogue-badges">${badge(r.type, r.type)}${badge(r.category)}${r.isNonstandard ? badge(r.isNonstandard === "Past" ? "Past generation" : r.isNonstandard) : ""}</div><div class="catalogue-stats"><span>Power<strong>${r.basePower || "—"}</strong></span><span>Accuracy<strong>${r.accuracy === true ? "Always" : `${r.accuracy}%`}</strong></span><span>PP<strong>${r.pp}</strong></span><span>Priority<strong>${r.priority && r.priority > 0 ? "+" : ""}${r.priority ?? 0}</strong></span></div><p>${esc(r.shortDescription ?? r.description ?? "Effect not listed.")}</p></summary><div class="catalogue-detail">${moveDetail(r)}<div data-users></div></div></details>`;
  }
  function moveDetail(r: Move) {
    const targets: Record<string, string> = {
      normal: "One adjacent Pokémon",
      self: "User",
      allAdjacentFoes: "All adjacent opponents",
      allAdjacent: "All adjacent Pokémon",
      allySide: "User’s side",
      foeSide: "Opponent’s side",
      adjacentAlly: "One adjacent ally",
      adjacentAllyOrSelf: "User or adjacent ally",
      all: "Entire field",
      any: "Any Pokémon",
      randomNormal: "Random adjacent opponent",
      allies: "All allies",
      scripted: "Determined by the move",
    };
    const properties: Record<string, string> = {
      contact: "Makes contact",
      sound: "Sound-based",
      bullet: "Ball or bomb move",
      punch: "Punching move",
      bite: "Biting move",
      pulse: "Pulse move",
      powder: "Powder move",
      slicing: "Slicing move",
      wind: "Wind move",
      heal: "Healing move",
      protect: "Affected by Protect",
      authentic: "Bypasses Substitute",
    };
    const flags = Object.entries(r.flags ?? {})
      .filter(([flag, value]) => value && properties[flag])
      .map(([flag]) => badge(properties[flag]))
      .join("");
    return `<h3>Battle effect</h3><p>${esc(r.description ?? r.shortDescription ?? "No description supplied.")}</p><dl class="catalogue-facts"><div><dt>Target</dt><dd>${esc(targets[r.target ?? ""] ?? title(r.target ?? "Not listed"))}</dd></div><div><dt>Battle category</dt><dd>${esc(r.category)}</dd></div></dl>${flags ? `<div class="catalogue-badges">${flags}</div>` : ""}`;
  }
  function abilityCard(r: Ability) {
    return `<details class="catalogue-card" name="catalogue-entry" data-record="${esc(r.id)}"><summary aria-label="${esc(r.name)}"><h2>${esc(r.name)}</h2><div class="catalogue-badges">${badge(r.isNonstandard === "Past" ? "Past generation" : (r.isNonstandard ?? "Ability"))}</div><p>${esc(r.shortDescription ?? r.description ?? "Effect not listed.")}</p></summary><div class="catalogue-detail"><h3>How it works</h3><p>${esc(r.description ?? r.shortDescription ?? "No description supplied.")}</p><div data-users></div></div></details>`;
  }
  function itemDescription(r: Entry) {
    const text =
      r.keywords?.find((term) => term.length > r.title.length + 10) ?? "";
    return text
      .replace(/pok mon/gi, "Pokémon")
      .replace(/pokemon/gi, "Pokémon")
      .replace(/\b(a|holder|pokemon|pokémon) s\b/gi, "$1’s")
      .replace(/\b(\d) (\d)x\b/g, "$1.$2×")
      .replace(/^\w/, (c) => c.toUpperCase());
  }
  function itemCard(r: Entry) {
    const group = r.metadata?.category ?? "Item";
    const symbols: Record<string, string> = {
      Fossils: "◈",
      Mints: "❧",
      Mulch: "♧",
      Plates: "◇",
      Materials: "✦",
      "Battle Items": "◆",
    };
    const guide =
      group === "Battle Items"
        ? "/battle/shops/"
        : group === "Plates" || group === "Materials"
          ? "/progression/legendary-mythical/"
          : "/progression/forms-items/";
    return `<details class="catalogue-card" name="catalogue-entry" data-record="${esc(r.id)}"><summary aria-label="${esc(r.title)}">${icon(r) || `<span class="catalogue-item-mark" aria-hidden="true">${symbols[group] ?? "◈"}</span>`}<h2>${esc(r.title)}</h2><div class="catalogue-badges">${badge(group)}</div><p>${esc(itemDescription(r))}</p></summary><div class="catalogue-detail">${r.metadata?.source ? `<h3>Where to find it</h3><p>${esc(r.metadata.source)}</p>` : ""}${r.metadata?.badge ? `<p>Reference price: ${esc(r.metadata.badge)}</p>` : ""}<a href="${base}${guide.slice(1)}${group === "Battle Items" ? `?q=${encodeURIComponent(r.title)}&sort=price` : ""}">${group === "Battle Items" ? "Search merchant offers" : "Open the acquisition guide"} →</a></div></details>`;
  }
  function shopCard(r: Entry) {
    return `<article class="catalogue-offer"><div>${icon(r)}<h2>${esc(r.title)}</h2><div class="catalogue-badges">${badge(r.metadata?.merchantName ?? "Merchant")}${badge(stock(r) === "random" ? "Randomized stock" : "Fixed stock")}${r.metadata?.matchKind === "move" ? badge("Move / TM") : ""}</div><a href="${base}battle/shops/?q=${encodeURIComponent(r.title)}&sort=price">Compare offers →</a></div><div class="catalogue-price"><strong>${money(r.metadata?.price)}</strong><small>Reference price</small></div></article>`;
  }
  function render() {
    const q = normalize(query.value);
    const matched = records.filter((r) => {
      const searchable =
        "name" in r
          ? `${r.name} ${r.description ?? ""} ${r.shortDescription ?? ""}`
          : `${r.title} ${r.subtitle ?? ""} ${(r.keywords ?? []).join(" ")} ${r.metadata?.price ?? ""}`;
      return (
        (!requestedId || r.id === requestedId) &&
        (!q || normalize(searchable).includes(q)) &&
        (!filter.value || filterValue(r) === filter.value) &&
        (!category?.value ||
          (kind === "move"
            ? (r as Move).category === category.value
            : stock(r as Entry) === category.value))
      );
    });
    matched.sort((a, b) => {
      if (sort.value.startsWith("price")) {
        const aMissing = (a as Entry).metadata?.price === undefined;
        const bMissing = (b as Entry).metadata?.price === undefined;
        if (aMissing !== bMissing) return aMissing ? 1 : -1;
      }
      const numeric = (r: RecordEntry) =>
        sort.value.startsWith("price")
          ? ((r as Entry).metadata?.price ?? Infinity)
          : sort.value === "power"
            ? (r as Move).basePower
            : sort.value === "accuracy"
              ? (r as Move).accuracy === true
                ? 101
                : Number((r as Move).accuracy)
              : (r as Move).pp;
      return (
        (sort.value === "name"
          ? 0
          : (numeric(a) - numeric(b)) * (sort.value === "price" ? 1 : -1)) ||
        name(a).localeCompare(name(b))
      );
    });
    results.innerHTML =
      matched
        .slice(0, visible)
        .map((r) =>
          kind === "move"
            ? moveCard(r as Move)
            : kind === "ability"
              ? abilityCard(r as Ability)
              : kind === "shop"
                ? shopCard(r as Entry)
                : itemCard(r as Entry),
        )
        .join("") ||
      '<div class="catalogue-empty"><strong>No matches found.</strong><p>Try a shorter search or reset the filters.</p></div>';
    const noun = kind === "shop" ? "offer" : kind;
    const plural = kind === "ability" ? "abilities" : `${noun}s`;
    status.textContent = `${matched.length.toLocaleString()} ${matched.length === 1 ? noun : plural}${matched.length !== records.length ? ` of ${records.length.toLocaleString()}` : ""}`;
    more.hidden = visible >= matched.length;
    more.textContent = `Show more · ${Math.max(0, matched.length - visible).toLocaleString()} remaining`;
  }
  async function loadSpecies() {
    if (!speciesPromise)
      speciesPromise = Promise.all([
        fetch(`${base}data/cobbleverse-guides/pokemon.json`).then((r) => {
          if (!r.ok) throw Error();
          return r.json();
        }),
        fetch(`${base}data/cobbleverse-guides/pokemon-art.json`)
          .then((r) => (r.ok ? r.json() : {}))
          .catch(() => ({})),
      ])
        .then(([p, a]) => {
          species = p;
          art = a;
        })
        .catch((error) => {
          speciesPromise = undefined;
          throw error;
        });
    return speciesPromise;
  }
  function findUsers(id: string) {
    if (userCache.has(id)) return userCache.get(id)!;
    const users: User[] = [];
    for (const p of species) {
      for (const [index, form] of [
        [-1, p] as const,
        ...(p.forms ?? []).map((f, i) => [i, f] as const),
      ]) {
        if (kind === "ability") {
          const abilities = form.abilities ?? p.abilities ?? [];
          const found = abilities.filter(
            (a) => normalize(a.replace(/^h:/, "")) === normalize(id),
          );
          if (found.length)
            users.push({
              id: p.nationalPokedexNumber,
              name: p.name,
              form: index,
              formName: index < 0 ? undefined : form.name,
              method: found.some((a) => !a.startsWith("h:"))
                ? "Regular ability"
                : "Hidden ability",
            });
        } else {
          const methods = new Set<string>();
          for (const move of form.moves ?? p.moves ?? []) {
            const separator = move.indexOf(":");
            if (normalize(move.slice(separator + 1)) !== normalize(id))
              continue;
            const method = move.slice(0, separator);
            methods.add(
              /^\d+$/.test(method)
                ? `Lv. ${method}`
                : method === "tm"
                  ? "TM"
                  : title(method),
            );
          }
          if (methods.size)
            users.push({
              id: p.nationalPokedexNumber,
              name: p.name,
              form: index,
              formName: index < 0 ? undefined : form.name,
              method: [...methods].join(" · "),
            });
        }
      }
    }
    userCache.set(id, users);
    return users;
  }
  function renderUsers(container: HTMLElement, users: User[], limit: number) {
    container.innerHTML = `<h3>${kind === "ability" ? "Pokémon with this ability" : "Pokémon that learn this move"} <small>(${users.length.toLocaleString()} species / form entries)</small></h3><p>From the bundled species and form data. Open a Pokémon to check its full entry.</p><div class="catalogue-users">${users
      .slice(0, limit)
      .map((p) => {
        const visual = art[p.form < 0 ? String(p.id) : `${p.id}:${p.formName}`];
        return `<a class="catalogue-user" href="${base}pokemon/?pokemon=${p.id}${p.form >= 0 ? `&form=${p.form}` : ""}">${visual ? `<img src="${base}${visual.static}" width="90" height="90" loading="lazy" alt="" />` : p.form < 0 ? `<img src="${base}assets/pokemon/${p.id}.webp" width="90" height="90" loading="lazy" alt="" />` : ""}<strong>${esc(p.name)}</strong>${p.formName ? `<small>${esc(p.formName)}</small>` : ""}<small>${esc(p.method)}</small></a>`;
      })
      .join(
        "",
      )}</div>${users.length > limit ? `<button type="button" class="catalogue-users-more" data-users-more>Show ${Math.min(30, users.length - limit)} more Pokémon</button>` : !users.length ? "<p>No species or form in this snapshot lists this entry.</p>" : ""}`;
    container
      .querySelector("[data-users-more]")
      ?.addEventListener("click", () =>
        renderUsers(container, users, limit + 30),
      );
  }
  results.addEventListener(
    "toggle",
    async (event) => {
      const details = event.target as HTMLDetailsElement;
      if (!details.matches("details[data-record]") || !details.open) return;
      const id = details.dataset.record!;
      const url = new URL(location.href);
      url.searchParams.set(kind, id);
      history.replaceState(null, "", url);
      const target = details.querySelector<HTMLElement>("[data-users]");
      if (!target || target.dataset.loaded) return;
      target.dataset.loaded = "true";
      target.innerHTML = '<p role="status">Finding matching Pokémon…</p>';
      try {
        await loadSpecies();
        renderUsers(target, findUsers(id), 18);
      } catch {
        delete target.dataset.loaded;
        target.innerHTML =
          "<p>Pokémon matches could not load. Close and reopen this entry to retry.</p>";
      }
    },
    true,
  );
  query.value = parameters.get("q") ?? "";
  const source =
    kind === "move"
      ? "moves.json"
      : kind === "ability"
        ? "abilities.json"
        : "reference-index.json";
  Promise.all([
    kind === "item" || kind === "shop"
      ? fetch(`${base}data/cobbleverse-guides/item-art.json`)
          .then((r) => (r.ok ? r.json() : {}))
          .then((data: Record<string, string>) => {
            itemArt = data;
          })
          .catch(() => {})
      : Promise.resolve(),
    fetch(`${base}data/cobbleverse-guides/${source}`).then((r) => {
      if (!r.ok) throw Error();
      return r.json();
    }),
  ])
    .then(([, data]: [void, RecordEntry[]]) => {
      records =
        kind === "move" || kind === "ability"
          ? data
          : data.filter(
              (r) =>
                (r as Entry).type === kind &&
                (kind !== "shop" ||
                  (r as Entry).metadata?.matchKind !== "merchant"),
            );
      if (kind === "shop") {
        records = [
          ...new Map(
            records.map((record) => {
              const r = record as Entry;
              return [
                JSON.stringify([
                  r.title,
                  r.metadata?.merchantName,
                  r.metadata?.price,
                  stock(r),
                  r.metadata?.matchKind,
                ]),
                r,
              ];
            }),
          ).values(),
        ];
      }
      const values = [
        ...new Set(records.map(filterValue).filter((v): v is string => !!v)),
      ].sort();
      filter.insertAdjacentHTML(
        "beforeend",
        values
          .map(
            (v) =>
              `<option value="${esc(v)}">${esc(v === "Past" ? "Past generation" : v)}</option>`,
          )
          .join(""),
      );
      filter.value = parameters.get("filter") ?? "";
      sort.value = parameters.get("sort") ?? "name";
      if (!sort.value) sort.value = "name";
      if (category) category.value = parameters.get("category") ?? "";
      const id = parameters.get(kind);
      if (id) {
        const record = records.find((r) => r.id === id);
        if (record) {
          query.value = name(record);
          filter.value = "";
          if (category) category.value = "";
        }
      }
      render();
      if (id) {
        const selected = [
          ...results.querySelectorAll<HTMLDetailsElement>("details"),
        ].find((d) => d.dataset.record === id);
        if (selected) selected.open = true;
      }
    })
    .catch(() => {
      status.textContent = "The catalogue could not load. Refresh to retry.";
    });
  [query, filter, sort, category]
    .filter((el): el is HTMLInputElement | HTMLSelectElement => !!el)
    .forEach((el) =>
      el.addEventListener(el === query ? "input" : "change", () => {
        visible = 30;
        const url = new URL(location.href);
        url.searchParams.delete(kind);
        history.replaceState(null, "", url);
        syncUrl();
        render();
      }),
    );
  root.querySelector("[data-reset]")?.addEventListener("click", () => {
    query.value = "";
    filter.value = "";
    sort.value = "name";
    if (category) category.value = "";
    visible = 30;
    const url = new URL(location.href);
    url.searchParams.delete(kind);
    history.replaceState(null, "", url);
    syncUrl();
    render();
    query.focus();
  });
  more.addEventListener("click", () => {
    visible += 30;
    render();
  });
}
