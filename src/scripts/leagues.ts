export {};
const root = document.querySelector<HTMLElement>("[data-leagues]");
if (root) {
  const cards = [...root.querySelectorAll<HTMLElement>("[data-trainer]")],
    sections = [...root.querySelectorAll<HTMLElement>("[data-section]")],
    buttons = [...root.querySelectorAll<HTMLButtonElement>("[data-region]")];
  const query = root.querySelector<HTMLInputElement>("[data-league-query]")!,
    role = root.querySelector<HTMLSelectElement>("[data-league-role]")!,
    state = root.querySelector<HTMLSelectElement>("[data-league-state]")!;
  const key = "cobbleverse-league-checklist-v1",
    known = new Set(cards.map((c) => c.dataset.trainer!));
  let complete = new Set<string>(),
    region = "all";
  try {
    const saved = JSON.parse(localStorage.getItem(key) ?? "[]");
    if (Array.isArray(saved))
      complete = new Set(
        saved.filter(
          (id: unknown): id is string =>
            typeof id === "string" && known.has(id),
        ),
      );
  } catch {}
  function render() {
    let shown = 0;
    const q = query.value.trim().toLowerCase();
    for (const card of cards) {
      const done = complete.has(card.dataset.trainer!);
      card.classList.toggle("is-complete", done);
      card.querySelector<HTMLInputElement>("input")!.checked = done;
      card.querySelector(".league-check span")!.textContent = done
        ? "Completed"
        : "Mark complete";
      card.hidden =
        !(region === "all" || card.dataset.regionName === region) ||
        !!(q && !card.dataset.search!.includes(q)) ||
        !!(role.value && card.dataset.role !== role.value) ||
        !!(state.value === "complete" && !done) ||
        !!(state.value === "remaining" && done);
      if (!card.hidden) shown++;
    }
    for (const section of sections)
      section.hidden = ![
        ...section.querySelectorAll<HTMLElement>("[data-trainer]"),
      ].some((c) => !c.hidden);
    for (const button of buttons)
      button.setAttribute(
        "aria-pressed",
        String(button.dataset.region === region),
      );
    root!.querySelector("[data-progress-label]")!.textContent =
      `${complete.size} / 52 complete`;
    root!.querySelector<HTMLProgressElement>("[data-progress]")!.value =
      complete.size;
    root!.querySelector("[data-league-status]")!.textContent =
      `${shown} checkpoint${shown === 1 ? "" : "s"} shown`;
    root!.querySelector<HTMLElement>("[data-league-empty]")!.hidden = shown > 0;
  }
  function save() {
    try {
      localStorage.setItem(key, JSON.stringify([...complete]));
    } catch {
      root!.querySelector("[data-storage-note]")!.textContent =
        "Storage unavailable; checklist changes last for this visit only.";
    }
  }
  function readHash() {
    const hash = location.hash.slice(1);
    if (buttons.some((b) => b.dataset.region === hash)) region = hash;
    render();
  }
  for (const button of buttons)
    button.addEventListener("click", () => {
      region = button.dataset.region!;
      history.replaceState(null, "", `#${region}`);
      render();
    });
  for (const control of [query, role, state])
    control.addEventListener(control === query ? "input" : "change", render);
  root.addEventListener("change", (event) => {
    const input = event.target as HTMLInputElement;
    if (!input.matches("[data-check]")) return;
    if (input.checked) complete.add(input.dataset.check!);
    else complete.delete(input.dataset.check!);
    save();
    render();
  });
  root.querySelector("[data-clear]")?.addEventListener("click", () => {
    complete.clear();
    save();
    render();
  });
  window.addEventListener("hashchange", readHash);
  readHash();
}
