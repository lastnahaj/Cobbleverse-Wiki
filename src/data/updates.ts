import { z } from "zod";
const schema = z.array(
  z.object({
    id: z.string(),
    date: z.iso.date(),
    kind: z.enum(["wiki", "server", "event", "maintenance", "breaking"]),
    title: z.string(),
    description: z.string(),
    ended: z.boolean().optional(),
  }),
);
export const updates = schema.parse([
  {
    id: "atlas-release",
    date: "2026-11-10",
    kind: "wiki",
    title: "A clearer home for Cobbleverse guides",
    description:
      "Grouped player navigation, a rebuilt homepage, compact references, generated search, and custom-domain preparation.",
  },
  {
    id: "reference-expansion",
    date: "2026-11-01",
    kind: "wiki",
    title: "Reference catalogues expanded",
    description:
      "Pokémon, move, and ability data added alongside indexed item, shop, trainer, and guide summaries.",
  },
  {
    id: "lumy-guides",
    date: "2026-08-24",
    kind: "wiki",
    title: "Regional and server guides expanded",
    description:
      "Regional leagues, structures, special encounters, commands, and server-system references.",
  },
]);
