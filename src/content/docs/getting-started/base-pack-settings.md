---
title: Base Pack Settings
description: Understand Cobbleverse and LumyMon client settings without confusing them with hosted-server configuration.
category: Getting Started
order: 9
tags: [settings, lumymon, camera, hunger, mobs, config]
aliases: [config, camera roll, remote pc]
status: published
lastUpdated: 2026-08-24
verified: true
related: [getting-started/install, getting-started/troubleshooting]
hero: /assets/sections/art-server-systems.webp
---

These controls come from the public Cobbleverse pack. Client preferences can be changed locally; world and gameplay rules on `cv.infinitegamingservers.com` are controlled by the server.

## Riding camera

Compatible Pokémon can be mounted through **Shift + right-click → Ride**. To reduce motion sickness, open the Cobblemon configuration and change the riding roll setting. The Lumy Hub describes the base pack with camera roll enabled by default.

## LumyMon options

The file `config/lumymon.json` includes:

| Setting                     | Purpose                                                    |
| --------------------------- | ---------------------------------------------------------- |
| `remotePcEnabled`           | Allows remote PC access, normally bound to **P**.          |
| `paleGardenResinGeneration` | Generates resin where the base pack removes Creaking mobs. |
| `creakingToTrevenant`       | Replaces Creaking with Trevenant.                          |
| `ghastToGastly`             | Replaces the Dried Ghast result with Gastly.               |
| `enablePokeSnackBlacklist`  | Applies LumyMon's configured PokeSnack restrictions.       |

PokeSnack blacklist tags are stored inside the LumyMon mod under `data/lumymon/poke_snack_blacklist`. This is pack-author or private-world customization; normal server players should not modify the server's files.

## World-owner settings

The base pack disables hunger and hostile mobs by default. Private-world owners can re-enable hunger by disabling the **COBBLEVERSE – No Hunger** datapack and can restore hostile mobs by removing or disabling **MobsBeGone**. These steps do not change the hosted server.

The base pack also prevents players from damaging wild Pokémon. Private-world owners can change `PlayerDamagePokemon` in the Cobblemon configuration. Ender Dragon and Rayquaza spawning is controlled by dedicated pack files; back up the world before editing them.

Sources: [LumyMon configuration](https://www.lumyverse.com/cobbleverse/how-to-change-lumymon-config/), [camera roll](https://www.lumyverse.com/cobbleverse/how-to-disable-camera-roll/), [hunger and mobs](https://www.lumyverse.com/cobbleverse/how-to-enable-hunger-and-mobs/), [Pokémon damage](https://www.lumyverse.com/cobbleverse/how-to-hit-pokemon/), [End settings](https://www.lumyverse.com/cobbleverse/how-to-disable-rayquaza-in-the-end/)
