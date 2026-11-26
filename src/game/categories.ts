// Standardnavnene brukes også som faste id-er for kategoriene.
export const CATEGORY_IDS = ["Sted", "Tall", "Mat og drikke", "Tid"];

export const SCORES = [100, 200, 300, 400, 500];

export function toTileId(categoryId: string, score: number) {
  return `${categoryId}-${score}`;
}

export function toCategoryName(
  categoryNames: Record<string, string>,
  categoryId: string
) {
  return categoryNames[categoryId]?.trim() || categoryId;
}
