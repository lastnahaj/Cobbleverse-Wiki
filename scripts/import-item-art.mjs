import { readFile, mkdir, writeFile, access } from "node:fs/promises";
const normalize = (name) => name.toLowerCase().replace(/[^a-z0-9]/g, "");
const records = JSON.parse(
  await readFile("public/data/cobbleverse-guides/reference-index.json", "utf8"),
);
async function getJson(url) {
  const r = await fetch(url);
  if (!r.ok) throw Error(`HTTP ${r.status}`);
  return r.json();
}
const directories = await getJson(
  "https://api.github.com/repos/PokeAPI/sprites/contents/sprites",
);
const folder = directories.find((d) => d.name === "items");
if (!folder) throw Error("Item artwork directory missing");
const tree = await getJson(folder.git_url);
const files = new Map(
  tree.tree
    .filter((f) => f.type === "blob" && f.path.endsWith(".png"))
    .map((f) => [normalize(f.path.slice(0, -4)), f.path]),
);
const aliases = { charcoalstick: "charcoal", blackglasses: "blackglasses" };
const names = [
  ...new Set(
    records
      .filter((r) => r.type === "item" || r.type === "shop")
      .map((r) => r.title),
  ),
];
const output = "public/assets/items";
await mkdir(output, { recursive: true });
const manifest = {};
let cursor = 0;
async function worker() {
  while (cursor < names.length) {
    const name = names[cursor++];
    const key = normalize(name);
    const file = files.get(aliases[key] ?? key);
    if (!file) continue;
    const target = `${output}/${file}`;
    try {
      await access(target);
    } catch {
      const r = await fetch(
        `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/${file}`,
      );
      if (!r.ok) throw Error(`${file}: ${r.status}`);
      await writeFile(target, Buffer.from(await r.arrayBuffer()));
    }
    manifest[key] = `assets/items/${file}`;
  }
}
await Promise.all(Array.from({ length: 8 }, worker));
await writeFile(
  "public/data/cobbleverse-guides/item-art.json",
  JSON.stringify(
    Object.fromEntries(
      Object.entries(manifest).sort(([a], [b]) => a.localeCompare(b)),
    ),
    null,
    2,
  ) + "\n",
);
await writeFile(
  `${output}/credits.json`,
  JSON.stringify(
    {
      source: "https://github.com/PokeAPI/sprites",
      directory: "sprites/items",
      rights: "Pokémon item artwork belongs to its respective owners.",
      count: Object.keys(manifest).length,
    },
    null,
    2,
  ) + "\n",
);
console.log(`Imported ${Object.keys(manifest).length} matching item icons.`);
