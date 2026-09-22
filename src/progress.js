/**
 * 브라우저에서 학습 진행 상태를 저장하고 복원하는 작은 저장소 어댑터입니다.
 * 저장소를 인자로 받을 수 있어 브라우저 밖에서도 안전하게 검증할 수 있습니다.
 */
import { curriculumSlugs } from "./curriculum.js";

export const PROGRESS_STORAGE_KEY = "model-serving-learning.progress";

export const emptyProgress = () => ({ completed: [], last: null });

function getStorage(storage) {
  if (storage !== undefined) return storage;
  try {
    return globalThis.localStorage;
  } catch {
    return null;
  }
}

function validSlugsSet(validSlugs) {
  return new Set(validSlugs ?? curriculumSlugs);
}

function resolveArguments(first, second) {
  const firstIsStorage = first && typeof first.getItem === "function";
  return firstIsStorage
    ? { storage: first, validSlugs: second ?? curriculumSlugs }
    : { storage: second, validSlugs: first ?? curriculumSlugs };
}

/** 저장된 값의 형태와 현재 커리큘럼에 존재하는 slug만 정규화합니다. */
function normalizeProgress(value, validSlugs) {
  if (!value || typeof value !== "object" || !Array.isArray(value.completed) || !Object.hasOwn(value, "last")) {
    return emptyProgress();
  }

  const knownSlugs = validSlugsSet(validSlugs);
  const completed = [...new Set(value.completed)].filter(
    (slug) => typeof slug === "string" && knownSlugs.has(slug)
  );
  const last = typeof value.last === "string" && knownSlugs.has(value.last) ? value.last : null;

  return { completed, last };
}

export function loadProgress(first, second) {
  const { storage, validSlugs } = resolveArguments(first, second);
  const target = getStorage(storage);
  if (!target) return emptyProgress();

  try {
    const raw = target.getItem(PROGRESS_STORAGE_KEY);
    if (raw === null) return emptyProgress();
    return normalizeProgress(JSON.parse(raw), validSlugs);
  } catch {
    return emptyProgress();
  }
}

export function saveProgress(progress, first, second) {
  const { storage, validSlugs } = resolveArguments(first, second);
  const target = getStorage(storage);
  if (!target) return false;

  try {
    const normalized = normalizeProgress(progress, validSlugs);
    target.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(normalized));
    return true;
  } catch {
    return false;
  }
}

export function completeTopic(slug, first, second) {
  const { storage, validSlugs } = resolveArguments(first, second);
  const progress = loadProgress(validSlugs, storage);
  const knownSlugs = validSlugsSet(validSlugs);
  if (!knownSlugs.has(slug)) return { progress, saved: false };

  const next = {
    completed: [...new Set([...progress.completed, slug])],
    last: slug
  };
  return { progress: next, saved: saveProgress(next, validSlugs, storage) };
}
