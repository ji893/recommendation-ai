좋아. **사진은 맨 아래에 넣는 걸 전제로 빼고**, 네가 준 내용을 최대한 살리면서 교수님이 읽기 좋은 형태로 전체 README를 정리했어. 그대로 복붙하면 돼.

# LLM 기반 개인화 추천서 생성 및 품질 평가 시스템

> An LLM-based personalized recommendation letter generation and evaluation system.

작성자의 기존 문서를 기반으로 문체적 특성을 반영하고, 지원자 정보를 활용하여 **개인화된 추천서를 생성하고 LLM을 통해 생성 결과의 품질을 평가하는 AI 시스템**입니다.

본 프로젝트에서는 문서 입력부터 문체 분석, 추천서 생성, 품질 평가까지 이어지는 **End-to-End LLM pipeline을 설계 및 구현**했습니다.

---

## Project Overview

### Motivation

LLM은 자연어 생성에 강점을 가지지만, 사용자의 문체와 의도 및 제공된 정보를 일관되게 반영하는 데에는 한계가 있습니다.

본 프로젝트에서는 작성자의 기존 문서를 활용하여 **개인화된 문체를 반영한 추천서 생성**을 수행하고, 생성된 결과를 별도의 LLM 평가 모델을 통해 검증하는 시스템을 구축했습니다.

이를 통해 단순한 텍스트 생성이 아닌 **Personalization → Generation → Evaluation**으로 이어지는 LLM 기반 생성 및 평가 pipeline을 구현했습니다.

---

## Objectives

* 작성자의 기존 문서를 활용한 문체 기반 개인화
* 지원자 정보를 기반으로 한 추천서 생성
* LLM 기반 추천서 생성 pipeline 구현
* 생성 결과의 품질 자동 평가
* 입력된 정보에 기반한 사실 중심의 추천서 생성
* Web 기반 추천서 생성 및 평가 시스템 구현

---

## System Architecture

```text
Reference Documents
        ↓
Document Upload
        ↓
Writing Style Analysis
        ↓
Candidate Information
        ↓
Personalized Prompt Construction
        ↓
Claude
        ↓
Recommendation Letter
        ↓
GPT-based Evaluation
        ↓
Quality Scores
```

---

## Workflow

### 1. Document Upload

사용자는 기존에 작성된 문서를 TXT, DOCX 또는 PDF 형식으로 업로드합니다.

업로드된 문서는 이후 작성자의 문체적 특성을 분석하고 개인화된 추천서를 생성하기 위한 입력으로 사용됩니다.

---

### 2. Writing Style Analysis

업로드된 기존 문서를 분석하여 추천서 생성에 활용할 수 있는 작성자의 문체적 특성을 추출합니다.

분석된 문체 정보를 prompt에 반영하여 생성 결과가 입력 문서의 작성 스타일을 유지할 수 있도록 구성했습니다.

---

### 3. Candidate Information

추천서의 대상이 되는 지원자의 역량 및 관련 정보를 입력받습니다.

작성자의 문체 정보와 지원자 정보를 함께 활용하여 개인화된 추천서 생성에 필요한 context를 구성합니다.

---

### 4. Personalized Recommendation Letter Generation

작성자의 문체와 지원자 정보를 기반으로 Claude API를 활용하여 추천서를 생성합니다.

추천 강도와 문체적 특성을 조절할 수 있도록 prompt를 구성했습니다.

지원 강도:

```text
1 ─ 2 ─ 3 ─ 4 ─ 5
```

지원자가 선택할 수 있는 문체 유형:

* 공식형
* 친근형
* 간결형
* 설득형

---

### 5. LLM-based Quality Evaluation

생성된 추천서를 GPT 기반 평가 모델을 이용하여 자동으로 평가합니다.

다음과 같은 기준을 활용하여 생성 결과의 품질을 평가합니다.

* Accuracy
* Logicality
* Personalization
* Professionalism
* Persuasiveness

생성 모델과 별도의 평가 모델을 사용하여 **Recommendation Letter Generation → Quality Evaluation**의 구조를 구성했습니다.

---

### 6. Hallucination Mitigation

추천서 생성 과정에서 입력된 정보에 존재하지 않는 내용을 임의로 생성하는 문제를 줄이기 위해 prompt를 설계했습니다.

생성 과정에서 제공된 지원자 정보를 중심으로 답변하도록 제한하여 **사실 기반의 추천서 생성**을 목표로 했습니다.

---

## Core Features

### 1. Writing Style-based Personalization

* TXT, DOCX, PDF 문서 업로드
* 기존 작성 문서 분석
* 작성자 문체를 반영한 추천서 생성

---

### 2. Recommendation Strength & Tone Control

* 추천 강도 1~5 단계 조절
* 공식형
* 친근형
* 간결형
* 설득형

---

### 3. Automated Quality Evaluation

GPT 기반 평가 모델을 활용하여 생성된 추천서를 다음 기준으로 평가합니다.

| Evaluation Criteria |
| ------------------- |
| Accuracy            |
| Logicality          |
| Personalization     |
| Professionalism     |
| Persuasiveness      |

---

### 4. Hallucination Mitigation

입력된 지원자 정보를 중심으로 추천서를 생성하도록 prompt를 설계하여 생성 과정에서 발생할 수 있는 hallucination을 줄이고자 했습니다.

---

## Experimental Setup

| Component            | Technology         |
| -------------------- | ------------------ |
| Frontend             | React 18.3         |
| Backend              | Python FastAPI     |
| Database             | MySQL / PostgreSQL |
| Generation Model     | Claude Sonnet 4.5  |
| Evaluation Model     | GPT-4              |
| Programming Language | Python             |

---

## Results

본 시스템의 생성 결과를 대상으로 품질 평가 및 사용자 테스트를 수행했습니다.

| Evaluation             |   Result |
| ---------------------- | -------: |
| Average Quality Score  | 4.72 / 5 |
| Positive User Feedback |      90% |

평가 결과, 작성자 문체를 반영한 추천서 생성과 입력 정보 기반의 추천서 작성에서 긍정적인 결과를 확인했습니다.

---

## My Contributions

* 추천서 생성 및 품질 평가 pipeline 설계
* 입력 문서 기반 작성자 문체 분석 로직 설계
* Claude API 연동 및 prompt engineering
* 개인화된 추천서 생성 로직 구현
* GPT 기반 추천서 품질 평가 시스템 구현
* Hallucination mitigation을 위한 prompt 설계
* FastAPI 기반 backend 개발
* React 기반 frontend 구현

---

## Tech Stack

**LLM & Generative AI**

* Claude Sonnet 4.5
* GPT-4
* Prompt Engineering

**Backend**

* Python
* FastAPI

**Frontend**

* React 18.3

**Database**

* MySQL
* PostgreSQL

---

## Key Takeaways

본 프로젝트를 통해 **LLM 기반 텍스트 생성뿐만 아니라 개인화, 생성 결과 평가 및 hallucination mitigation까지 포함하는 전체 AI pipeline을 설계하고 구현**했습니다.

특히 사용자의 기존 문서를 활용하여 생성 결과를 개인화하고, 별도의 LLM을 이용해 생성 결과를 평가하는 구조를 구현함으로써 **개인화된 Human-AI interaction을 위한 LLM 활용 가능성**을 탐구했습니다.

---

---
**[실제 배포 화면]**
![이미지1](./images/image1.png)  

![이미지2](./images/image2.png)  

![이미지3](./images/image3.png)  

![이미지6](./images/image6.png)  

---
**[앱 배포화면]**

![이미지7](./images/image7.png)  

![이미지8](./images/image8.png)  
