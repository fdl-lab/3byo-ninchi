import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile, toBlobURL } from "@ffmpeg/util";

export interface ConvertProgress {
  stage: "loading" | "converting" | "done";
  progress: number;
  message: string;
}

let ffmpegInstance: FFmpeg | null = null;
let loadPromise: Promise<FFmpeg> | null = null;

const FFMPEG_CORE_VERSION = "0.12.6";
const FFMPEG_BASE = `https://unpkg.com/@ffmpeg/core@${FFMPEG_CORE_VERSION}/dist/esm`;

function getInputExtension(file: File): string {
  const name = file.name.toLowerCase();
  if (name.endsWith(".mov")) return "mov";
  if (name.endsWith(".m4v")) return "m4v";
  return "mp4";
}

async function getFFmpeg(): Promise<FFmpeg> {
  if (ffmpegInstance?.loaded) return ffmpegInstance;
  if (loadPromise) return loadPromise;

  loadPromise = (async () => {
    const ffmpeg = new FFmpeg();

    await ffmpeg.load({
      coreURL: await toBlobURL(`${FFMPEG_BASE}/ffmpeg-core.js`, "text/javascript"),
      wasmURL: await toBlobURL(`${FFMPEG_BASE}/ffmpeg-core.wasm`, "application/wasm"),
    });

    ffmpegInstance = ffmpeg;
    return ffmpeg;
  })();

  return loadPromise;
}

export async function testVideoPipeline(file: File): Promise<boolean> {
  const url = URL.createObjectURL(file);

  try {
    const video = document.createElement("video");
    video.muted = true;
    video.playsInline = true;
    video.preload = "auto";
    video.src = url;

    await new Promise<void>((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error("timeout")), 8000);
      video.onloadeddata = () => {
        clearTimeout(timer);
        resolve();
      };
      video.onerror = () => {
        clearTimeout(timer);
        reject(new Error("decode failed"));
      };
    });

    const seekTime = Math.min(0.5, Math.max(video.duration * 0.05, 0.01));
    video.currentTime = seekTime;

    await new Promise<void>((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error("seek timeout")), 5000);
      video.onseeked = () => {
        clearTimeout(timer);
        resolve();
      };
      video.onerror = () => {
        clearTimeout(timer);
        reject(new Error("seek failed"));
      };
    });

    const canvas = document.createElement("canvas");
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext("2d");
    if (!ctx) return false;

    ctx.drawImage(video, 0, 0, 64, 64);
    canvas.toDataURL("image/jpeg", 0.5);
    return true;
  } catch {
    return false;
  } finally {
    URL.revokeObjectURL(url);
  }
}

export async function needsConversion(file: File): Promise<boolean> {
  const lower = file.name.toLowerCase();

  if (lower.endsWith(".mov") || file.type === "video/quicktime") {
    return true;
  }

  const compatible = await testVideoPipeline(file);
  return !compatible;
}

export async function convertToMp4(
  file: File,
  onProgress?: (progress: ConvertProgress) => void
): Promise<Blob> {
  onProgress?.({
    stage: "loading",
    progress: 5,
    message: "変換エンジンを読み込み中...",
  });

  const ffmpeg = await getFFmpeg();

  ffmpeg.on("progress", ({ progress }) => {
    if (progress >= 0 && progress <= 1) {
      onProgress?.({
        stage: "converting",
        progress: Math.max(12, Math.min(Math.round(progress * 100), 99)),
        message: "H.264 MP4 に変換中...",
      });
    }
  });

  const inputName = `input.${getInputExtension(file)}`;
  const outputName = "output.mp4";

  onProgress?.({
    stage: "converting",
    progress: 8,
    message: "動画データを準備中...",
  });

  await ffmpeg.writeFile(inputName, await fetchFile(file));

  onProgress?.({
    stage: "converting",
    progress: 12,
    message: "H.264 MP4 に変換中...",
  });

  const exitCode = await ffmpeg.exec([
    "-i",
    inputName,
    "-map",
    "0:v:0",
    "-map",
    "0:a:0?",
    "-c:v",
    "libx264",
    "-preset",
    "ultrafast",
    "-crf",
    "28",
    "-pix_fmt",
    "yuv420p",
    "-c:a",
    "aac",
    "-b:a",
    "128k",
    "-movflags",
    "+faststart",
    "-y",
    outputName,
  ]);

  if (exitCode !== 0) {
    throw new Error(`FFmpeg exited with code ${exitCode}`);
  }

  const data = await ffmpeg.readFile(outputName);

  try {
    await ffmpeg.deleteFile(inputName);
    await ffmpeg.deleteFile(outputName);
  } catch {
    /* cleanup best-effort */
  }

  onProgress?.({
    stage: "done",
    progress: 100,
    message: "変換完了！",
  });

  const buffer =
    typeof data === "string"
      ? new TextEncoder().encode(data)
      : new Uint8Array(data);

  return new Blob([buffer], { type: "video/mp4" });
}

export async function prepareVideoForAnalysis(
  file: File,
  onProgress?: (progress: ConvertProgress) => void
): Promise<{ blob: Blob; converted: boolean }> {
  const shouldConvert = await needsConversion(file);

  if (!shouldConvert) {
    onProgress?.({
      stage: "done",
      progress: 100,
      message: "そのまま解析可能",
    });
    return { blob: file, converted: false };
  }

  const blob = await convertToMp4(file, onProgress);
  return { blob, converted: true };
}
