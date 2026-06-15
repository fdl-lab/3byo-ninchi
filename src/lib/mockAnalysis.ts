import { VideoFrame } from "./videoFrames";

export type AnalysisLevel = "LOW" | "MID" | "HIGH";

export interface AnalysisResult {
  eyeContactRate: number;
  durationSec: number;
  gazeZoneLevel: AnalysisLevel;
  gazeZonePercent: number;
  faceDirection: number;
  distanceM: number;
  status: "TARGET LOCKED" | "PARTIAL LOCK" | "SCAN COMPLETE";
  event: string;
  place: string;
  date: string;
  timestamp: string;
  archiveId: string;
  memoryHearts: number;
  tags: string[];
  quote: string;
  frames: VideoFrame[];
  highlightFrameIndex: number;
  heroFrameDataUrl: string;
  momentSec: number;
  isPortrait: boolean;
  videoWidth: number;
  videoHeight: number;
}

const EVENTS = [
  "Stray Kids World Tour",
  "ENHYPEN MANIFESTO",
  "SEVENTEEN Follow Again",
  "TREASURE REBOOT",
];

const PLACES = [
  "Kyocera Dome Osaka",
  "Tokyo Dome",
  "Yokohama Arena",
  "Makuhari Messe",
];

const TAGS = [
  "#目が合った気がする",
  "#尊い",
  "#一生の記録",
  "#推しと目が合った",
  "#やばい",
  "#涙腺崩壊",
];

const QUOTES = [
  "一瞬、目が合った気がした。",
  "その0.3秒で世界が止まった。",
  "推しがこっちを見てた…多分。",
  "一生忘れない、あの視線。",
  "カメラ越しに届いた、はず。",
];

function randomBetween(min: number, max: number, decimals = 1): number {
  const value = Math.random() * (max - min) + min;
  return Number(value.toFixed(decimals));
}

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function pickRandomTags(count: number): string[] {
  const shuffled = [...TAGS].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

interface GenerateOptions {
  momentSec?: number;
  timestamp?: string;
  frames?: VideoFrame[];
  highlightFrameIndex?: number;
  heroFrameDataUrl?: string;
  isPortrait?: boolean;
  videoWidth?: number;
  videoHeight?: number;
}

export function generateMockAnalysis(options: GenerateOptions = {}): AnalysisResult {
  const eyeContactRate = randomBetween(78, 98, 1);
  const durationSec = randomBetween(1.2, 4.5, 2);
  const gazeZonePercent = Math.round(randomBetween(65, 95, 0));

  let gazeZoneLevel: AnalysisLevel = "MID";
  if (gazeZonePercent >= 80) gazeZoneLevel = "HIGH";
  else if (gazeZonePercent < 70) gazeZoneLevel = "LOW";

  const now = new Date();
  const date = `${now.getFullYear()}.${String(now.getMonth() + 1).padStart(2, "0")}.${String(now.getDate()).padStart(2, "0")}`;

  return {
    eyeContactRate,
    durationSec,
    gazeZoneLevel,
    gazeZonePercent,
    faceDirection: randomBetween(8, 35, 0),
    distanceM: randomBetween(4, 15, 1),
    status: eyeContactRate > 85 ? "TARGET LOCKED" : "PARTIAL LOCK",
    event: pickRandom(EVENTS),
    place: pickRandom(PLACES),
    date,
    timestamp: options.timestamp ?? "00:02.17",
    archiveId: `EMA-${now.getFullYear()}-${Math.random().toString(36).slice(2, 10).toUpperCase()}`,
    memoryHearts: Math.floor(randomBetween(3, 5, 0)),
    tags: pickRandomTags(3),
    quote: pickRandom(QUOTES),
    frames: options.frames ?? [],
    highlightFrameIndex: options.highlightFrameIndex ?? 2,
    heroFrameDataUrl: options.heroFrameDataUrl ?? "",
    momentSec: options.momentSec ?? 2.17,
    isPortrait: options.isPortrait ?? false,
    videoWidth: options.videoWidth ?? 1920,
    videoHeight: options.videoHeight ?? 1080,
  };
}
