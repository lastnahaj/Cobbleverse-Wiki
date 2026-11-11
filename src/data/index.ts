import { z } from "zod";
import commandsJson from "./commands.json";
import currenciesJson from "./currencies.json";
import featuresJson from "./features.json";
import navigationJson from "./navigation.json";
import ranksJson from "./ranks.json";
import regionalGymsJson from "./regionalGyms.json";
import regionsJson from "./regions.json";
import serverJson from "./server.json";

const serverSchema = z.object({
  name: z.string(),
  community: z.string(),
  game: z.string(),
  loader: z.string(),
  minecraftVersion: z.string(),
  address: z.string(),
  statusApi: z.url(),
  focus: z.string(),
  website: z.url(),
  discord: z.url(),
  nonP2W: z.boolean(),
  notes: z.array(z.string()),
});

const navigationSchema = z.array(
  z.object({
    label: z.string(),
    href: z.string().regex(/^\/(?!\/)[a-z0-9/-]*$/),
    group: z.enum(["Start", "Gameplay", "Server", "Reference"]),
  }),
);

const regionSchema = z.object({
  id: z.string(),
  name: z.string(),
  order: z.number().int().positive(),
  unlockRequirement: z.string().nullable(),
  status: z.enum(["active", "planned", "retired"]),
});

const rankSchema = z.object({
  id: z.string(),
  name: z.string(),
  track: z.enum(["playtime", "staff", "gym"]),
  hours: z.number().nonnegative().optional(),
  weight: z.number().optional(),
  prefix: z.string().optional(),
});

const featureSchema = z.object({
  id: z.string(),
  name: z.string(),
  category: z.string(),
  status: z.enum([
    "active",
    "planned",
    "optional-client",
    "deprecated",
    "unknown",
  ]),
  description: z.string().optional(),
  article: z.string().optional(),
  externalUrl: z.url().optional(),
  environment: z
    .enum(["server", "client", "both", "infrastructure"])
    .default("server"),
  playerFacing: z.boolean().default(true),
  requiredClient: z.boolean().nullable().default(null),
  optionalClient: z.boolean().default(false),
  serverBehavior: z.string().nullable().default(null),
  verified: z.boolean().default(false),
  lastVerified: z.string().nullable().default(null),
});

const regionalGymSchema = z.object({
  region: z.enum(["Kanto", "Johto", "Hoenn", "Sinnoh"]),
  role: z.enum(["Gym Leader", "Elite Four", "Champion"]),
  name: z.string(),
  type: z.string(),
  badge: z.string().nullable(),
  location: z.string(),
  item: z.string(),
  reward: z.string().optional(),
  status: z.enum(["active", "unknown"]).default("unknown"),
  team: z.array(z.string()).nullable().default(null),
  battleFormat: z.string().nullable().default(null),
  levelRange: z.string().nullable().default(null),
  verified: z.boolean().default(false),
  lastVerified: z.string().nullable().default(null),
});

const currencySchema = z.object({
  id: z.string(),
  name: z.string(),
  category: z.enum(["primary", "voucher", "event", "token"]),
  description: z.string().optional(),
  active: z.boolean().nullable(),
  icon: z.string().optional(),
  status: z.enum(["active", "event", "retired", "unknown"]).optional(),
});

const commandSchema = z.object({
  id: z.string(),
  command: z.string(),
  syntax: z.string().optional(),
  aliases: z.array(z.string()).optional(),
  description: z.string(),
  category: z.string(),
  audience: z.enum(["player", "staff", "admin", "unknown"]),
  examples: z.array(z.string()).optional(),
  notes: z.array(z.string()).optional(),
  related: z.string().optional(),
  verified: z.boolean(),
  lastVerified: z.string().optional(),
  sourceMod: z.string().nullable().default(null),
});

function unique<T>(rows: T[], key: (row: T) => string): T[] {
  const seen = new Set<string>();
  for (const row of rows) {
    const id = key(row);
    if (seen.has(id)) throw new Error(`Duplicate data identifier: ${id}`);
    seen.add(id);
  }
  return rows;
}

export const server = serverSchema.parse(serverJson);
export const navigation = navigationSchema.parse(navigationJson);
export const regions = z
  .array(regionSchema)
  .parse(regionsJson)
  .sort((a, b) => a.order - b.order);
export const ranks = unique(
  z.array(rankSchema).parse(ranksJson),
  (row) => row.id,
);
export const features = unique(
  z.array(featureSchema).parse(featuresJson),
  (row) => row.id,
);
export const regionalGyms = z.array(regionalGymSchema).parse(regionalGymsJson);
export const currencies = unique(
  z.array(currencySchema).parse(currenciesJson),
  (row) => row.id,
).map((row) => ({
  ...row,
  status: row.status ?? (row.active === true ? "active" : "unknown"),
}));
export const commands = unique(
  z.array(commandSchema).parse(commandsJson),
  (row) => row.id,
);

export type Region = z.infer<typeof regionSchema>;
export type Rank = z.infer<typeof rankSchema>;
export type Feature = z.infer<typeof featureSchema>;
export type RegionalGym = z.infer<typeof regionalGymSchema>;
export type Currency = z.infer<typeof currencySchema>;
export type Command = z.infer<typeof commandSchema>;
