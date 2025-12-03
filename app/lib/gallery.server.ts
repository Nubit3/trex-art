import fs from "fs";
import path from "path";

export function getGalleryImages() {
  const artDir = path.join(process.cwd(), "public", "art");

  if (!fs.existsSync(artDir)) return [];

  const files = fs.readdirSync(artDir);

  return files
    .filter((file) => /\.(png|jpe?g|gif|webp)$/i.test(file))
    .map((file) => ({
      name: file,
      time: fs.statSync(path.join(artDir, file)).mtime.getTime(),
    }))
    .sort((a, b) => a.time - b.time)
    .map((file) => `/art/${file.name}`);
}
