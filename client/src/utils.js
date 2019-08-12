import { get } from "lodash";

const getImageUrl = x => {
  const images = x.type === "track" ? get(x, "album.images") : get(x, "images");
  const image = images.filter(image => image.height === 300)[0];
  return image.url;
};

export const searchTransform = searchResults => {
  const getLabel = x =>
    x.type === "track"
      ? `${x.name} - ${x.artists.map(x => x.name).join(", ")}`
      : x.name;

  return searchResults.map(x => ({
    id: x.id,
    type: x.type,
    label: getLabel(x),
    imageUrl: getImageUrl(x)
  }));
};

export const trackTransform = track => ({
  id: track.id,
  name: track.name,
  artists: track.artists,
  imageUrl: getImageUrl(track)
});
