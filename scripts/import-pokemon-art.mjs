import { mkdir, readFile, writeFile, access } from "node:fs/promises";
import sharp from "sharp";
const records = JSON.parse(
  await readFile("public/data/cobbleverse-guides/pokemon.json", "utf8"),
);
const output = "public/assets/pokemon";
await mkdir(output, { recursive: true });
let cursor = 0,
  done = 0;
const missing = [];
async function worker() {
  while (cursor < records.length) {
    const row = records[cursor++];
    const id = row.nationalPokedexNumber;
    const file = `${output}/${id}.webp`;
    try {
      await access(file);
      done++;
      continue;
    } catch {}
    try {
      const response = await fetch(
        `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`,
      );
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      await sharp(Buffer.from(await response.arrayBuffer()))
        .resize(475, 475, { fit: "inside", withoutEnlargement: true })
        .webp({ quality: 88 })
        .toFile(file);
      done++;
    } catch (error) {
      missing.push({ id, name: row.name, error: error.message });
    }
    if ((done + missing.length) % 100 === 0)
      console.log(`${done} images imported`);
  }
}
await Promise.all(Array.from({ length: 10 }, worker));
await writeFile(
  `${output}/credits.json`,
  JSON.stringify(
    {
      source: "https://github.com/PokeAPI/sprites",
      directory: "sprites/pokemon/other/official-artwork",
      rights:
        "Pokémon characters and artwork belong to their respective owners. Artwork is supplied through the PokéAPI sprite repository for reference identification.",
      count: done,
      missing,
    },
    null,
    2,
  ) + "\n",
);
console.log(JSON.stringify({ imported: done, missing }));
if (missing.length) process.exitCode = 1;
