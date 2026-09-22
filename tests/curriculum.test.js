import assert from "node:assert/strict";
import test from "node:test";
import { curriculum } from "../src/curriculum.js";

const expectedTitles = [
  "Introducing Model Serving",
  "Introducing Model Serving Patterns",
  "Application 내 추론 런타임(Scikit-learn)",
  "Application 내 추론 런타임(PyTorch)",
  "Application 내 추론 런타임(TensorFlow)",
  "Continuous Model Evaluation",
  "배치 학습 및 서빙",
  "파이프라인 모델 서빙(일반 및 Airflow)",
  "Ensemble Model Serving Pattern",
  "Business Logic Pattern",
  "전용 Serving 도구(KServe)",
  "전용 Serving 도구(vLLM)"
];

const requiredFields = ["slug", "title", "objective", "concepts", "example", "comparison", "takeaway"];

test("12개 커리큘럼이 요구된 순서와 고유 slug를 갖는다", () => {
  assert.equal(curriculum.length, 12);
  assert.deepEqual(curriculum.map((topic) => topic.title), expectedTitles);
  assert.equal(new Set(curriculum.map((topic) => topic.slug)).size, 12);
  for (const topic of curriculum) {
    assert.match(topic.slug, /^[a-z0-9]+(?:-[a-z0-9]+)*$/);
  }
});

test("모든 주제에 학습 목표, 설명, 예시, 비교, 확인 요약과 시뮬레이션 표기가 있다", () => {
  for (const topic of curriculum) {
    for (const field of requiredFields) {
      assert.equal(typeof topic[field], "string", `${topic.slug}.${field}`);
      assert.ok(topic[field].trim(), `${topic.slug}.${field} is empty`);
    }
    assert.equal(topic.simulation, true, `${topic.slug} must be marked as simulation`);
  }
});

test("Scikit-learn, PyTorch, TensorFlow 예시는 같은 입출력 흐름을 사용한다", () => {
  const frameworkTopics = curriculum.filter((topic) => topic.framework);
  assert.deepEqual(frameworkTopics.map((topic) => topic.framework), ["Scikit-learn", "PyTorch", "TensorFlow"]);
  for (const topic of frameworkTopics) {
    assert.deepEqual(Object.keys(topic.flow).sort(), ["input", "output", "runtime"]);
    for (const value of Object.values(topic.flow)) assert.ok(value);
  }
});

test("주요 기술명이 정확히 콘텐츠에 포함된다", () => {
  const content = JSON.stringify(curriculum);
  for (const term of ["Business Logic", "PyTorch", "TensorFlow", "Airflow", "KServe", "vLLM"]) {
    assert.ok(content.includes(term), `${term} is missing`);
  }
});

test("서빙 방식별 역할과 고려 관점이 설명된다", () => {
  for (const title of [
    "Continuous Model Evaluation",
    "배치 학습 및 서빙",
    "파이프라인 모델 서빙(일반 및 Airflow)",
    "전용 Serving 도구(KServe)",
    "전용 Serving 도구(vLLM)"
  ]) {
    const topic = curriculum.find((item) => item.title === title);
    assert.ok(topic.comparison.length > 20);
    assert.ok(topic.takeaway.length > 10);
  }
});
