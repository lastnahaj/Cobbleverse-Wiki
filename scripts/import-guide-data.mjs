import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";

const sourceOrigin = "https://www.cobbleverseguides.com";
const outputDirectory = join(
  process.cwd(),
  "public",
  "data",
  "cobbleverse-guides",
);

const feeds = {
  pokemon: "/all_pokemons.json",
  moves: "/all_moves.json",
  abilities: "/all_abilities.json",
  search: "/search-index.json",
};

async function readJson(path) {
  const response = await fetch(`${sourceOrigin}${path}`, {
    headers: { accept: "application/json" },
  });
  if (!response.ok) {
    throw new Error(`${path} returned HTTP ${response.status}`);
  }
  return response.json();
}

const [pokemon, moves, abilities, search] = await Promise.all(
  Object.values(feeds).map(readJson),
);

if (!Array.isArray(pokemon) || pokemon.length < 1_000) {
  throw new Error("The Pokémon feed is incomplete.");
}
if (!Array.isArray(moves) || moves.length < 900) {
  throw new Error("The move feed is incomplete.");
}
if (!Array.isArray(abilities) || abilities.length < 300) {
  throw new Error("The ability feed is incomplete.");
}
if (!Array.isArray(search)) {
  throw new Error("The reference index is not an array.");
}

const supportedTypes = new Set([
  "ability",
  "guide",
  "item",
  "move",
  "pokemon",
  "shop",
  "trainer",
]);
const referenceIndex = search.filter((entry) => {
  return supportedTypes.has(entry?.type);
});

await mkdir(outputDirectory, { recursive: true });

const files = {
  "pokemon.json": pokemon,
  "moves.json": moves,
  "abilities.json": abilities,
  "reference-index.json": referenceIndex,
};

for (const [name, value] of Object.entries(files)) {
  await writeFile(join(outputDirectory, name), JSON.stringify(value));
}

const typeCounts = Object.fromEntries(
  referenceIndex.reduce((counts, entry) => {
    const type = entry.type ?? "unknown";
    counts.set(type, (counts.get(type) ?? 0) + 1);
    return counts;
  }, new Map()),
);

await writeFile(
  join(outputDirectory, "manifest.json"),
  JSON.stringify(
    {
      source: sourceOrigin,
      importedAt: new Date().toISOString(),
      counts: {
        pokemon: pokemon.length,
        moves: moves.length,
        abilities: abilities.length,
        ...typeCounts,
      },
    },
    null,
    2,
  ),
);

console.log(
  `Imported ${pokemon.length} Pokémon, ${moves.length} moves, ${abilities.length} abilities, and ${referenceIndex.length} indexed references.`,
);
