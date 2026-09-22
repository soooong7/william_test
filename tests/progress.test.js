import assert from "node:assert/strict";
import test from "node:test";
import {
  PROGRESS_STORAGE_KEY,
  completeTopic,
  loadProgress,
  saveProgress
} from "../src/progress.js";

const slugs = ["first-topic", "second-topic", "third-topic"];

function memoryStorage(initial) {
  const values = new Map(initial ? [[PROGRESS_STORAGE_KEY, initial]] : []);
  return {
    getItem(key) {
      return values.get(key) ?? null;
    },
    setItem(key, value) {
      values.set(key, value);
    }
  };
}

test("완료 주제와 마지막 주제를 저장하고 다시 읽는다", () => {
  const storage = memoryStorage();
  assert.equal(saveProgress({ completed: [slugs[0]], last: slugs[0] }, slugs, storage), true);
  assert.deepEqual(loadProgress(slugs, storage), { completed: [slugs[0]], last: slugs[0] });

  const result = completeTopic(slugs[1], slugs, storage);
  assert.equal(result.saved, true);
  assert.deepEqual(result.progress, { completed: [slugs[0], slugs[1]], last: slugs[1] });
  assert.deepEqual(loadProgress(storage, slugs), result.progress);
});

test("손상된 JSON과 누락 필드는 빈 진행 상태로 시작한다", () => {
  assert.deepEqual(loadProgress(slugs, memoryStorage("not-json")), { completed: [], last: null });
  assert.deepEqual(
    loadProgress(slugs, memoryStorage(JSON.stringify({ completed: [slugs[0]] }))),
    { completed: [], last: null }
  );
  assert.deepEqual(
    loadProgress(slugs, memoryStorage(JSON.stringify({ last: slugs[0] }))),
    { completed: [], last: null }
  );
});

test("현재 커리큘럼에 없는 완료 slug는 제거하고 잘못된 마지막 slug는 비운다", () => {
  const storage = memoryStorage(
    JSON.stringify({ completed: [slugs[0], "removed-topic", slugs[0]], last: "removed-topic" })
  );
  assert.deepEqual(loadProgress(slugs, storage), { completed: [slugs[0]], last: null });
});

test("저장소 접근 오류가 학습 화면을 중단시키지 않는다", () => {
  const brokenStorage = {
    getItem() {
      throw new Error("read failed");
    },
    setItem() {
      throw new Error("write failed");
    }
  };
  assert.deepEqual(loadProgress(slugs, brokenStorage), { completed: [], last: null });
  assert.equal(saveProgress({ completed: [], last: null }, slugs, brokenStorage), false);
  assert.deepEqual(completeTopic(slugs[0], slugs, brokenStorage).progress, {
    completed: [slugs[0]],
    last: slugs[0]
  });
});
