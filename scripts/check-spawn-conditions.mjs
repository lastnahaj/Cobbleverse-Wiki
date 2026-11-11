import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import {
  spawnConditionRows,
  conditionKeys,
} from "../src/lib/spawnConditions.ts";
const rows = (data) => Object.fromEntries(spawnConditionRows(data));
assert.equal(
  rows({ minSkyLight: 8, maxSkyLight: 15 })["Sky light level"],
  "8 to 15 (0–15)",
);
assert.equal(rows({ minY: 0, maxY: 0 })["Height (Y)"], "0");
assert.equal(rows({ minY: -41, maxY: 9 })["Height (Y)"], "-41 to 9");
assert.equal(rows({ canSeeSky: false })["Sky access"], "Sky obstructed");
assert.equal(rows({ isRaining: false })["Rain"], "Not raining");
assert.equal(
  rows({ neededNearbyBlocks: ["minecraft:water", "minecraft:flowing_water"] })[
    "Nearby blocks (at least one)"
  ],
  "Water, Flowing Water",
);
assert.equal(
  rows({ timeRange: "5000-10999" })["Time of day"],
  "11:00–16:59 in-game",
);
assert.equal(rows({ moonPhase: "0,4" })["Moon phase"], "Full moon, New moon");
const pokemon = JSON.parse(
  await readFile("public/data/cobbleverse-guides/pokemon.json", "utf8"),
);
let count = 0;
const fields = new Set();
for (const species of pokemon)
  for (const form of [species, ...(species.forms ?? [])])
    for (const spawn of form.spawns ?? [])
      for (const group of [spawn.condition, spawn.anticondition]) {
        if (!group) continue;
        for (const key of Object.keys(group)) {
          assert(conditionKeys.has(key), `Unmapped spawn condition: ${key}`);
          fields.add(key);
        }
        for (const [label, value] of spawnConditionRows(group)) {
          assert(
            label && value,
            `Empty spawn presentation for ${species.name}`,
          );
          assert(
            !/\[object Object\]|\b(?:true|false)\b/.test(value),
            `Raw value for ${species.name}: ${value}`,
          );
          assert(!/[a-z][A-Z]/.test(label), `Raw field label: ${label}`);
        }
        count++;
      }
console.log(
  `Spawn presentation checked: ${count} condition groups, ${fields.size} fields, edge cases passed.`,
);
