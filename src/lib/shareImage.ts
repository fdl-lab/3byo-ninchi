import { AnalysisResult } from "./mockAnalysis";

interface ShareImageOptions {
  result: AnalysisResult;
  heroFrameDataUrl?: string | null;
}

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number
): number {
  const chars = text.split("");
  let line = "";
  let currentY = y;

  for (const char of chars) {
    const test = line + char;
    if (ctx.measureText(test).width > maxWidth && line) {
      ctx.fillText(line, x, currentY);
      line = char;
      currentY += lineHeight;
    } else {
      line = test;
    }
  }
  if (line) {
    ctx.fillText(line, x, currentY);
    currentY += lineHeight;
  }
  return currentY;
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

async function ensurePixelFonts(size: number) {
  if (typeof document === "undefined") return;
  await Promise.all([
    document.fonts.load(`400 ${size}px "DotGothic16"`),
    document.fonts.load(`400 16px "Press Start 2P"`),
  ]);
}

function drawPixelText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  size: number,
  align: CanvasTextAlign = "center"
) {
  ctx.font = `400 ${size}px "DotGothic16", monospace`;
  ctx.textAlign = align;
  ctx.textBaseline = "alphabetic";

  const layers = [
    { dx: 4, dy: 4, color: "#3b0764" },
    { dx: 2, dy: 2, color: "#581c87" },
    { dx: 0, dy: 4, color: "#6b21a8" },
    { dx: 4, dy: 0, color: "#9333ea" },
    { dx: 2, dy: 0, color: "#ec4899" },
  ];

  for (const layer of layers) {
    ctx.fillStyle = layer.color;
    ctx.fillText(text, x + layer.dx, y + layer.dy);
  }

  ctx.fillStyle = "#faf5ff";
  ctx.fillText(text, x, y);
}

export async function generateShareImage({
  result,
  heroFrameDataUrl,
}: ShareImageOptions): Promise<Blob> {
  const W = 1080;
  const H = 1920;
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas not supported");

  const bg = ctx.createLinearGradient(0, 0, W, H);
  bg.addColorStop(0, "#030014");
  bg.addColorStop(0.5, "#0a0020");
  bg.addColorStop(1, "#120028");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  ctx.strokeStyle = "rgba(168,85,247,0.08)";
  ctx.lineWidth = 1;
  for (let i = 0; i < W; i += 40) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i, H);
    ctx.stroke();
  }
  for (let i = 0; i < H; i += 40) {
    ctx.beginPath();
    ctx.moveTo(0, i);
    ctx.lineTo(W, i);
    ctx.stroke();
  }

  ctx.fillStyle = "rgba(168,85,247,0.15)";
  ctx.beginPath();
  ctx.arc(W * 0.8, H * 0.15, 300, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "rgba(236,72,153,0.1)";
  ctx.beginPath();
  ctx.arc(W * 0.2, H * 0.7, 250, 0, Math.PI * 2);
  ctx.fill();

  await ensurePixelFonts(64);

  ctx.font = '400 16px "Press Start 2P", monospace';
  ctx.fillStyle = "#c084fc";
  ctx.textAlign = "center";
  ctx.fillText("EYE MEMORY ARCHIVE", W / 2, 72);

  drawPixelText(ctx, "3秒認知", W / 2, 150, 64);

  ctx.font = '400 14px "Press Start 2P", monospace';
  ctx.fillStyle = "#a855f7";
  ctx.fillText("3BYOU NINCHI", W / 2, 185);

  const frameArea = { x: 60, y: 210, w: W - 120, h: 900 };

  if (heroFrameDataUrl) {
    try {
      const img = await loadImage(heroFrameDataUrl);
      const imgRatio = img.width / img.height;
      const areaRatio = frameArea.w / frameArea.h;
      let dw = frameArea.w;
      let dh = frameArea.h;
      let dx = frameArea.x;
      let dy = frameArea.y;

      if (imgRatio > areaRatio) {
        dh = frameArea.w / imgRatio;
        dy = frameArea.y + (frameArea.h - dh) / 2;
      } else {
        dw = frameArea.h * imgRatio;
        dx = frameArea.x + (frameArea.w - dw) / 2;
      }

      ctx.save();
      drawRoundedRect(ctx, frameArea.x, frameArea.y, frameArea.w, frameArea.h, 8);
      ctx.clip();
      ctx.drawImage(img, dx, dy, dw, dh);

      ctx.strokeStyle = "rgba(168,85,247,0.5)";
      ctx.lineWidth = 3;
      ctx.strokeRect(frameArea.x, frameArea.y, frameArea.w, frameArea.h);

      const cx = frameArea.x + frameArea.w / 2;
      const cy = frameArea.y + frameArea.h / 2;
      const r = Math.min(frameArea.w, frameArea.h) * 0.18;
      ctx.strokeStyle = "rgba(236,72,153,0.7)";
      ctx.lineWidth = 2;
      ctx.setLineDash([8, 4]);
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.restore();
    } catch {
      drawPlaceholderFrame(ctx, frameArea);
    }
  } else {
    drawPlaceholderFrame(ctx, frameArea);
  }

  ctx.font = "700 24px monospace";
  ctx.fillStyle = "#ec4899";
  ctx.textAlign = "center";
  ctx.fillText(result.status, W / 2, 1160);

  ctx.font = "900 120px monospace";
  const rateGradient = ctx.createLinearGradient(W * 0.2, 1250, W * 0.8, 1250);
  rateGradient.addColorStop(0, "#c084fc");
  rateGradient.addColorStop(0.5, "#f0abfc");
  rateGradient.addColorStop(1, "#c084fc");
  ctx.fillStyle = rateGradient;
  ctx.shadowColor = "rgba(168,85,247,0.6)";
  ctx.shadowBlur = 20;
  ctx.fillText(`${result.eyeContactRate}%`, W / 2, 1320);
  ctx.shadowBlur = 0;

  ctx.font = "500 32px sans-serif";
  ctx.fillStyle = "rgba(168,85,247,0.7)";
  ctx.fillText("視線一致率", W / 2, 1370);

  ctx.font = "700 36px monospace";
  ctx.fillStyle = "#e8e0ff";
  ctx.fillText(`${result.durationSec} SEC  ·  ${result.gazeZoneLevel}`, W / 2, 1450);

  ctx.font = "400 34px sans-serif";
  ctx.fillStyle = "rgba(232,224,255,0.85)";
  ctx.textAlign = "left";
  wrapText(ctx, `「${result.quote}」`, 80, 1540, W - 160, 50);

  ctx.font = "500 24px monospace";
  ctx.fillStyle = "rgba(168,85,247,0.5)";
  ctx.textAlign = "center";
  ctx.fillText(`${result.event}  ·  ${result.date}`, W / 2, 1720);

  ctx.font = "400 20px monospace";
  ctx.fillStyle = "rgba(168,85,247,0.35)";
  ctx.fillText(result.archiveId, W / 2, 1780);

  ctx.font = "500 22px sans-serif";
  ctx.fillStyle = "rgba(236,72,153,0.6)";
  ctx.fillText(result.tags.join("  "), W / 2, 1840);

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("画像生成に失敗しました"))),
      "image/png",
      1
    );
  });
}

function drawPlaceholderFrame(
  ctx: CanvasRenderingContext2D,
  area: { x: number; y: number; w: number; h: number }
) {
  const grad = ctx.createLinearGradient(area.x, area.y, area.x + area.w, area.y + area.h);
  grad.addColorStop(0, "rgba(99,102,241,0.3)");
  grad.addColorStop(1, "rgba(168,85,247,0.2)");
  ctx.fillStyle = grad;
  drawRoundedRect(ctx, area.x, area.y, area.w, area.h, 8);
  ctx.fill();
  ctx.strokeStyle = "rgba(168,85,247,0.4)";
  ctx.lineWidth = 2;
  ctx.stroke();
}

export function buildShareText(result: AnalysisResult): string {
  return `推しと目が合った…かも 👀✨

視線一致率 ${result.eyeContactRate}%
滞在時間 ${result.durationSec}秒
認知圏 ${result.gazeZoneLevel}

「${result.quote}」

#3秒認知 #推し活 #目が合った ${result.tags.slice(0, 2).join(" ")}`;
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
