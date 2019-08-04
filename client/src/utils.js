import { get } from "lodash";

export const searchTransform = searchResults => {
  const getLabel = x =>
    x.type === "track"
      ? `${x.name} - ${x.artists.map(x => x.name).join(", ")}`
      : x.name;

  const getImageUrl = x =>
    x.type === "track"
      ? get(x, "album.images[2].url")
      : get(x, "images[2].url");

  return searchResults.map(x => ({
    id: x.id,
    type: x.type,
    label: getLabel(x),
    imageUrl: getImageUrl(x)
  }));
};