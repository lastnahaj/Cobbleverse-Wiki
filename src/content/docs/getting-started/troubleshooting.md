---
title: Troubleshooting
description: Fix common Cobbleverse client, model, map, update, level-cap, and log-sharing problems.
category: Getting Started
order: 8
tags: [troubleshooting, models, maps, logs, crash, level cap]
aliases: [common issues, support, broken textures]
status: published
lastUpdated: 2026-11-01
verified: true
related: [getting-started/install, getting-started/resource-pack]
hero: /assets/sections/art-server-systems.webp
---

## Fast progression diagnostic

Before crafting again or using a command:

1. Confirm the installed Cobbleverse version and the hosted server's rules.
2. Record the Trainer Card's active region, trainer, and cap.
3. Match that trainer in the [Trainer Index](/progression/trainers/) and regional route.
4. Re-check the exact item, quantity, recipe, dimension, biome, and interaction.
5. Classify the failure as a prerequisite, recipe, locator, trainer, dimension, or permission problem.
6. Preserve a privacy-safe screenshot before changing world or progression data.

Distinct cap, party-count, wrong-series, missing-prerequisite, battle-loss, and completion messages point to different causes. Fix the state named by the message rather than changing an unrelated locator.

## Missing or broken Pokémon models

1. Open **Options → Resource Packs**.
2. Hold **T** for about five seconds.
3. Choose **Done** so resources reload.
4. If the problem remains, temporarily disable third-party texture packs and test the unmodified pack.

## A structure map looks wrong

- A missing destination marker can mean the structure sits near the edge of the currently loaded map area. Explore outward and let more chunks load.
- An apparently empty map can be showing an unloaded area or a region without recognizable water or terrain.
- If a cartographer cannot find a destination within 10,000 blocks, travel at least 2,000 blocks before generating another map.
- Hover a legendary-structure map to check the target coordinates. A Battle Seeker can extend the search to a different, potentially unexplored structure.

Confirm the locator tooltip's target, dimension, compatible Cartography Table, and range. A marker is horizontal guidance and may not identify a surface entrance. If no result is found, move to a new area within the correct dimension before spending materials on another copy.

## Trainer or portal state is wrong

- A missing trainer may be inside a shared league, larger story structure, or locked behind the previous visible checkpoint.
- Compare every party member with the active in-game cap and any party-count requirement.
- After a win, verify that the Trainer Card advanced before repeating the old route.
- Giratina, Darkrai, and Arceus use different prerequisites and dimensions; one portal or command cannot substitute for another.
- Preserve the inventory and coordinates privately if a return portal is missing. Do not teleport to an unverified height.

`/locate`, `/tp`, and repair commands require permission. A denied command does not prove that the structure is absent, and progression-repair commands should be used only in a test world or with operator approval.

## Modrinth does not show an update

Open the Modrinth App settings, use **Purge Cache**, close the app, and reopen it. Confirm the server's required pack version before installing an update.

## Pokémon will not level past 25

The public base pack begins the Kanto series with a level cap that rises through Gym progression. Its complete Kanto track contains eight Gym Leaders, four Elite Four members, and Champion Blue. The server may use its own progression state, so do not run the base pack's operator commands on the hosted server; ask support to inspect your Trainer Card and progression record.

## Share useful logs

First reproduce the problem on an unmodified profile.

- **Modrinth:** open the instance's Logs section, choose Share, and send the generated link to the server support channel.
- **CurseForge:** right-click the profile, choose Open Folder, open `logs/latest.log`, and upload it to [mclo.gs](https://mclo.gs/).
- Include the launcher name, what you were doing, and the first time the problem occurred.

Logs can contain usernames, server addresses, and system paths. Review the upload before posting it publicly.

Guide origins: [Lumy Hub](/Cobbleverse-Wiki/sources/#lumy-hub)

Guide origins: [Cobbleverse Guides](/Cobbleverse-Wiki/sources/#cobbleverse-guides)
