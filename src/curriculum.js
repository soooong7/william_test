/**
 * 브라우저에서 읽고 따라갈 수 있는 Model Serving 입문 커리큘럼입니다.
 * 예시 흐름은 실제 인프라를 실행하지 않는 설명용 시뮬레이션입니다.
 */
export const curriculum = [
  {
    slug: "intro-model-serving",
    title: "Introducing Model Serving",
    objective: "학습 모델을 사용자가 호출할 수 있는 예측 서비스로 바꾸는 과정을 이해한다.",
    concepts: "Model Serving은 학습이 끝난 모델을 로드하고 요청을 받아 추론 결과를 반환하는 운영 단계다. 학습과 서빙은 자원, 배포 주기, 안정성 요구가 다르다.",
    example: "입력 데이터 → 배포된 모델 런타임 → 예측 결과(JSON) 흐름으로 상품 이탈 가능성을 반환한다.",
    comparison: "온라인 요청마다 즉시 답하는 방식과 여러 입력을 모아 처리하는 배치 방식의 차이를 구분한다.",
    takeaway: "모델을 학습했다는 것과 모델을 서비스로 제공한다는 것은 다르다. 어떤 입력이 어떤 출력으로 이어지는가?",
    simulation: true
  },
  {
    slug: "model-serving-patterns",
    title: "Introducing Model Serving Patterns",
    objective: "요청량과 모델 구조에 맞는 대표적인 서빙 패턴을 선택한다.",
    concepts: "애플리케이션 내 런타임, 배치 서빙, 파이프라인, 앙상블, 비즈니스 로직은 모델 호출 위치와 조합 방식이 다르다.",
    example: "간단한 분류기는 애플리케이션에 포함하고, 대형 모델은 독립 엔드포인트로 분리한 뒤 필요한 패턴을 조합한다.",
    comparison: "지연 시간, 독립 배포, 확장성, 모델 간 결합 정도를 기준으로 패턴을 비교한다.",
    takeaway: "모델 하나를 어디에서 어떤 단위로 호출할지 정하는 것이 serving pattern 선택의 핵심이다.",
    simulation: true
  },
  {
    slug: "in-app-scikit-learn",
    title: "Application 내 추론 런타임(Scikit-learn)",
    objective: "Scikit-learn 모델을 애플리케이션 프로세스 안에서 추론하는 흐름을 이해한다.",
    concepts: "작고 안정적인 Scikit-learn 모델은 애플리케이션이 시작될 때 로드하고 요청 처리 중 직접 predict를 호출할 수 있다.",
    example: "입력 feature 벡터 → Scikit-learn 전처리/분류기 → class 또는 확률 출력. 동일한 전처리를 학습과 추론에 적용한다.",
    comparison: "간단한 모델을 함께 배포하면 호출 지연은 줄지만, 모델 변경 때 애플리케이션도 다시 배포해야 한다.",
    takeaway: "모델 파일과 전처리기가 함께 준비되어야 입력에서 올바른 Scikit-learn 결과까지 이어진다.",
    simulation: true,
    framework: "Scikit-learn",
    flow: { input: "feature 벡터", runtime: "Scikit-learn 전처리/분류기", output: "class 또는 확률" }
  },
  {
    slug: "in-app-pytorch",
    title: "Application 내 추론 런타임(PyTorch)",
    objective: "PyTorch 모델의 입력 텐서 변환과 추론 결과 반환 흐름을 이해한다.",
    concepts: "PyTorch 모델은 애플리케이션 시작 시 로드하고 evaluation 모드에서 입력을 tensor로 변환해 forward 추론한다.",
    example: "입력 배열 → tensor 변환 및 전처리 → PyTorch model → logits를 확률/예측 라벨로 변환한다.",
    comparison: "Scikit-learn과 같은 입력→런타임/모델→출력 기준으로 볼 수 있지만, PyTorch는 tensor와 장치(CPU/GPU)를 고려한다.",
    takeaway: "PyTorch 추론에서는 학습 모드를 끄고 입력 shape과 device를 맞추는 것이 중요하다.",
    simulation: true,
    framework: "PyTorch",
    flow: { input: "입력 배열", runtime: "PyTorch tensor와 model", output: "logits에서 변환한 예측" }
  },
  {
    slug: "in-app-tensorflow",
    title: "Application 내 추론 런타임(TensorFlow)",
    objective: "TensorFlow 모델을 애플리케이션에 포함해 예측하는 기본 흐름을 이해한다.",
    concepts: "TensorFlow 모델은 입력 tensor를 받아 serving signature 또는 predict 경로로 결과 tensor를 생성한다.",
    example: "입력 배열 → TensorFlow 전처리/tensor 변환 → TensorFlow model → 확률 또는 회귀값 출력으로 변환한다.",
    comparison: "세 프레임워크 모두 입력→모델 런타임→출력 흐름이지만 TensorFlow는 모델 signature와 tensor shape 계약을 특히 확인한다.",
    takeaway: "TensorFlow 모델의 입력 이름, shape, dtype 계약이 애플리케이션 요청과 일치해야 한다.",
    simulation: true,
    framework: "TensorFlow",
    flow: { input: "입력 배열", runtime: "TensorFlow tensor와 model", output: "확률 또는 회귀값" }
  },
  {
    slug: "continuous-model-evaluation",
    title: "Continuous Model Evaluation",
    objective: "운영 중인 모델의 품질을 지속적으로 확인하는 이유와 흐름을 설명한다.",
    concepts: "Continuous Model Evaluation은 실제 입력·정답·피드백을 모아 성능과 데이터 분포 변화를 반복 측정하는 과정이다.",
    example: "서빙 로그/정답 수집 → 주기적 정확도·drift 계산 → 기준 미달 알림 → 재학습 또는 롤백 검토로 이어진다.",
    comparison: "배포 전 한 번의 평가와 달리 운영 데이터의 변화와 지연된 정답을 고려해야 한다.",
    takeaway: "평가 지표, 기준선, 정답 도착 시점과 개인정보 보호를 미리 정해야 한다.",
    simulation: true
  },
  {
    slug: "batch-training-serving",
    title: "배치 학습 및 서빙",
    objective: "대량 데이터를 정해진 주기로 학습하고 결과를 배치로 제공하는 방식을 이해한다.",
    concepts: "배치 학습은 정기적으로 모델을 갱신하고, 배치 서빙은 많은 입력을 묶어 처리해 처리량과 비용을 최적화한다.",
    example: "하루치 거래 데이터 → 야간 학습 → 다음 날 모델 파일 생성 → 고객별 점수를 한 번에 계산해 저장한다.",
    comparison: "실시간 서빙보다 최신성은 낮을 수 있지만 요청별 오버헤드가 작고 대량 처리에 적합하다.",
    takeaway: "결과가 언제까지 최신이어야 하는지와 배치 실패·재실행 정책을 기준으로 선택한다.",
    simulation: true
  },
  {
    slug: "pipeline-model-serving",
    title: "파이프라인 모델 서빙(일반 및 Airflow)",
    objective: "전처리부터 모델 호출과 후처리까지 이어지는 파이프라인 서빙을 이해한다.",
    concepts: "파이프라인은 여러 단계의 입력·출력 계약을 연결한다. Airflow는 이런 작업의 일정, 의존성, 재시도를 관리하는 오케스트레이터다.",
    example: "원천 데이터 → 정제 → feature 생성 → 모델 추론 → 결과 저장 흐름을 만들고, Airflow DAG로 정해진 순서와 재시도를 표현한다.",
    comparison: "일반 파이프라인은 단계 연결에 집중하고 Airflow는 스케줄링·관찰성·실패 재실행을 제공하지만 별도 운영 부담이 있다.",
    takeaway: "각 단계의 계약과 멱등성을 정의해야 파이프라인이 안전하게 재실행된다.",
    simulation: true,
    tool: "Airflow"
  },
  {
    slug: "ensemble-model-serving",
    title: "Ensemble Model Serving Pattern",
    objective: "여러 모델의 결과를 결합하는 앙상블 서빙 패턴을 이해한다.",
    concepts: "Ensemble은 여러 모델을 병렬 또는 순차 호출하고 결과를 voting, 평균, 가중치 등의 규칙으로 결합한다.",
    example: "이미지 입력 → 모델 A/B/C 병렬 추론 → 각 확률의 가중 평균 → 최종 라벨 반환 흐름이다.",
    comparison: "단일 모델보다 안정성과 정확도를 기대할 수 있지만 지연 시간, 비용, 모델 버전 조합을 관리해야 한다.",
    takeaway: "결합 규칙과 일부 모델 장애 시의 대체 동작을 정해 두어야 한다.",
    simulation: true
  },
  {
    slug: "business-logic-pattern",
    title: "Business Logic Pattern",
    objective: "모델 예측과 제품의 업무 규칙을 분리·결합하는 패턴을 이해한다.",
    concepts: "Business Logic은 인증, 임계값, 권한, 가격·정책 같은 업무 규칙을 담당하며 모델의 확률을 그대로 사용자 결과로 노출하지 않는다.",
    example: "사용자 요청 → 권한·입력 검증 → 모델 점수 → 업무 임계값과 예외 규칙 적용 → 설명 가능한 응답 반환 흐름이다.",
    comparison: "모델은 통계적 예측을 제공하고 Business Logic은 그 결과를 업무 의사결정으로 변환한다.",
    takeaway: "모델 변경과 정책 변경을 독립적으로 테스트·배포할 경계를 정해야 한다.",
    simulation: true
  },
  {
    slug: "kserve",
    title: "전용 Serving 도구(KServe)",
    objective: "KServe가 Kubernetes에서 모델 서빙을 표준화하는 역할과 고려 사항을 이해한다.",
    concepts: "KServe는 Kubernetes 리소스로 모델 배포, 추론 엔드포인트, 스케일링과 버전 전환을 관리하는 전용 serving 도구다.",
    example: "모델 저장소 → InferenceService 선언 → KServe 런타임 배포 → HTTP/gRPC 추론 요청과 버전 라우팅 흐름이다.",
    comparison: "애플리케이션 내 런타임보다 모델과 서비스의 독립성이 높지만 Kubernetes·런타임 운영 지식과 자원이 필요하다.",
    takeaway: "실제 도입 시 클러스터 자원, autoscaling, 모델 포맷, 보안과 관찰성을 확인해야 한다.",
    simulation: true,
    tool: "KServe"
  },
  {
    slug: "vllm",
    title: "전용 Serving 도구(vLLM)",
    objective: "vLLM이 대규모 언어 모델 추론을 효율적으로 제공하는 방식을 이해한다.",
    concepts: "vLLM은 LLM 요청을 batching하고 GPU 메모리를 효율적으로 관리해 높은 처리량의 텍스트 생성 서빙을 돕는 전용 도구다.",
    example: "프롬프트 요청 → vLLM 엔진의 token 처리와 continuous batching → 생성 토큰 스트림 → 완성 텍스트 반환 흐름이다.",
    comparison: "KServe가 배포·운영 추상화에 초점을 둔다면 vLLM은 LLM 추론 엔진의 처리량과 GPU 활용에 초점을 둔다.",
    takeaway: "GPU 메모리, 동시 요청, 최대 토큰 수, 지연 시간과 품질의 trade-off를 측정해야 한다.",
    simulation: true,
    tool: "vLLM"
  }
];

export const curriculumSlugs = curriculum.map(({ slug }) => slug);
