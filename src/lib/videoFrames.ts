export interface VideoMeta {
  width: number;
  height: number;
  duration: number;
  isPortrait: boolean;
  aspectRatio: number;
}

export interface VideoFrame {
  timeSec: number;
  timestamp: string;
  dataUrl: string;
}

export function formatTimestamp(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  const ms = Math.floor((sec % 1) * 100);
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}.${String(ms).padStart(2, "0")}`;
}

function loadVideo(url: string): Promise<HTMLVideoElement> {
  return new Promise((resolve, reject) => {
    const video = document.createElement("video");
    video.muted = true;
    video.playsInline = true;
    video.preload = "auto";
    video.src = url;

    video.onloadedmetadata = () => resolve(video);
    video.onerror = () => reject(new Error("動画の読み込みに失敗しました"));
  });
}

function seekVideo(video: HTMLVideoElement, timeSec: number): Promise<void> {
  return new Promise((resolve) => {
    const clamped = Math.min(Math.max(timeSec, 0), Math.max(video.duration - 0.05, 0));
    if (Math.abs(video.currentTime - clamped) < 0.01) {
      resolve();
      return;
    }
    video.onseeked = () => resolve();
    video.currentTime = clamped;
  });
}

function captureFrame(
  video: HTMLVideoElement,
  maxWidth: number,
  quality = 0.8
): string {
  const scale = Math.min(1, maxWidth / video.videoWidth);
  const w = Math.round(video.videoWidth * scale);
  const h = Math.round(video.videoHeight * scale);

  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;

  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas not supported");

  ctx.drawImage(video, 0, 0, w, h);
  return canvas.toDataURL("image/jpeg", quality);
}

export async function getVideoMeta(url: string): Promise<VideoMeta> {
  const video = await loadVideo(url);
  return {
    width: video.videoWidth,
    height: video.videoHeight,
    duration: video.duration,
    isPortrait: video.videoHeight > video.videoWidth,
    aspectRatio: video.videoWidth / video.videoHeight,
  };
}

export async function extractFrameAt(
  url: string,
  timeSec: number,
  maxWidth = 320
): Promise<string> {
  const video = await loadVideo(url);
  await seekVideo(video, timeSec);
  return captureFrame(video, maxWidth);
}

export interface ExtractedFramesResult {
  frames: VideoFrame[];
  highlightIndex: number;
  heroFrameDataUrl: string;
  momentSec: number;
  meta: VideoMeta;
}

export async function extractEyeContactFrames(
  url: string,
  momentSec?: number
): Promise<ExtractedFramesResult> {
  const video = await loadVideo(url);
  const meta: VideoMeta = {
    width: video.videoWidth,
    height: video.videoHeight,
    duration: video.duration,
    isPortrait: video.videoHeight > video.videoWidth,
    aspectRatio: video.videoWidth / video.videoHeight,
  };

  const duration = video.duration || 10;
  const center =
    momentSec ??
    duration * 0.3 + Math.random() * duration * 0.4;

  const frameCount = 6;
  const interval = 0.15;
  const highlightIndex = Math.floor(frameCount / 2);
  const startTime = Math.max(0, center - highlightIndex * interval);

  const frames: VideoFrame[] = [];

  for (let i = 0; i < frameCount; i++) {
    const timeSec = Math.min(startTime + i * interval, duration - 0.05);
    await seekVideo(video, timeSec);
    frames.push({
      timeSec,
      timestamp: formatTimestamp(timeSec),
      dataUrl: captureFrame(video, 240, 0.72),
    });
  }

  await seekVideo(video, center);
  const heroFrameDataUrl = captureFrame(video, meta.isPortrait ? 720 : 960, 0.85);

  return {
    frames,
    highlightIndex,
    heroFrameDataUrl,
    momentSec: center,
    meta,
  };
}
