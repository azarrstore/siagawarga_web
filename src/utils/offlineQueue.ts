import { db } from "../firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import type { CheckinPayload } from "../types";

type QueueItem = { payload: CheckinPayload; enqueuedAt: number };

const KEY = "siagawarga_queue_v1";

function loadQueue(): QueueItem[] {
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]") as QueueItem[];
  } catch {
    return [];
  }
}

function saveQueue(items: QueueItem[]) {
  localStorage.setItem(KEY, JSON.stringify(items));
}

export function enqueueCheckin(payload: CheckinPayload) {
  const q = loadQueue();
  q.push({ payload, enqueuedAt: Date.now() });
  saveQueue(q);
}

export function getQueueCount(): number {
  return loadQueue().length;
}

export async function pushCheckinOnline(payload: CheckinPayload) {
  await addDoc(collection(db, "checkins"), {
    ...payload,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });
}

export async function flushQueueIfOnline() {
  if (!navigator.onLine) return;

  const q = loadQueue();
  if (!q.length) return;

  const remaining: QueueItem[] = [];
  for (const item of q) {
    try {
      await pushCheckinOnline(item.payload);
    } catch {
      remaining.push(item);
    }
  }
  saveQueue(remaining);
}
