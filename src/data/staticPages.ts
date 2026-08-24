import { features } from "./index";

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
    description:
      "Player field guide for the Infinite Gaming Servers Cobbleverse server.",
    category: "Home",
    headings: [
      "Explore the field guide",
      "Regional progression",
      "Battle systems",
      "Server systems",
    ],
    excerpt:
      "Installation, regional leagues, structures, special encounters, server systems, commands, and live player status.",
    tags: ["home", "wiki", "cobbleverse"],
    aliases: ["field guide"],
    path: "/",
  },
  {
    title: "Getting Started",
    description: "Prepare for your first Cobbleverse journey.",
    category: "Getting Started",
    headings: ["Before you join", "Your first route", "Need help?"],
    excerpt:
      "Minecraft 1.21.1, Fabric, server address, installation, Kanto progression, claims, and commands.",
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
      "Regional Gym Leaders, signature items, locations, Elite Four, and Champions.",
    category: "Gyms",
    headings: ["Finding Gyms", "Kanto", "Johto", "Hoenn", "Sinnoh"],
    excerpt:
      "Published Kanto through Sinnoh leader tables with Gym locations, badges, signature items, league members, and champion rewards.",
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
    description:
      "Active Cobbleverse quests, markets, automation, claims, rewards, menus, and battle systems.",
    category: "Features",
    headings: ["System directory", "Status labels", "Client options"],
    excerpt:
      "Journey, Wonder, Bazaar, Smart Trainers, Bloom, Colosseum, CobbleWorkers, Daily Rewards, Flan, SkiesGUIs, and more.",
    tags: ["systems", "mods", "status"],
    aliases: ["server features"],
    path: "/features/",
  },
  {
    title: "Commands",
    description: "Filterable player command reference.",
    category: "Commands",
    headings: ["Command reference", "Publication rules"],
    excerpt:
      "EEssentials, Cobblemon Extras, Daily Rewards, and Colosseum command syntax and aliases.",
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
  ...features.map((feature) => ({
    title: feature.name,
    description: feature.description ?? `${feature.name} on Cobbleverse.`,
    category: "Features",
    headings: ["How it works", "Server settings", "Source documentation"],
    excerpt:
      feature.description ??
      `${feature.name} is categorized as ${feature.category}.`,
    tags: [feature.category, feature.status],
    aliases: [],
    path: `/features/${feature.id}/`,
  })),
];
