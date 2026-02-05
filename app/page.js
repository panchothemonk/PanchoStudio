import fs from "node:fs/promises";
import path from "node:path";
import ForgeApp from "../components/ForgeApp";

async function getPanchoImages() {
  const dir = path.join(process.cwd(), "public", "assets", "rotations");
  try {
    const files = await fs.readdir(dir);
    return files
      .filter((file) => /\.(png|webp|jpg|jpeg)$/i.test(file))
      .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
      .map((file) => `/assets/rotations/${file}`);
  } catch {
    return [];
  }
}

export default async function Page() {
  const imagePaths = await getPanchoImages();
  return <ForgeApp imagePaths={imagePaths} />;
}
