import { mkdir, readFile, writeFile, access } from "node:fs/promises";
import sharp from "sharp";

const records = JSON.parse(
  await readFile("public/data/cobbleverse-guides/pokemon.json", "utf8"),
);
const slug = (text) =>
  String(text)
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
async function json(url) {
  const response = await fetch(url);
  if (!response.ok) throw Error(`${url}: ${response.status}`);
  return response.json();
}
const dex = await json("https://play.pokemonshowdown.com/data/pokedex.json");
const response = await fetch(
  "https://raw.githubusercontent.com/PokeAPI/pokeapi/master/data/v2/csv/pokemon.csv",
);
if (!response.ok) throw Error(`Form catalogue: ${response.status}`);
const rows = (await response.text())
  .trim()
  .split("\n")
  .slice(1)
  .map((line) => {
    const [id, identifier, species] = line.split(",");
    return { id: Number(id), identifier, species: Number(species) };
  });
const output = "public/assets/pokemon/forms";
await mkdir(output, { recursive: true });
const manifest = {};
const missing = [];
const aliases = {
  "201:!": "exclamation",
  "201:?": "question",
  "25:Original": "originalcap",
  "25:Hoenn": "hoenncap",
  "25:Sinnoh": "sinnohcap",
  "25:Unova": "unovacap",
  "25:Kalos": "kaloscap",
  "25:Alola": "alolacap",
  "25:World": "worldcap",
  "25:Partner": "partnercap",
  "128:Paldea-Combat": "paldeacombat",
  "128:Paldea-Blaze": "paldeablaze",
  "128:Paldea-Aqua": "paldeaaqua",
  "658:Bond": "battlebond",
  "670:Eternal": "eternal",
  "678:F": "f",
  "718:10%": "10",
  "718:10%-C": "10",
  "718:50%-C": "",
  "741:Pa’u": "pau",
  "774:Meteor": "meteor",
  "801:Original": "original",
  "849:Low-Key-Gmax": "gmax",
  "876:F": "f",
  "892:Gmax": "gmax",
  "892:Rapid-Strike-Gmax": "rapidstrikegmax",
  "898:Ice": "ice",
  "898:Shadow": "shadow",
  "902:F": "f",
  "916:F": "f",
  "925:Four": "four",
  "931:Blue": "blue",
  "931:Yellow": "yellow",
  "931:White": "white",
  "1017:Teal-Tera": "tealtera",
  "678:Mega": "mmega",
  "801:MegaO": "originalmega",
  "875:Noice-Face": "noice",
  "978:Mega": "curlymega",
  "978:MegaS": "stretchymega",
  "978:MegaD": "droopymega",
};
const tasks = records.flatMap((p) => [
  { p },
  ...(p.forms ?? []).map((form) => ({ p, form })),
]);
let cursor = 0;
async function download(url, file, optimize = false) {
  try {
    await access(file);
    return true;
  } catch {}
  const result = await fetch(url);
  if (result.status === 404) return false;
  if (!result.ok) throw Error(`${url}: ${result.status}`);
  const bytes = Buffer.from(await result.arrayBuffer());
  if (optimize)
    await sharp(bytes)
      .resize(475, 475, { fit: "inside", withoutEnlargement: true })
      .webp({ quality: 88 })
      .toFile(file);
  else await writeFile(file, bytes);
  return true;
}
async function worker() {
  while (cursor < tasks.length) {
    const { p, form } = tasks[cursor++];
    const id = p.nationalPokedexNumber;
    const key = form ? `${id}:${form.name}` : String(id);
    const base = slug(p.name);
    const suffix = aliases[key] ?? slug(form?.name ?? "");
    const shared =
      form?.name.endsWith("-Bias") || key === "744:Dusk" || key === "718:50%-C";
    const candidate = Object.values(dex).find(
      (d) =>
        d.num === id &&
        (form && !shared ? slug(d.forme ?? "") === suffix : !d.baseSpecies),
    );
    const sprite = candidate
      ? `${slug(candidate.baseSpecies ?? candidate.name)}${candidate.forme ? `-${slug(candidate.forme)}` : ""}`
      : `${base}${form && !shared ? `-${suffix}` : ""}`;
    const assetKey = `${id}${form && !shared ? `-${slug(form.name) || (form.name === "!" ? "exclamation" : "question")}` : ""}`;
    const item = {};
    if (!form || shared) item.static = `assets/pokemon/${id}.webp`;
    else {
      const artSuffix = key === "892:Gmax" ? "singlestrikegmax" : suffix;
      const artRow = rows.find(
        (r) => r.species === id && slug(r.identifier) === `${base}${artSuffix}`,
      );
      if (
        artRow &&
        (await download(
          `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${artRow.id}.png`,
          `${output}/${assetKey}.webp`,
          true,
        ))
      )
        item.static = `assets/pokemon/forms/${assetKey}.webp`;
      else if (
        await download(
          `https://play.pokemonshowdown.com/sprites/dex/${sprite}.png`,
          `${output}/${assetKey}.webp`,
          true,
        )
      )
        item.static = `assets/pokemon/forms/${assetKey}.webp`;
    }
    if (
      await download(
        `https://play.pokemonshowdown.com/sprites/ani/${sprite}.gif`,
        `${output}/${assetKey}.gif`,
      )
    ) {
      const animation = await sharp(`${output}/${assetKey}.gif`, {
        animated: true,
      }).metadata();
      if ((animation.pages ?? 1) > 1)
        item.animated = `assets/pokemon/forms/${assetKey}.gif`;
      // A still first frame also covers forms without a separate illustration.
      if (!item.static) {
        await sharp(`${output}/${assetKey}.gif`)
          .webp({ quality: 90 })
          .toFile(`${output}/${assetKey}.webp`);
        item.static = `assets/pokemon/forms/${assetKey}.webp`;
      }
    }
    if (item.static)
      manifest[key] = {
        ...item,
        ...(shared ? { sharedAppearance: true } : {}),
      };
    else missing.push({ species: id, form: form?.name ?? "Base" });
    if (cursor % 100 === 0) console.log(`Processed ${cursor}/${tasks.length}`);
  }
}
await Promise.all(Array.from({ length: 8 }, worker));
const sorted = Object.fromEntries(
  Object.entries(manifest).sort(([a], [b]) =>
    a.localeCompare(b, "en", { numeric: true }),
  ),
);
await writeFile(
  "public/data/cobbleverse-guides/pokemon-art.json",
  JSON.stringify(sorted, null, 2) + "\n",
);
await writeFile(
  `${output}/credits.json`,
  JSON.stringify(
    {
      sources: [
        "https://github.com/PokeAPI/sprites",
        "https://play.pokemonshowdown.com/",
        "https://github.com/smogon/sprites",
      ],
      rights:
        "Pokémon artwork belongs to its respective owners. Battle sprites are provided by Pokémon Showdown and its sprite contributors.",
      entries: Object.keys(sorted).length,
      animated: Object.values(sorted).filter((x) => x.animated).length,
      missing: missing.sort(
        (a, b) => a.species - b.species || a.form.localeCompare(b.form),
      ),
    },
    null,
    2,
  ) + "\n",
);
console.log(
  JSON.stringify({
    entries: Object.keys(sorted).length,
    animated: Object.values(sorted).filter((x) => x.animated).length,
    missing,
  }),
);
