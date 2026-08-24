import { features, gyms } from "./index";

export interface StaticSearchEntry {
  title: string;
  description: string;
  category: string;
  headings: string[];
  excerpt: string;
  tags: string[];
  aliases: string[];
  path: string;
}

const pages: StaticSearchEntry[] = [
  {
    title: "Cobbleverse Wiki",
    description: "Official field guide for the Cobbleverse server.",
    category: "Home",
    headings: [
      "Explore the field guide",
      "Regional progression",
      "Battle systems",
      "Server systems",
    ],
    excerpt:
      "Progression, Gyms, worlds, economy systems, features, commands, and server references.",
    tags: ["home", "wiki", "cobbleverse"],
    aliases: ["field guide"],
    path: "/",
  },
  {
    title: "Getting Started",
    description: "Prepare for your first Cobbleverse journey.",
    category: "Getting Started",
    headings: ["Before you join", "Your first route", "Unpublished details"],
    excerpt:
      "Minecraft 1.21.1, Fabric, Spawn, Kanto progression, claims, and economy basics.",
    tags: ["new player", "setup", "spawn"],
    aliases: ["start here", "onboarding"],
    path: "/getting-started/",
  },
  {
    title: "Progression",
    description: "Follow the Cobbleverse route from Kanto through Sinnoh.",
    category: "Progression",
    headings: ["Regional route", "Progression systems", "Milestones and ranks"],
    excerpt:
      "Regional Pokédex progression, Journey, Wonder, playtime ranks, and milestones.",
    tags: ["regions", "pokedex", "ranks"],
    aliases: ["advancement"],
    path: "/progression/",
  },
  {
    title: "Region Progression",
    description: "The structured Kanto, Johto, Hoenn, and Sinnoh route.",
    category: "Progression",
    headings: ["Route order", "Unlock model", "Region reference"],
    excerpt:
      "Unlock each next region through the previous region's Pokédex progression requirement.",
    tags: ["kanto", "johto", "hoenn", "sinnoh"],
    aliases: ["region route"],
    path: "/progression/regions/",
  },
  {
    title: "Playtime Ranks",
    description: "Cobbleverse milestones from Scout to Legendary.",
    category: "Progression",
    headings: ["Playtime track", "Separate rank tracks"],
    excerpt:
      "Fifteen cumulative hour thresholds with independent machine IDs and display names.",
    tags: ["rank", "hours", "playtime"],
    aliases: ["milestones"],
    path: "/progression/ranks/",
  },
  {
    title: "Gyms",
    description:
      "Type-based Gym directory and verification-ready battle records.",
    category: "Gyms",
    headings: ["Type directory", "Published Gym fields", "Battle preparation"],
    excerpt:
      "All standard Pokémon types with neutral unpublished leader, badge, reward, and schedule fields.",
    tags: ["gym", "types", "battle"],
    aliases: ["gym leaders"],
    path: "/gyms/",
  },
  {
    title: "Battle Tower",
    description: "Thirteen escalating Smart Trainer tiers and archetypes.",
    category: "Gyms",
    headings: [
      "Thirteen-tier structure",
      "Trainer archetypes",
      "Configuration boundary",
    ],
    excerpt:
      "Sweeper, Stall, Hyper Offense, Weather, Trick Room, and Tower Masters architecture.",
    tags: ["smart trainers", "tower", "tiers"],
    aliases: ["battle tower"],
    path: "/battle-tower/",
  },
  {
    title: "Worlds",
    description:
      "Cobbleverse destinations, travel systems, and reset-aware notices.",
    category: "Worlds",
    headings: [
      "Destination directory",
      "Travel systems",
      "Reset-aware notices",
    ],
    excerpt:
      "Spawn, Overworld, Origin Islands, RTP, portals, waypoints, and future region worlds.",
    tags: ["spawn", "overworld", "origin", "rtp"],
    aliases: ["destinations"],
    path: "/worlds/",
  },
  {
    title: "Economy",
    description:
      "Cobbledollars, Bazaar, trading, vouchers, passes, and tokens.",
    category: "Economy",
    headings: ["Economy map", "Currencies", "Non-P2W policy"],
    excerpt:
      "Structured player economy documentation with verified-only prices and rewards.",
    tags: ["cobbledollars", "bazaar", "trading"],
    aliases: ["market"],
    path: "/economy/",
  },
  {
    title: "Currencies",
    description: "Active and status-pending currency records.",
    category: "Economy",
    headings: ["Currency directory", "Status meaning"],
    excerpt:
      "Cobbledollars, Reward Vouchers, Poke Coins, Raid Passes, Radiant Vouchers, and seasonal records.",
    tags: ["currency", "voucher", "token"],
    aliases: ["money"],
    path: "/economy/currencies/",
  },
  {
    title: "Features",
    description: "Cobbleverse server systems with explicit publication states.",
    category: "Features",
    headings: ["System directory", "Status model", "Client options"],
    excerpt:
      "Active, planned, optional-client, deprecated, and unknown feature records.",
    tags: ["systems", "mods", "status"],
    aliases: ["server features"],
    path: "/features/",
  },
  {
    title: "Commands",
    description: "Filterable, verified-only command reference.",
    category: "Commands",
    headings: ["Command reference", "Publication rules"],
    excerpt:
      "Command syntax, aliases, audience, examples, notes, and verification metadata.",
    tags: ["commands", "syntax"],
    aliases: ["command list"],
    path: "/commands/",
  },
  {
    title: "Rules",
    description: "Publication home for authoritative server policy.",
    category: "Rules",
    headings: ["Authoritative rules", "Publication model"],
    excerpt:
      "Rules remain pending until the official Cobbleverse policy is supplied.",
    tags: ["rules", "policy"],
    aliases: ["server rules"],
    path: "/rules/",
  },
  {
    title: "Changelog",
    description: "Permanent wiki changes and dated notices.",
    category: "Changelog",
    headings: ["Wiki v1", "Notice policy"],
    excerpt:
      "Wiki releases, maintenance notices, reset notices, and versioned documentation changes.",
    tags: ["updates", "notices", "changes"],
    aliases: ["news"],
    path: "/changelog/",
  },
];

export const staticSearchEntries: StaticSearchEntry[] = [
  ...pages,
  ...gyms.map((gym) => ({
    title: `${gym.type} Gym`,
    description: `Cobbleverse ${gym.type}-type Gym record and publication status.`,
    category: "Gyms",
    headings: ["Gym record", "Challenge details"],
    excerpt:
      "Leader, badge, reward, status, team, schedule, and challenge fields remain verification-gated.",
    tags: ["gym", gym.type.toLowerCase(), "battle"],
    aliases: [`${gym.type} type`],
    path: `/gyms/${gym.id}/`,
  })),
  ...features.map((feature) => ({
    title: feature.name,
    description: `${feature.name} system record, publication status, and documentation structure.`,
    category: "Features",
    headings: ["System record", "Verification boundary"],
    excerpt: `${feature.name} is categorized as ${feature.category} with status ${feature.status}.`,
    tags: [feature.category, feature.status],
    aliases: [],
    path: `/features/${feature.id}/`,
  })),
];
