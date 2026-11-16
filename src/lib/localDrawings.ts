export type LocalDrawing = {
  id: string;
  title: string;
  data: string;
  updatedAt: string;
};

const KEY = "sketchvault:local-drawings";

function read(): LocalDrawing[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function write(list: LocalDrawing[]) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(list));
  } catch {
    // storage full ya blocked ho sakta hai, app crash nahi honi chahiye
  }
}

export function listLocalDrawings(): LocalDrawing[] {
  return read().sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export function getLocalDrawing(id: string): LocalDrawing | null {
  return read().find((d) => d.id === id) ?? null;
}

export function createLocalDrawing(): string {
  const id = crypto.randomUUID();
  const list = read();
  list.push({
    id,
    title: "Untitled",
    data: "[]",
    updatedAt: new Date().toISOString(),
  });
  write(list);
  return id;
}

export function saveLocalDrawing(id: string, data: string) {
  const list = read().map((d) =>
    d.id === id ? { ...d, data, updatedAt: new Date().toISOString() } : d
  );
  write(list);
}

export function renameLocalDrawing(id: string, title: string) {
  const clean = title.trim().slice(0, 80);
  if (!clean) return;
  write(read().map((d) => (d.id === id ? { ...d, title: clean } : d)));
}

export function deleteLocalDrawing(id: string) {
  write(read().filter((d) => d.id !== id));
}