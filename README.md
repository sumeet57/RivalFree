
# RivalFree ⚡

> **Autonomous Competitive Intelligence & Feature Strategy Platform Grounded in Live Web Search**

[![SerpApi](https://img.shields.io/badge/Powered%20By-SerpApi-FF6F00?style=for-the-badge&logo=google&logoColor=white)](https://serpapi.com/)
[![AWS EC2](https://img.shields.io/badge/Deployed%20On-AWS%20EC2-232F3E?style=for-the-badge&logo=amazon-aws&logoColor=white)](https://aws.amazon.com/)
[![Docker](https://img.shields.io/badge/Containerized-Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)
[![Node.js](https://img.shields.io/badge/Backend-Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![React](https://img.shields.io/badge/Frontend-React-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)

RivalFree is an AI-powered competitive intelligence SaaS platform that automates market research for founders, product managers, and developers. Instead of manually spending days browsing review sites, competitor landing pages, and user forums, RivalFree uses an autonomous multi-agent pipeline to scan live web data, isolate competitor weaknesses, and surface high-value feature voids in uncontested market space.

---

## 🎯 The Problem & Solution

* **The Problem:** Traditional market analysis requires 20–40 hours of manual browser digging. Static LLMs fail at this task because their training cutoffs result in severe hallucinations regarding current competitor features and pricing.
* **The Solution:** RivalFree pairs a LangChain multi-agent engine with **SerpApi** for real-time web search grounding. It converts product ideas into actionable competitive maps, feature gap matrices, and live execution roadmaps in seconds.

---

## 🚀 Key Features

* **Real-Time Web Grounding:** Uses SerpApi to pull live SERP data, competitor landing pages, and user complaint threads directly into the reasoning loop.
* **Autonomous Multi-Agent Pipeline:** Parallelized agent workers manage Query Planning, Live SERP Scanning, and Feature Void Synthesis.
* **Interactive Progress Terminal:** Live streaming of agent execution states and thought steps powered by WebSockets (Socket.IO).
* **AI Advisory Co-Pilot:** Persistent, context-aware project and feature-level chat drawers for GTM strategy and technical implementation guidance.
* **Enterprise Security & Rate Limiting:** Built-in usage limits on project and feature generation to optimize compute and prevent API quota exhaustion.

---

## 🌐 How SerpApi Powers RivalFree

SerpApi serves as the fundamental ground-truth engine for RivalFree's autonomous agents:

1. **Competitor Discovery:** The Query Planning agent generates targeted search operators via SerpApi's Google Search Engine API to fetch top organic competitors and market incumbents.
2. **Review & Complaint Mining:** Executes targeted domain search queries to extract real-world user complaints, missing feature requests, and negative sentiment from public forums.
3. **Anti-Hallucination Guardrails:** Every generated market map and feature void is explicitly verified against fresh SERP metadata before rendering to the end user.

---

## 🏗 System Architecture



<img width="1175" height="516" alt="Scre" src="https://github.com/user-attachments/assets/a290e54e-c288-472f-b578-6568ecfc2bc0" />

---

## 🛠 Tech Stack

* **Frontend:** React, Tailwind CSS, Vite, Lucide Icons, Socket.IO Client
* **Backend:** Node.js, Express.js, Socket.IO, LangChain (`@langchain/google-genai`), Mongoose
* **Live Search Grounding:** SerpApi (Google Search API)
* **Database:** MongoDB Atlas
* **DevOps & Cloud:** AWS EC2 (Ubuntu 24.04 LTS), Docker, Docker Compose, Nginx, Let's Encrypt Certbot

---

## ⚡ Getting Started Locally

### Prerequisites

Make sure you have the following installed on your machine:
* [Node.js](https://nodejs.org/) (v20 or higher)
* [Docker](https://www.docker.com/) & Docker Compose
* [Git](https://git-scm.com/)

### 1. Clone the Repository
```bash
git clone [https://github.com/sumeet57/rivalfree.git]
cd rivalfree

```

### 2. Environment Configuration

Create a `.env` file in the root directory and populate it with your credentials:

```env
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
SERPAPI_API_KEY=your_serpapi_key
GEMINI_API_KEY=your_google_gemini_api_key
JWT_SECRET=your_jwt_secret_key
NODE_ENV=development

```

### 3. Run with Docker Compose

```bash
docker-compose up --build

```

Access the application at `http://localhost:3000` (Frontend) and `http://localhost:5000` (API Server).

---

## 🚢 AWS EC2 Deployment Guide

1. **Spin up an AWS EC2 Instance:** Launch an Ubuntu 24.04 LTS instance and open Ports `22` (SSH), `80` (HTTP), and `443` (HTTPS) in your Security Group.
2. **Install Docker & Nginx:**
```bash
sudo apt update && sudo apt install -y docker.io docker-compose nginx certbot python3-certbot-nginx

```


3. **Configure Nginx WebSocket Proxying:** Set up `/etc/nginx/sites-available/default` with `Upgrade` and `Connection` headers to pass WebSockets to port `5000`.
4. **Deploy Application:**
```bash
git clone [https://github.com/sumeet57/rivalfree.git]
cd rivalfree

docker-compose -f docker-compose.prod.yml up -d --build

```



---

## 🏆 Hackathon Submission Metadata

* **Hackathon:** SerpApi India Hackathon 2026
* **Track:** Commerce & Market Intelligence
* **Project Name:** RivalFree
* **Lead Developer:** Sumeet Umbalkar
