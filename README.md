# 🌿 SeniorEase — FIAP Inclusive

**SeniorEase** é uma plataforma acadêmica e de organização de rotina diária desenvolvida com foco total em **acessibilidade inclusiva**, **alta usabilidade para seniores** (conformidade WCAG AAA) e **excelência arquitetural SOLID & Clean Architecture**.

O projeto é estruturado em um **Monorepo modular (pnpm workspaces)** contendo aplicações **Web** e **Mobile** compartilhando contratos e entidades de domínio centralizadas.

---

## 🏗️ Estrutura do Monorepo

```
/
├── packages/
│   └── core/                 # Pacote compartilhado com modelos de domínio, interfaces e tipos
├── apps/
│   ├── web/                  # Aplicação Web (React 19 + Vite + Tailwind CSS + Vitest + Playwright)
│   └── mobile/               # Aplicação Mobile (React Native + Expo SDK 54 + TypeScript)
├── package.json              # Configuração raiz do monorepo
├── pnpm-workspace.yaml       # Definição de workspaces pnpm
└── README.md                 # Documentação principal do projeto
```

---

## 🛠️ Tecnologias Utilizadas

### 📦 Pacote Core (`@seniorease/core`)
- **TypeScript 5+**: Modelagem estrita de dados e tipos reutilizáveis.
- **Entidades de Domínio**: Modelos para `UserSettings` (escalas de fonte `fontScale`, modos de contraste `contrastMode`), `Task` (atividades acadêmicas) e `UserProfile`.

### 🌐 Aplicação Web (`apps/web`)
- **Core**: React 19, Vite, React Router DOM 7, TypeScript.
- **Estilização & UI**: Tailwind CSS 4, Lucide React, Radix UI (Switch).
- **Acessibilidade & Guias**: Driver.js para tour guiado de integração assistida.
- **Validação de Dados**: Zod (schemas estritos de formulário e autenticação).
- **Gerenciamento de Estado**: Context API e Zustand.
- **Recursos de Áudio**: Web Speech API para transcrição e síntese de voz em tempo real no navegador.

### 📱 Aplicação Mobile (`apps/mobile`)
- **Core**: React Native 0.79, Expo SDK 54, TypeScript.
- **Acessibilidade & Feedback**: `expo-speech` (síntese de voz nativa), `expo-haptics` (feedback tátil), `lucide-react-native`.
- **Persistência Local**: `@react-native-async-storage/async-storage`.
- **Componentes Exclusivos**:
  - `DateTimePickerMobile`: Calendário mensal interativo e seletor de horários idêntico ao Web.
  - `MobileTourModal` & `TourIllustrationSVGs`: Tour interativo com ilustrações nativas e áudio sob demanda.
  - `AccessibilityToolbarMobile`: Barra flutuante de acessibilidade arrastável com ajuste automático de fonte sem quebra de linhas.

---

## 📐 Arquitetura & Padrões de Projeto (SOLID)

Ambas as aplicações foram construídas respeitando rigorosamente os princípios **SOLID**:

1. **DIP (Dependency Inversion Principle)**:
   - Os módulos de negócios dependem exclusivamente de interfaces abstratas de repositório (`AuthRepository`, `UserProfileRepository`, `ActivityRepository`, `TaskRepository`).
   - Infraestruturas concretas (como `LocalStorageAuthRepository` na Web e `AsyncStorageAuthRepository` no Mobile) são injetadas em tempo de execução.

2. **DI Container (Injeção de Dependência)**:
   - Gerenciador central de dependências (`container.ts`) que instancia repositórios, casos de uso (`AuthUseCases`, `ManageSettingsUseCase`, `ManageTasksUseCase`) e serviços de voz (`WebSpeechVoiceService` e `ExpoSpeechVoiceService`).

3. **SRP (Single Responsibility Principle)**:
   - Telas e modais extensos foram refatorados em subcomponentes coesos de responsabilidade única:
     - **Web**: `AuthFormFields`, `AuthModeSwitch`, `AccessibilityTip`, `TaskFormPrioritySelector`, `TaskFormStepsSection`.
     - **Mobile**: `DashboardWelcomeBanner`, `DashboardPriorityTaskCard`, `DashboardStatsRow`, `ProfileInfoSection`, `MobileTaskPrioritySelector`, `MobileTaskStepsSection`, `AccessibilityDrawerModal`.

---

## 🚀 Como Executar o Projeto

### 1. Pré-requisitos
- **Node.js** `>= 18.0.0`
- **pnpm** instalado globalmente (`npm install -g pnpm`)

### 2. Instalação e Build Inicial
Na raiz do monorepo, instale todas as dependências e compile o pacote core compartilhado:

```bash
# 1. Instalar dependências de todos os workspaces
pnpm install

# 2. Compilar o pacote core compartilhado
pnpm --filter @seniorease/core build
```

---

### 🌐 Executando a Aplicação Web

Para iniciar o servidor de desenvolvimento da Web (Vite):

```bash
pnpm --filter web dev
```

Acesse no navegador: **`http://localhost:5173`**

---

### 📱 Executando a Aplicação Mobile

Para iniciar o servidor do Expo no Mobile:

```bash
pnpm --filter mobile start
```

No terminal do Expo, escolha a plataforma desejada:
- Digite `a` para abrir no emulador Android
- Digite `i` para abrir no simulador iOS
- Digite `w` para abrir na versão Web do Expo

Para verificação estática de tipos no mobile:
```bash
pnpm --filter mobile exec tsc --noEmit
```

---

## 🧪 Testes no Projeto Web

O projeto Web conta com uma suíte abrangente de testes unitários, de integração e testes End-to-End (E2E):

### 1. Testes Unitários & Integração (Vitest + React Testing Library)
Validam os repositórios locais, store Zustand, proteção de rotas e componentes principais de autenticação e tarefas:

```bash
# Executar todos os testes unitários uma vez
pnpm --filter web test

# Executar testes unitários em modo watch (desenvolvimento)
pnpm --filter web test:watch
```

**Suítes de Testes Incluídas:**
- `LocalStorageRepositories.test.ts`: Verificação dos repositórios de armazenamento local.
- `useAppStore.test.ts`: Testes do gerenciador de estado global.
- `ProtectedRoute.test.tsx`: Testes de rotas protegidas e controle de acesso.
- `WelcomeBanner.test.tsx`: Renderização e ações do banner inicial.
- `CreateTaskModal.test.tsx`: Validação do formulário de criação de atividades.
- `AuthFormCard.test.tsx`: Teste de fluxo de login e cadastro.

### 2. Testes End-to-End (Playwright E2E)
Testam a jornada completa do usuário final no navegador simulado real:

```bash
# Executar suíte completa E2E em modo headless
pnpm --filter web test:e2e

# Executar suíte E2E com interface visual do Playwright
pnpm --filter web test:e2e:ui

# Executar suíte E2E com navegador visível (headed)
pnpm --filter web test:e2e:headed
```

**Credenciais Pré-cadastradas para Testes E2E e Avaliação:**
- **E-mail**: `estudante@fiap.com.br`
- **Senha**: `senha123456`

---

## ♿ Funcionalidades de Acessibilidade (WCAG AAA)

- **Escala Dinâmica de Fonte**: Ajuste em tempo real de `100%` a `150%+` sem quebra de leiaute ou sobreposição.
- **Alto Contraste**: Tema especial WCAG AAA (Fundo Preto com acentos Amarelos de alto contraste) e Modo Escuro Grafite.
- **Áudio Sob Demanda**: O usuário decide se deseja ouvir a explicação em voz alta através de botões dedicados de áudio (sem disparos forçados ou inesperados).
- **Navegação Simplificada**: Opção de alternar para o Modo Simplificado, ocultando elementos secundários da interface.
- **Teclado & Atalhos**: Suporte total a leitor de tela e navegação por teclado em todos os botões e formulários.
