import fs from "fs";
import path from "path";

export async function GET() {
  const artDir = path.join(process.cwd(), "public", "art");

  if (!fs.existsSync(artDir)) {
    return Response.json([]);
  }

  const files = fs.readdirSync(artDir);

  const images = files
    .filter((file) => /\.(png|jpe?g|gif|webp)$/i.test(file))
    .map((file) => ({
      name: file,
      time: fs.statSync(path.join(artDir, file)).mtime.getTime(),
    }))
    .sort((a, b) => a.time - b.time)
    .map((file) => `/art/${file.name}`);

  return Response.json(images);
}
