import fs from "node:fs/promises";
import path from "node:path";
import ForgeApp from "../components/ForgeApp";

const EXCLUDED_ROTATIONS = new Set([
  "2d6cc614-631f-4d4e-836b-3ec2b42a0594.png",
  "c1c2b294-adac-4c77-9d52-420ec7684d77.png",
  "dca007a5-9db8-4e34-a303-35f76a1cfe51.png"
]);

async function getPanchoImages() {
  const dir = path.join(process.cwd(), "public", "assets", "rotations");
  try {
    const files = await fs.readdir(dir);
    return files
      .filter((file) => /\.(png|webp|jpg|jpeg)$/i.test(file))
      .filter((file) => !EXCLUDED_ROTATIONS.has(file))
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
