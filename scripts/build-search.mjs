import { readFile, writeFile, readdir } from "node:fs/promises";
import { join, relative, sep } from "node:path";
const root = join(process.cwd(), "dist");
const clean = (value) =>
  value
    .replace(/<[^>]*>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&#x27;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
async function files(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  return (
    await Promise.all(
      entries.map((entry) =>
        entry.isDirectory()
          ? files(join(dir, entry.name))
          : join(dir, entry.name),
      ),
    )
  ).flat();
}
const index = [];
for (const file of await files(root)) {
  if (!file.endsWith("index.html")) continue;
  const html = await readFile(file, "utf8");
  if (/name="robots"[^>]*content="noindex/.test(html)) continue;
  const title = clean(
    html.match(/<title>([\s\S]*?)<\/title>/)?.[1] ?? "",
  ).replace(/ \| Cobbleverse Wiki$/, "");
  const description = clean(
    html.match(/name="description" content="([^"]*)"/)?.[1] ?? "",
  );
  const body =
    html.match(/<article[^>]*>([\s\S]*?)<\/article>/)?.[1] ??
    html.match(/<main[^>]*>([\s\S]*?)<\/main>/)?.[1] ??
    "";
  const headings = [...body.matchAll(/<h[23][^>]*>([\s\S]*?)<\/h[23]>/g)].map(
    (match) => clean(match[1]),
  );
  const url =
    "/" +
    relative(root, file)
      .split(sep)
      .join("/")
      .replace(/index.html$/, "");
  index.push({
    title,
    description,
    headings,
    excerpt: clean(body).slice(0, 1600),
    category: clean(html.match(/class="eyebrow"[^>]*>([^<]*)/)?.[1] ?? "Guide"),
    tags: (html.match(/data-search-tags="([^"]*)"/)?.[1] ?? "")
      .split(",")
      .filter(Boolean),
    aliases: (html.match(/data-search-aliases="([^"]*)"/)?.[1] ?? "")
      .split(",")
      .filter(Boolean),
    url,
  });
}
const commands = JSON.parse(await readFile("src/data/commands.json", "utf8"));
for (const row of commands.filter(
  (row) => row.verified && row.audience === "player" && row.lastVerified,
))
  index.push({
    title: row.command,
    description: row.description,
    category: "Commands",
    headings: [],
    excerpt: row.notes?.join(" ") ?? "",
    tags: [row.category],
    aliases: row.aliases ?? [],
    url: "/commands/",
  });
const sources = [
  ["pokemon.json", "/pokemon/", "Pokédex"],
  ["moves.json", "/battle/moves/", "Moves"],
  ["abilities.json", "/battle/abilities/", "Abilities"],
];
for (const [file, route, category] of sources) {
  const rows = JSON.parse(
    await readFile(join(root, "data/cobbleverse-guides", file), "utf8"),
  );
  for (const row of rows) {
    const title = row.name;
    const description =
      row.shortDescription ??
      row.description ??
      [row.primaryType, row.secondaryType].filter(Boolean).join(" / ");
    index.push({
      title,
      description,
      category,
      headings: [],
      excerpt: description,
      tags: row.labels ?? [],
      aliases: row.nationalPokedexNumber
        ? [String(row.nationalPokedexNumber)]
        : [],
      url: row.nationalPokedexNumber
        ? `${route}?pokemon=${row.nationalPokedexNumber}`
        : `${route}?q=${encodeURIComponent(title)}`,
    });
  }
}
await writeFile(
  join(root, "search-index.json"),
  JSON.stringify(
    index.map((entry) => ({ ...entry, url: `/Cobbleverse-Wiki${entry.url}` })),
  ),
);
console.log(
  `Search: ${index.length} entries derived from published pages and player commands.`,
);
