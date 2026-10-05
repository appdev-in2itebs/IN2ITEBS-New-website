/**
 * A picture an editor can choose, and the groups the pickers show them in. Plain data, shared by
 * the server-rendered pickers and the client form engine.
 */
export type PictureOption = {
  value: string;
  label: string;
  src: string;
  /** recent: used before on this item · upload: media library · site: shipped with the website · library: hero images */
  group?: "recent" | "upload" | "site" | "library";
};

export const PICTURE_GROUPS = [
  ["recent", "Used before on this page"],
  ["upload", "Uploaded images (Media library)"],
  ["site", "Website's own images"],
  ["library", "Hero image library"],
] as const;

export const pictureGroup = (p: PictureOption) =>
  p.group ?? (p.value.startsWith("https://") ? "upload" : p.value.startsWith("/") ? "site" : "library");
