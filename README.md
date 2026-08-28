# LLM-based Personalized Recommendation Letter Generation & Evaluation

> An LLM-based personalized recommendation letter generation and evaluation system.

작성자의 기존 문서를 기반으로 **문체를 분석하고, 지원자 정보를 반영한 개인화 추천서를 생성한 뒤 LLM을 통해 생성 결과의 품질을 평가하는 시스템**입니다.

본 프로젝트에서는 문서 입력부터 문체 분석, 추천서 생성, 품질 평가까지 이어지는 **End-to-End LLM pipeline**을 설계 및 구현했습니다.

---

## Project Overview

### Motivation

LLM은 자연어 생성에 강점을 가지지만, 사용자의 문체와 제공된 정보를 일관되게 반영하는 데에는 한계가 있습니다.

본 프로젝트에서는 작성자의 기존 문서를 활용하여 **개인화된 문체를 반영한 추천서 생성**을 수행하고, 별도의 LLM을 이용하여 생성 결과의 품질을 자동으로 평가하는 시스템을 구축했습니다.

이를 통해 **Personalization → Generation → Evaluation**으로 이어지는 LLM pipeline을 구현했습니다.

---

## Objectives

* 기존 문서를 활용한 작성자 문체 기반 개인화
* 지원자 정보를 반영한 추천서 생성
* LLM 기반 추천서 생성 pipeline 구현
* 생성 결과의 품질 자동 평가
* 입력 정보에 기반한 사실 중심의 추천서 생성
* Web 및 App 기반 서비스 구현

---

## System Architecture

```text
Reference Documents
        ↓
Writing Style Analysis
        ↓
Candidate Information
        ↓
Personalized Prompt
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

### 1. Writing Style Analysis

사용자가 기존에 작성한 TXT, DOCX 또는 PDF 문서를 업로드하면 문서의 문체적 특성을 분석합니다.

분석된 정보를 prompt에 반영하여 생성된 추천서가 **작성자의 기존 문체와 일관성을 유지**하도록 구성했습니다.

---

### 2. Candidate Information

추천서의 대상이 되는 지원자의 역량 및 관련 정보를 입력받습니다.

작성자의 문체 정보와 지원자 정보를 함께 활용하여 추천서 생성에 필요한 context를 구성합니다.

---

### 3. Personalized Recommendation Letter Generation

작성자의 문체와 지원자 정보를 기반으로 **Claude API**를 활용하여 추천서를 생성합니다.

입력된 지원자 정보를 중심으로 추천서를 작성하도록 prompt를 설계하여 사실 기반의 생성을 유도했습니다.

---

### 4. LLM-based Quality Evaluation

생성된 추천서를 별도의 **GPT 기반 평가 모델**을 이용하여 자동으로 평가합니다.

| Evaluation Criteria |
| ------------------- |
| Accuracy            |
| Logicality          |
| Personalization     |
| Professionalism     |
| Persuasiveness      |

생성 모델과 평가 모델을 분리하여 **Recommendation Letter Generation → Quality Evaluation** 구조를 구현했습니다.

---

### 5. Hallucination Mitigation

추천서 생성 과정에서 입력된 정보에 존재하지 않는 내용을 임의로 생성하는 문제를 줄이기 위해 prompt를 설계했습니다.

지원자에게 제공된 정보를 중심으로 작성하도록 제한하여 **사실 기반의 추천서 생성**을 목표로 했습니다.

---

## Experimental Setup

| Component        | Technology         |
| ---------------- | ------------------ |
| Frontend         | React 18.3         |
| Backend          | Python FastAPI     |
| Database         | MySQL / PostgreSQL |
| Generation Model | Claude Sonnet 4.5  |
| Evaluation Model | GPT-4              |
| Language         | Python             |

---

## Results

생성된 추천서를 대상으로 품질 평가 및 사용자 테스트를 수행했습니다.

| Evaluation             |       Result |
| ---------------------- | -----------: |
| Average Quality Score  | **4.72 / 5** |
| Positive User Feedback |      **90%** |

평가 결과, 작성자 문체를 반영한 추천서 생성과 입력 정보 기반의 추천서 작성에서 긍정적인 결과를 확인했습니다.

---

## My Contributions

* 추천서 생성 및 품질 평가 pipeline 설계
* 입력 문서 기반 작성자 문체 분석 로직 설계
* Claude API 연동 및 prompt engineering
* 개인화 추천서 생성 로직 구현
* GPT 기반 추천서 품질 평가 시스템 구현
* Hallucination mitigation을 위한 prompt 설계
* FastAPI backend 개발
* React frontend 개발

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

## Deployment

### Web

![Web Login](./images/image1.png)

![Recommendation Letter](./images/image2.png)

![Generated Recommendation Letter](./images/image3.png)

![Quality Evaluation](./images/image6.png)

### App

![App Home](./images/image7.png)

![App Login](./images/image8.png)
