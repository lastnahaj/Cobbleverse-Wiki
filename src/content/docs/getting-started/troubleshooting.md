---
title: Troubleshooting
description: Fix common Cobbleverse client, model, map, update, level-cap, and log-sharing problems.
category: Getting Started
order: 8
tags: [troubleshooting, models, maps, logs, crash, level cap]
aliases: [common issues, support, broken textures]
status: published
lastUpdated: 2026-08-24
verified: true
related: [getting-started/install, getting-started/resource-pack]
hero: /assets/art-server-systems.webp
---

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

Sources: [Lumy Hub common issues](https://www.lumyverse.com/wiki/common-issues/), [log-sharing guide](https://www.lumyverse.com/cobbleverse/how-to-share-your-minecraft-logs/), [level-cap guide](https://www.lumyverse.com/cobbleverse/my-pokemon-is-stuck-at-level-25/)
