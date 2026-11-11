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
    id: "regional-checklists-and-guide-origins",
    date: "2026-11-10",
    kind: "wiki",
    title: "Regional checklists and guide origins",
    description:
      "Search 52 league checkpoints, save a personal checklist, follow numbered regional routes, and find guide origins through local topic links. Riding records are available in the Pokédex.",
  },
  {
    id: "player-catalogues",
    date: "2026-11-10",
    kind: "wiki",
    title: "Battle references and merchant comparisons",
    description:
      "Compare move properties, find Pokémon by ability or learnset, browse item icons, and sort merchant offers by price and stock type.",
  },
  {
    id: "illustrated-design",
    date: "2026-11-10",
    kind: "wiki",
    title: "An illustrated guide to the adventure",
    description:
      "A village hero, illustrated guide navigation, distinct regional scenery, and navy-and-gold article styling.",
  },
  {
    id: "atlas-release",
    date: "2026-11-10",
    kind: "wiki",
    title: "A clearer home for Cobbleverse guides",
    description:
      "Grouped player navigation, a rebuilt homepage, compact references, generated search, and stronger deployment checks.",
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
