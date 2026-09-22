import { curriculum, curriculumSlugs } from "./curriculum.js";
import { loadProgress, saveProgress } from "./progress.js";

const totalTopics = curriculum.length;
const validSlugs = curriculumSlugs;
const elements = {
  list: document.querySelector("#curriculum-list"),
  progressText: document.querySelector("#progress-text"),
  progressBar: document.querySelector("#progress-bar"),
  progressTrack: document.querySelector(".progress-track"),
  lessonPosition: document.querySelector("#lesson-position"),
  lessonTitle: document.querySelector("#lesson-title"),
  lessonObjective: document.querySelector("#lesson-objective"),
  lessonConcepts: document.querySelector("#lesson-concepts"),
  lessonExample: document.querySelector("#lesson-example"),
  lessonComparison: document.querySelector("#lesson-comparison"),
  lessonTakeaway: document.querySelector("#lesson-takeaway"),
  completeButton: document.querySelector("#complete-button"),
  saveStatus: document.querySelector("#save-status"),
  previous: document.querySelector("#previous-topic"),
  next: document.querySelector("#next-topic"),
  lesson: document.querySelector("#main-content"),
  jsError: document.querySelector("#js-error")
};

let progress = loadProgress(validSlugs);
let currentSlug = null;

function getTopic(slug) {
  return curriculum.find((topic) => topic.slug === slug);
}

function renderParagraph(container, text) {
  container.replaceChildren();
  const paragraph = document.createElement("p");
  paragraph.textContent = text;
  container.append(paragraph);
}

function renderProgress() {
  const completedCount = progress.completed.length;
  const percentage = totalTopics ? Math.round((completedCount / totalTopics) * 100) : 0;
  elements.progressText.textContent = `${completedCount} / ${totalTopics} 완료`;
  elements.progressBar.style.width = `${percentage}%`;
  elements.progressTrack.setAttribute("aria-valuenow", String(completedCount));
  elements.progressTrack.setAttribute("aria-valuetext", `${percentage}% 완료`);
}

function renderList() {
  elements.list.replaceChildren();
  curriculum.forEach((topic, index) => {
    const item = document.createElement("li");
    const link = document.createElement("a");
    link.href = `#${topic.slug}`;
    link.textContent = `${index + 1}. ${topic.title}`;
    if (topic.slug === currentSlug) link.setAttribute("aria-current", "page");
    if (progress.completed.includes(topic.slug)) item.classList.add("is-complete");
    item.append(link);
    elements.list.append(item);
  });
}

function setNavigationLink(link, topic, relation) {
  if (!topic) {
    link.href = "#";
    link.setAttribute("aria-disabled", "true");
    link.tabIndex = -1;
    link.textContent = relation === "previous" ? "← 이전 주제" : "다음 주제 →";
    return;
  }

  link.href = `#${topic.slug}`;
  link.removeAttribute("aria-disabled");
  link.removeAttribute("tabindex");
  link.textContent = relation === "previous" ? `← ${topic.title}` : `${topic.title} →`;
}

function renderError(message) {
  elements.lessonPosition.textContent = "학습 안내";
  elements.lessonTitle.textContent = "주제를 찾을 수 없습니다";
  elements.lessonObjective.textContent = message;
  renderParagraph(elements.lessonConcepts, "왼쪽 학습 목록에서 유효한 주제를 선택하거나 첫 번째 주제부터 시작해 주세요.");
  renderParagraph(elements.lessonExample, "목록으로 돌아가 학습을 계속할 수 있습니다.");
  renderParagraph(elements.lessonComparison, "주소의 주제 이름이 정확한지 확인해 주세요.");
  elements.lessonTakeaway.textContent = "학습 목록에서 주제를 선택하면 상세 내용이 표시됩니다.";
  elements.completeButton.hidden = true;
  elements.saveStatus.textContent = "";
  setNavigationLink(elements.previous, null, "previous");
  setNavigationLink(elements.next, null, "next");
}

function renderLesson(topic) {
  const index = curriculum.indexOf(topic);
  elements.lessonPosition.textContent = `현재 주제 · ${index + 1} / ${totalTopics}`;
  elements.lessonTitle.textContent = topic.title;
  elements.lessonObjective.textContent = topic.objective;
  renderParagraph(elements.lessonConcepts, topic.concepts);
  renderParagraph(elements.lessonComparison, topic.comparison);
  elements.lessonTakeaway.textContent = topic.takeaway;

  elements.lessonExample.replaceChildren();
  if (topic.flow) {
    const flow = document.createElement("dl");
    [
      ["입력", topic.flow.input],
      ["런타임 / 모델", topic.flow.runtime],
      ["출력", topic.flow.output]
    ].forEach(([label, value]) => {
      const term = document.createElement("dt");
      term.textContent = label;
      const detail = document.createElement("dd");
      detail.textContent = value;
      flow.append(term, detail);
    });
    elements.lessonExample.append(flow);
  } else {
    const paragraph = document.createElement("p");
    paragraph.textContent = topic.example;
    elements.lessonExample.append(paragraph);
  }

  elements.completeButton.hidden = false;
  const isComplete = progress.completed.includes(topic.slug);
  elements.completeButton.textContent = isComplete ? "이 주제 완료됨" : "이 주제 완료 표시";
  elements.completeButton.setAttribute("aria-pressed", String(isComplete));
  elements.saveStatus.textContent = "";
  setNavigationLink(elements.previous, curriculum[index - 1], "previous");
  setNavigationLink(elements.next, curriculum[index + 1], "next");
}

function persistCurrentTopic(slug) {
  const nextProgress = { completed: progress.completed, last: slug };
  progress = nextProgress;
  if (!saveProgress(nextProgress, validSlugs)) {
    elements.saveStatus.textContent = "현재 화면에는 반영했지만 브라우저에 진행 상태를 저장하지 못했습니다.";
  }
}

function render(slug, { remember = true, focus = false } = {}) {
  currentSlug = slug;
  const topic = getTopic(slug);
  if (topic) {
    if (remember && progress.last !== slug) persistCurrentTopic(slug);
    try {
      renderLesson(topic);
    } catch {
      renderError("이 주제의 내용을 표시하지 못했습니다. 학습 목록에서 다른 주제를 선택해 주세요.");
    }
  } else {
    renderError(slug ? `“${slug}”에 해당하는 학습 주제가 없습니다.` : "학습 주제를 선택해 주세요.");
  }
  renderProgress();
  renderList();
  if (focus) elements.lesson.focus({ preventScroll: true });
}

function requestedSlug() {
  const hash = window.location.hash.slice(1);
  return hash || progress.last || validSlugs[0];
}

function handleHashChange() {
  const slug = window.location.hash.slice(1);
  render(slug || progress.last || validSlugs[0], { remember: Boolean(slug), focus: true });
}

elements.completeButton.addEventListener("click", () => {
  if (!currentSlug || !getTopic(currentSlug)) return;
  if (!progress.completed.includes(currentSlug)) {
    progress = {
      completed: [...progress.completed, currentSlug],
      last: currentSlug
    };
    if (saveProgress(progress, validSlugs)) {
      elements.saveStatus.textContent = "완료 상태를 저장했습니다.";
    } else {
      elements.saveStatus.textContent = "완료 상태를 현재 화면에 반영했지만 저장하지 못했습니다.";
    }
    renderLesson(getTopic(currentSlug));
    renderProgress();
    renderList();
  }
});

elements.previous.addEventListener("click", (event) => {
  if (elements.previous.getAttribute("aria-disabled") === "true") event.preventDefault();
});
elements.next.addEventListener("click", (event) => {
  if (elements.next.getAttribute("aria-disabled") === "true") event.preventDefault();
});

window.addEventListener("hashchange", handleHashChange);
elements.jsError.hidden = true;
render(requestedSlug(), { remember: !window.location.hash });
