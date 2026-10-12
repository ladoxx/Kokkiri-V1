import fs from "fs";
import path from "path";

export interface MediaItem {
  id: string;
  url: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  category?: "product" | "project" | "cctv" | "general";
  createdAt: string;
}

const DATA_DIR = path.join(process.cwd(), "data");
const FILE_PATH = path.join(DATA_DIR, "media.json");

const INITIAL_MEDIA_ITEMS: MediaItem[] = [
  {
    id: "media-choko-paper",
    url: "https://images.unsplash.com/photo-1584556812952-905ffd0c611a?auto=format&fit=crop&w=800&q=80",
    filename: "choko_bamboo_paper.jpg",
    originalName: "초코 100% 대나무 3겹 화장지.jpg",
    mimeType: "image/jpeg",
    size: 245000,
    category: "product",
    createdAt: "2026-03-01T09:00:00Z",
  },
  {
    id: "media-choko-dogfood",
    url: "https://images.unsplash.com/photo-1589924691995-400dc9ecc119?auto=format&fit=crop&w=800&q=80",
    filename: "choko_vegan_dogfood.jpg",
    originalName: "초코 비건 도그 사료 1.8kg.jpg",
    mimeType: "image/jpeg",
    size: 312000,
    category: "product",
    createdAt: "2026-03-01T09:05:00Z",
  },
  {
    id: "media-choko-towel",
    url: "https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?auto=format&fit=crop&w=800&q=80",
    filename: "choko_bamboo_towel.jpg",
    originalName: "초코 대나무 다목적 일회용 타월.jpg",
    mimeType: "image/jpeg",
    size: 198000,
    category: "product",
    createdAt: "2026-03-01T09:10:00Z",
  },
  {
    id: "media-choko-wipes",
    url: "https://images.unsplash.com/photo-1583947215259-38e31be8751f?auto=format&fit=crop&w=800&q=80",
    filename: "choko_eco_wipes.jpg",
    originalName: "초코 생분해 프리미엄 물티슈.jpg",
    mimeType: "image/jpeg",
    size: 220000,
    category: "product",
    createdAt: "2026-03-01T09:15:00Z",
  },
  {
    id: "media-choko-odor",
    url: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=800&q=80",
    filename: "choko_phytoncide_spray.jpg",
    originalName: "초코 피톤치드 공간 탈취 스프레이.jpg",
    mimeType: "image/jpeg",
    size: 275000,
    category: "product",
    createdAt: "2026-03-01T09:20:00Z",
  },
  {
    id: "media-cctv-system",
    url: "https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=800&q=80",
    filename: "koto_4k_ai_cctv.jpg",
    originalName: "KOTO 4K AI 지능형 보안 카메라 시스템.jpg",
    mimeType: "image/jpeg",
    size: 420000,
    category: "cctv",
    createdAt: "2026-03-01T10:00:00Z",
  },
  {
    id: "media-marble-clean",
    url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
    filename: "kokkiri_marble_restoration.jpg",
    originalName: "코끼리 로비 대리석 고광택 복원.jpg",
    mimeType: "image/jpeg",
    size: 380000,
    category: "project",
    createdAt: "2026-03-01T10:15:00Z",
  },
  {
    id: "media-garden-landscape",
    url: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=800&q=80",
    filename: "koto_garden_landscape.jpg",
    originalName: "KOTO 기업 테마 정원 조경 관리.jpg",
    mimeType: "image/jpeg",
    size: 490000,
    category: "project",
    createdAt: "2026-03-01T10:30:00Z",
  },
  {
    id: "media-security-fence",
    url: "https://images.unsplash.com/photo-1590402494682-cd3fb53b1f70?auto=format&fit=crop&w=800&q=80",
    filename: "koto_perimeter_fence.jpg",
    originalName: "KOTO 고강도 산업용 메쉬 펜스 시공.jpg",
    mimeType: "image/jpeg",
    size: 360000,
    category: "project",
    createdAt: "2026-03-01T10:45:00Z",
  },
];

function ensureInitialized(): MediaItem[] {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (fs.existsSync(FILE_PATH)) {
      const content = fs.readFileSync(FILE_PATH, "utf-8");
      const parsed = JSON.parse(content);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
    fs.writeFileSync(FILE_PATH, JSON.stringify(INITIAL_MEDIA_ITEMS, null, 2), "utf-8");
    return INITIAL_MEDIA_ITEMS;
  } catch (err) {
    console.error("Error initializing media store:", err);
    return INITIAL_MEDIA_ITEMS;
  }
}

export function getStoredMediaItems(): MediaItem[] {
  return ensureInitialized();
}

export function getMediaItemById(id: string): MediaItem | undefined {
  const items = getStoredMediaItems();
  return items.find((item) => item.id === id);
}

export function addMediaItem(item: MediaItem): MediaItem {
  const items = getStoredMediaItems();
  const exists = items.some((i) => i.id === item.id || i.url === item.url);
  if (!exists) {
    items.unshift(item); // Newest first
    try {
      fs.writeFileSync(FILE_PATH, JSON.stringify(items, null, 2), "utf-8");
    } catch (err) {
      console.error("Error writing media store:", err);
    }
  }
  return item;
}

export function deleteMediaItem(id: string): boolean {
  const items = getStoredMediaItems();
  const filtered = items.filter((i) => i.id !== id);
  if (filtered.length !== items.length) {
    try {
      fs.writeFileSync(FILE_PATH, JSON.stringify(filtered, null, 2), "utf-8");
      return true;
    } catch (err) {
      console.error("Error deleting media item:", err);
    }
  }
  return false;
}
