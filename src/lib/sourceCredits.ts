export function sourceCreditPath(source: string): string {
  if (/lumyverse\.com/i.test(source)) return "/sources/#lumy-hub";
  if (/cobbleverseguides\.com/i.test(source))
    return "/sources/#cobbleverse-guides";
  if (/cobbleverse\.wiki/i.test(source)) return "/sources/#base-wiki";
  if (/matchamodd\.ing/i.test(source)) return "/sources/#matcha";
  if (/accieo\.com/i.test(source)) return "/sources/#cobbleworkers";
  if (/PokeAPI|pokemonshowdown|smogon/i.test(source))
    return "/sources/#artwork";
  return "/sources/#mods";
}
