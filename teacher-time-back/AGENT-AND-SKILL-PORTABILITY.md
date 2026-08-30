# Teacher Time-Back Agent and Skill: What They Do and Where They Work

## The plain-language answer

The agent and the skill share the same teaching method, but they are not the same product.

- The agent package is a platform-neutral behavior specification. It describes the conversation, safety boundaries, output, examples, and tests. It is not currently a hosted chatbot.
- The skill package is an installable Codex skill. Its packaging is specific to Codex, but most of its instructional content can be translated into other AI products.

There is no single universal file that can be imported unchanged into ChatGPT, Microsoft Copilot, Google Gemini, MagicSchool, and every other platform. Each product handles instructions, knowledge, sharing, permissions, accounts, memory, tools, and safety controls differently.

The safest architecture is:

1. keep one vendor-neutral Assistant Blueprint as the source of truth;
2. let the school name its approved platform and account;
3. create a tested adapter for that platform;
4. run the same safety and behavior evaluations after translation.

## What the Teacher Time-Back Finder agent does

The agent guides a beginner through one decision at a time.

1. It asks what workload keeps repeating and how much time it takes.
2. It checks whether the task is repeatable, student-neutral, reviewable, and bounded.
3. It asks for the school's approved AI environment. If none is known, it stays in paper/planning mode.
4. It maps allowed and prohibited inputs.
5. It selects a safe starter lane.
6. It produces copy-ready instructions containing one job, allowed sources, exact output, quality criteria, refusal behavior, and the teacher's decision line.
7. It creates a fictional test.
8. It gives the teacher an accuracy, bias, appropriateness, and alignment review.
9. It creates a two-week keep, revise, or stop measurement plan.

## What the agent does not do

It does not:

- ask for or process student records or direct or indirect identifiers;
- browse the web;
- accept file uploads;
- remember students or prior sensitive context;
- take actions in external systems;
- certify compliance, legality, security, or school approval;
- grade, score, rank, diagnose, determine accommodations, write IEPs, recommend discipline, or make student decisions;
- send a communication without human review;
- promise a specific number of hours saved.

The included `agent-config.json` makes these limits explicit. `conversation-examples.md` demonstrates intended conversations. `evals.json` contains test cases that check whether the behavior holds under normal and unsafe requests.

## What the Codex skill does

The Codex skill is a reusable instruction package that Codex can discover when a request matches its stated purpose. It applies the same method and loads supporting references only when needed.

Its files include:

- `SKILL.md`: when the skill should be used, the required method, safety response, and final output;
- `agents/openai.yaml`: Codex-facing display and invocation metadata;
- `references/assistant-lanes.md`: starter task routes;
- `references/guardrails.md`: safety boundaries and escalation;
- `references/blueprint-template.md`: the required finished artifact;
- `references/fictional-practice.md`: a safe practice case.

The ZIP can be installed as a Codex skill. That installation behavior is Codex-specific. Other platforms will not recognize `SKILL.md` or `agents/openai.yaml` as an installable skill package.

## Is the agent only for OpenAI products?

No. The method is portable. The current agent folder is deliberately written as a platform-neutral specification rather than an OpenAI API application.

However, it is not yet a live public agent. A school cannot click one link and use it until it is implemented in a selected platform or presented through the standalone no-login Time-Back Finder. Platform access and school approval must be decided before live use.

## Is the skill only for OpenAI products?

The installable skill package is specifically for Codex. The underlying instructions and references are plain Markdown and can be translated, but the installation format does not carry over automatically.

## Portability by product

### ChatGPT GPTs

Translation level: high.

The agent's behavior can become GPT instructions, its reference files can become knowledge, its conversation starters can be reused, and its evaluations can be rerun in Preview. OpenAI's current GPT editor separates instructions, knowledge, capabilities, and conversation starters, which maps closely to this package. Availability and sharing depend on workspace type and permissions.

Official reference: [Creating and editing GPTs](https://help.openai.com/en/articles/8554397-creating-a-gpt)

What must be adapted:

- copy behavior rules into the GPT instruction field;
- upload only the approved reference files;
- keep web, actions, file uploads, and memory-like features off unless the school approves them;
- verify sharing and workspace permissions;
- rerun all safety evals in Preview.

### Microsoft Copilot Studio

Translation level: high for a managed district environment.

Copilot Studio supports natural-language agent instructions that define purpose, tone, scope, declines, and escalation. This means the conversational method can be translated, but tenant configuration, knowledge sources, connectors, authentication, data controls, and sharing require district ownership.

Official reference: [Configure agent details and instructions](https://learn.microsoft.com/en-us/microsoft-copilot-studio/agents-experience/authoring-instructions)

What must be adapted:

- translate the agent behavior into Copilot Studio instructions;
- configure only district-approved knowledge and tools;
- implement refusal and escalation paths;
- restrict sharing to the intended staff audience;
- test inside the actual school tenant.

### Google Gemini Gems

Translation level: high for the conversational instructions.

Gemini Gems support a named custom Gem with written instructions and optional files for context. The role, task, context, and output format can be translated from the Assistant Blueprint. Workspace availability, account restrictions, file handling, and admin settings still require school confirmation.

Official references: [Tips for creating custom Gems](https://support.google.com/gemini/answer/15235603) and [Get started with Gems](https://support.google.com/gemini/answer/15236321)

What must be adapted:

- translate the role, task, context, and format into Gem instructions;
- add only approved reference files;
- confirm the exact Workspace account and admin permissions;
- test refusal behavior and output review reminders;
- confirm how the Gem is shared and updated.

### MagicSchool

Translation level: medium to high, depending on the school's plan and custom-tool access.

MagicSchool is an AI platform built for teachers. Its current materials describe teacher tools, custom tools, collections, and district-customized tools. The Time-Back method can be expressed as a custom tool or a series of teacher-facing templates when those features are available in the school's approved plan.

Official references: [MagicSchool teacher tools](https://www.magicschool.ai/magic-tools) and [Ready-made custom AI teaching tools](https://www.magicschool.ai/ready-made-resources)

What must be adapted:

- choose whether the workflow fits a MagicSchool custom tool, saved prompt, or existing teacher tool;
- preserve the one-job boundary and human decision line;
- confirm what custom behavior, refusal language, and sharing controls the school's plan supports;
- test with fictional content instead of assuming the platform's education focus makes every task appropriate;
- do not claim that a general Codex or GPT package has been imported directly.

### Other teacher AI products

Translation level: varies.

Products with reusable instructions, custom assistants, templates, or saved workflows can usually carry the core method. Products that only expose fixed generators may support the task lane but not the full refusal behavior, guided conversation, or evaluation sequence.

Before promising an adapter for any product, verify:

- the school-approved account and license;
- whether custom instructions are supported;
- whether files or knowledge can be attached;
- whether the assistant remembers prior chats;
- whether tools, connectors, or web access can be disabled;
- how staff sharing and version updates work;
- how the product handles teacher and student data;
- whether every included evaluation can be reproduced.

## What ports unchanged

- the four first-task filters;
- the green/yellow/red input logic;
- the six-field Assistant Blueprint;
- the refusal principle;
- fictional practice;
- the four-part human review;
- the two-week keep, revise, or stop decision;
- the evaluation scenarios.

## What must be rebuilt for each platform

- installation and packaging;
- workspace or tenant permissions;
- knowledge uploads;
- capability settings;
- sharing controls;
- connector and web-access restrictions;
- data retention and account guidance;
- interface language and screenshots;
- product-specific testing.

## Recommended public product structure

The public offer should not lead with an OpenAI-only download. It should offer three layers:

1. Universal: the Assistant Blueprint, workbook, practice pack, and review cards.
2. No-login: the browser-based Time-Back Finder for planning a safe first task.
3. Platform adapter: a school-specific implementation for its approved product, starting with ChatGPT, Copilot, Gemini, or MagicSchool only after the school chooses.

This keeps the value centered on giving teachers time back safely, not on selling one vendor. It also prevents a teacher from feeling that they chose the wrong workshop because their school uses a different platform.
