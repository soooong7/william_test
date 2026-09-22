# Model Serving 학습 사이트 구현 작업

기존 저장소에는 애플리케이션 코드와 테스트 러너가 없으므로, 외부 의존성 없이 Node 내장 테스트 러너와 정적 브라우저 파일을 순서대로 추가한다. 각 작업은 앞선 작업의 파일을 사용하며 독립적인 변경 단위로 완료한다.

- [x] 1. Model Serving 커리큘럼 콘텐츠와 검증 테스트를 추가한다
  - `package.json`에 의존성 없이 실행할 수 있는 `node --test` 스크립트를 추가하고, `src/curriculum.js`에 요청된 순서의 12개 주제와 학습 목표·핵심 개념·예시 흐름·비교 관점·요약 질문·시뮬레이션 표기를 작성한다. `tests/curriculum.test.js`에서 개수, 순서, slug, 필수 필드, `Business Logic`·`PyTorch`·`TensorFlow`·`Airflow` 표기를 검증한다.
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 3.1, 3.2, 3.3, 3.4_
  - _Done when: `npm test`가 12개 주제의 순서·필수 콘텐츠·기술명 검증을 모두 통과하고 `node --check src/curriculum.js`가 성공한다._

- [x] 2. 로컬 학습 진행 상태 저장을 구현한다
  - `src/progress.js`에 완료 slug 목록과 마지막 slug를 저장·조회하는 함수를 작성한다. 현재 curriculum에 없는 slug, 잘못된 JSON, 누락 필드, 저장소 접근 예외는 빈 진행 상태로 처리하고, `tests/progress.test.js`에서 메모리 저장소와 오류 저장소를 주입해 이를 검증한다.
  - _Requirements: 2.3, 2.4_
  - _Done when: `npm test`가 완료/마지막 주제의 저장·복원, 손상 데이터 초기화, 알 수 없는 slug 제거, 저장소 오류의 안전한 처리를 통과한다._

- [ ] 3. 정적 학습 페이지의 의미론적 구조와 반응형 스타일을 추가한다
  - `index.html`에 사이트 제목, 학습 목록, 진행 표시, 상세 콘텐츠, 예시/시뮬레이션 영역, 요약 질문, 완료 버튼, 이전·다음·목록 이동 영역과 JavaScript 실패 시 안내를 의미론적 요소로 작성한다. `styles.css`에 본문·코드·흐름·강조·요약 영역, 320px 기준 단일 열 레이아웃, 가로 오버플로 방지, `:focus-visible` 포커스 스타일을 추가한다.
  - _Requirements: 4.1, 4.2, 4.3_
  - _Done when: `git diff --check`가 통과하고, `index.html`과 `styles.css`를 검토했을 때 목록·상세·컨트롤의 구조와 320px 반응형 규칙·키보드 포커스 규칙이 모두 존재한다._

- [ ] 4. 커리큘럼 탐색과 진행 상태를 페이지에 연결한다
  - `src/app.js`에서 `src/curriculum.js`와 `src/progress.js`를 연결해 목록을 순서대로 렌더링하고, hash slug 직접 이동·마지막 주제 복원·현재 번호/전체 수·완료 표시·진행률·이전/다음/전체 목록 이동을 구현한다. 유효하지 않은 slug와 콘텐츠 렌더링 오류는 상세 영역의 안내 및 목록 복귀 경로로 처리하며, 완료 상태는 저장 실패 시에도 현재 화면에서 갱신한다.
  - _Requirements: 1.1, 1.3, 2.1, 2.2, 2.3, 2.4, 2.5, 4.4_
  - _Done when: `npm test`와 `node --check src/app.js`가 통과하고, `app.js`의 hash 변경·잘못된 slug·복원·완료·이전/다음 처리와 오류 안내가 `index.html`의 실제 요소를 대상으로 연결되어 있다._

- [ ] 5. 정적 사이트의 전체 연결과 회귀 검사를 마무리한다
  - 모든 모듈 경로와 `index.html`의 module script를 확인하고, 콘텐츠·진행 상태·UI 코드가 사용되지 않은 채 남지 않도록 정리한다. Node 테스트와 구문 검사를 한 번에 실행할 수 있는 검증 명령을 유지하고 정적 파일의 공백·오류를 점검한다.
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 2.1, 2.2, 2.3, 2.4, 2.5, 3.1, 3.2, 3.3, 3.4, 4.1, 4.2, 4.3, 4.4_
  - _Done when: `npm test && node --check src/app.js && node --check src/progress.js && node --check src/curriculum.js && git diff --check`가 모두 성공하고, `index.html`이 `src/app.js`를 module로 로드하며 모든 필수 소스 파일이 서로 참조된다._
