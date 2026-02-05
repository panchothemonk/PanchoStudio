"use client";

import { useEffect, useMemo, useRef, useState } from "react";

const MOODS = ["calm", "hyped", "reckless", "focused", "victorious", "cursed"];

const SIZES = {
  master: 1024,
  telegram: 640,
  x: 400,
  tiktok: 200,
  instagram: 320
};

export default function ForgeApp({ imagePaths }) {
  const [loadedImages, setLoadedImages] = useState([]);
  const [status, setStatus] = useState("Loading Pancho assets...");
  const [platform, setPlatform] = useState("telegram");
  const [edition, setEdition] = useState(null);
  const previewRef = useRef(null);

  useEffect(() => {
    if (!imagePaths.length) {
      setStatus("No Pancho files found in public/assets/rotations.");
      return;
    }

    let mounted = true;
    Promise.all(imagePaths.map(loadImage)).then((images) => {
      if (!mounted) return;
      const valid = images.filter(Boolean);
      setLoadedImages(valid);
      if (!valid.length) {
        setStatus("Could not load Pancho assets.");
        return;
      }
      const first = createEdition(valid);
      setEdition(first);
      setStatus(`${valid.length} Pancho assets loaded. Hit Generate to keep rolling.`);
    });

    return () => {
      mounted = false;
    };
  }, [imagePaths]);

  const currentImage = useMemo(() => {
    if (!edition) return null;
    return loadedImages.find((item) => item.src === edition.src) || null;
  }, [loadedImages, edition]);

  useEffect(() => {
    if (!edition || !currentImage || !previewRef.current) return;
    const ctx = previewRef.current.getContext("2d");
    drawComposite(ctx, 1024, edition, currentImage);
  }, [edition, currentImage]);

  function generateNew() {
    if (!loadedImages.length) {
      setStatus("Still loading assets. Try again in a second.");
      return;
    }
    const next = createEdition(loadedImages);
    setEdition(next);
    setStatus(`Fresh roll ready: ${next.paletteTag} | ${next.mood.toUpperCase()}`);
  }

  function downloadCurrent() {
    if (!edition || !currentImage) return;
    const size = SIZES[platform] || SIZES.master;
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");
    drawComposite(ctx, size, edition, currentImage);

    const link = document.createElement("a");
    link.href = canvas.toDataURL("image/png");
    link.download = `pancho-${edition.seed}-${platform}.png`;
    link.click();
    setStatus(`Downloaded ${platform.toUpperCase()} version.`);
  }

  return (
    <main className="shell">
      <section className="hero">
        <p className="kicker">Pancho Studio</p>
        <h1>Roll Until It Hits.</h1>
      </section>

      <section className="forge">
        <article className="viewer">
          <canvas ref={previewRef} width="1024" height="1024" className="preview" />
          <p className="status">{status}</p>
          {edition ? (
            <p className="traits">
              Seed: <strong>{edition.seed}</strong> | Palette: <strong>{edition.paletteTag}</strong> | Mood: <strong>{edition.mood.toUpperCase()}</strong>
            </p>
          ) : null}
        </article>

        <article className="controls">
          <label className="label" htmlFor="platform">Download size</label>
          <select id="platform" value={platform} onChange={(event) => setPlatform(event.target.value)}>
            <option value="telegram">Telegram (640x640)</option>
            <option value="x">X.com (400x400)</option>
            <option value="tiktok">TikTok (200x200)</option>
            <option value="instagram">Instagram (320x320)</option>
          </select>

          <button className="button primary" type="button" onClick={generateNew}>
            Generate New
          </button>
          <button className="button" type="button" onClick={downloadCurrent} disabled={!edition}>
            Download This One
          </button>
        </article>
      </section>
    </main>
  );
}

function createEdition(images) {
  const seed = crypto.randomUUID().slice(0, 8);
  const rng = seededRng(seed);
  const baseHue = Math.floor(rng() * 360);
  return {
    seed,
    mood: pick(MOODS, rng),
    src: pick(images, rng).src,
    baseHue,
    paletteTag: `${baseHue}\u00b0 Shift`
  };
}

function drawComposite(ctx, size, card, image) {
  const rng = seededRng(card.seed + card.mood + card.baseHue);
  drawColorBackground(ctx, size, card.baseHue, rng);

  const scale = clamp((size * 0.72) / Math.max(image.width, image.height), 0.25, 4);
  const drawW = image.width * scale;
  const drawH = image.height * scale;
  const x = (size - drawW) * (0.5 + (rng() - 0.5) * 0.08);
  const y = (size - drawH) * (0.57 + (rng() - 0.5) * 0.08);

  ctx.save();
  ctx.filter = "drop-shadow(0 16px 22px rgba(0,0,0,0.35))";
  ctx.drawImage(image, x, y, drawW, drawH);
  ctx.restore();
}

function drawColorBackground(ctx, size, baseHue, rng) {
  const saturation = 55 + Math.floor(rng() * 40);
  const lightness = 38 + Math.floor(rng() * 30);
  ctx.fillStyle = `hsl(${baseHue} ${saturation}% ${lightness}%)`;
  ctx.fillRect(0, 0, size, size);
}

function seededRng(seedText) {
  let hash = 2166136261;
  for (let i = 0; i < seedText.length; i += 1) {
    hash ^= seedText.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }

  return () => {
    hash += hash << 13;
    hash ^= hash >>> 7;
    hash += hash << 3;
    hash ^= hash >>> 17;
    hash += hash << 5;
    return (hash >>> 0) / 4294967295;
  };
}

function pick(list, rng = Math.random) {
  return list[Math.floor(rng() * list.length)];
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function loadImage(src) {
  return new Promise((resolve) => {
    const image = new Image();
    image.crossOrigin = "anonymous";
    image.onload = () => resolve(image);
    image.onerror = () => resolve(null);
    image.src = src;
  });
}
