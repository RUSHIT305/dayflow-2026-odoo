# DayFlow — Human Resource Management System

<p align="center">
  <strong>A modern, intelligent and unified Human Resource Management System</strong>
</p>

<p align="center">
  Built with React, TypeScript, Vite and Google Gemini
</p>

<p align="center">

  <a href="https://github.com/RUSHIT305/dayflow-2026-odoo">
    <img src="https://img.shields.io/badge/GitHub-Repository-black?style=for-the-badge&logo=github" alt="GitHub Repository">
  </a>

  <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React">
  <img src="https://img.shields.io/badge/TypeScript-5.8-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript">
  <img src="https://img.shields.io/badge/Vite-6-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite">
  <img src="https://img.shields.io/badge/License-MIT-green?style=for-the-badge" alt="MIT License">

</p>

---

## Overview

**DayFlow** is a modern Human Resource Management System designed to centralize and simplify essential employee and organizational workflows in a single web-based platform.

The system provides a structured interface for managing HR-related operations while combining a responsive frontend architecture with AI-powered capabilities.

DayFlow is designed with a focus on:

- Employee management
- HR workflow organization
- Attendance and work-related operations
- Centralized information management
- Modern dashboard-driven UX
- AI-assisted functionality
- Responsive and scalable frontend architecture

---

## Problem Statement

Traditional HR workflows frequently rely on disconnected systems, spreadsheets, manual processes and repetitive administrative tasks.

This creates several challenges:

- Fragmented employee information
- Manual HR operations
- Inefficient workflow management
- Difficulty maintaining centralized records
- Poor visibility into organizational activity
- Increased administrative overhead
- Limited intelligent assistance for HR teams

**DayFlow addresses these challenges by providing a centralized HR management interface that brings important employee and organizational workflows into one system.**

---

## Objectives

The primary objectives of DayFlow are to:

1. Centralize HR-related information.
2. Simplify employee and organizational workflows.
3. Provide an intuitive dashboard-driven experience.
4. Reduce repetitive administrative operations.
5. Improve visibility into HR activities.
6. Introduce AI-assisted capabilities where appropriate.
7. Provide a scalable frontend architecture for future HR modules.

---

# Features

## Employee Management

Manage employee-related information through a centralized interface.

Capabilities include:

- Employee profiles
- Employee information
- Organizational information
- Employee-related workflows
- Structured employee data presentation

---

## HR Dashboard

A centralized dashboard provides visibility into important HR information and application activity.

The dashboard architecture is designed to support:

- Summary information
- HR metrics
- Employee activity
- Organizational insights
- Quick access to important modules

---

## Attendance & Work Management

DayFlow is structured to support employee work and attendance-related workflows.

The architecture allows HR operations to be organized around:

- Attendance
- Work activity
- Employee status
- Operational information

---

## AI-Assisted HR Operations

DayFlow integrates Google's Gemini AI ecosystem to enable intelligent functionality within the application.

The project uses:

- `@google/genai`
- Gemini API
- AI-assisted application workflows

AI capabilities can be extended to support:

- HR assistance
- Information retrieval
- Intelligent recommendations
- Workflow assistance
- Natural-language interaction

---

## Modern UI

The application uses a modern component-driven interface with:

- Responsive layouts
- Reusable React components
- Icon-based navigation
- Motion and animation
- Tailwind CSS
- Interactive UI elements

---

# Technology Stack

| Technology | Purpose |
|---|---|
| React 19 | Frontend application framework |
| TypeScript | Type-safe application development |
| Vite 6 | Development server and build system |
| Tailwind CSS | UI styling |
| Google Gemini | AI capabilities |
| Motion | UI animation |
| Lucide React | Icon system |
| Canvas Confetti | UI effects |
| Express | Supporting server capability |
| Node.js | Runtime environment |

The project's current `package.json` defines React 19, TypeScript, Vite, Tailwind CSS, Google GenAI, Motion, Lucide React, Express and related dependencies. 

---

# Project Architecture

DayFlow follows a modular React + TypeScript architecture.

```text
dayflow-2026-odoo/
│
├── dayflow-hrms/
│   │
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── data/
│   │   ├── utils/
│   │   │
│   │   ├── App.tsx
│   │   ├── index.css
│   │   ├── main.tsx
│   │   └── types.ts
│   │
│   ├── README.md
│   ├── bun.lock
│   ├── index.html
│   ├── metadata.json
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts
│
└── LICENSE
