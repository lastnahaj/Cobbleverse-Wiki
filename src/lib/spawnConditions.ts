type Value =
  string | number | boolean | null | Value[] | { [key: string]: Value };
export const conditionKeys = new Set([
  "minSkyLight",
  "maxSkyLight",
  "minLight",
  "maxLight",
  "biomes",
  "structures",
  "dimensions",
  "neededNearbyBlocks",
  "neededBaseBlocks",
  "canSeeSky",
  "isRaining",
  "isThundering",
  "isSlimeChunk",
  "timeRange",
  "moonPhase",
  "minX",
  "maxX",
  "minY",
  "maxY",
  "minZ",
  "maxZ",
  "minLureLevel",
  "maxLureLevel",
  "rodType",
  "bait",
  "bobber",
]);
export function readableName(value: string): string {
  return value
    .replace(/^#?[^:]+:/, "")
    .replace(/^is_/, "")
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/[_/]+/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}
function clock(tick: number) {
  const minutes = Math.floor(((((tick % 24000) + 24000) % 24000) * 60) / 1000);
  return `${String((Math.floor(minutes / 60) + 6) % 24).padStart(2, "0")}:${String(minutes % 60).padStart(2, "0")}`;
}
function display(value: Value): string {
  if (Array.isArray(value)) return value.map(display).join(", ");
  if (value === null) return "Not specified";
  if (typeof value === "object")
    return Object.entries(value)
      .map(([k, v]) => `${readableName(k)}: ${display(v)}`)
      .join("; ");
  if (typeof value === "boolean") return value ? "Yes" : "No";
  return typeof value === "string"
    ? readableName(value).replace(/(\d)-(\d)/g, "$1–$2")
    : String(value);
}
export function spawnConditionRows(
  data: Record<string, Value> = {},
): [string, string][] {
  const rows: [string, string][] = [];
  const used = new Set<string>();
  for (const [minKey, maxKey, label, scale] of [
    ["minSkyLight", "maxSkyLight", "Sky light level", " (0–15)"],
    ["minLight", "maxLight", "Light level", " (0–15)"],
    ["minX", "maxX", "X coordinate", ""],
    ["minY", "maxY", "Height (Y)", ""],
    ["minZ", "maxZ", "Z coordinate", ""],
    ["minLureLevel", "maxLureLevel", "Lure enchantment level", ""],
  ]) {
    if (data[minKey] === undefined && data[maxKey] === undefined) continue;
    const min = data[minKey],
      max = data[maxKey];
    rows.push([
      label,
      (min !== undefined && max !== undefined
        ? min === max
          ? String(min)
          : `${min} to ${max}`
        : min !== undefined
          ? `At least ${min}`
          : `At most ${max}`) + scale,
    ]);
    used.add(minKey);
    used.add(maxKey);
  }
  const labels: Record<string, string> = {
    biomes: "Biome groups / biomes",
    structures: "Structures",
    dimensions: "Dimensions",
    neededNearbyBlocks: "Nearby blocks (at least one)",
    neededBaseBlocks: "Block beneath the spawn (at least one)",
    canSeeSky: "Sky access",
    isRaining: "Rain",
    isThundering: "Thunderstorm",
    isSlimeChunk: "Slime chunk",
    timeRange: "Time of day",
    moonPhase: "Moon phase",
    rodType: "Fishing rod",
    bait: "Fishing bait",
    bobber: "Fishing bobber",
  };
  const moons = [
    "Full moon",
    "Waning gibbous",
    "Last quarter",
    "Waning crescent",
    "New moon",
    "Waxing crescent",
    "First quarter",
    "Waxing gibbous",
  ];
  for (const [key, value] of Object.entries(data)) {
    if (used.has(key)) continue;
    let text = display(value);
    if (key === "canSeeSky")
      text = value ? "Open to the sky" : "Sky obstructed";
    if (key === "isRaining") text = value ? "Raining" : "Not raining";
    if (key === "isThundering") text = value ? "Thundering" : "Not thundering";
    if (key === "isSlimeChunk")
      text = value ? "Inside a slime chunk" : "Outside slime chunks";
    if (key === "moonPhase")
      text = String(value)
        .split(",")
        .map((v) => moons[Number(v.trim())] ?? `Phase ${v.trim()}`)
        .join(", ");
    if (key === "timeRange")
      text = String(value)
        .split(",")
        .map((v) => {
          const range = /^(\d+)-(\d+)$/.exec(v.trim());
          return range
            ? `${clock(Number(range[1]))}–${clock(Number(range[2]))} in-game`
            : readableName(v.trim());
        })
        .join(", ");
    rows.push([labels[key] ?? readableName(key), text]);
  }
  return rows;
}
