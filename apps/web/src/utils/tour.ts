import { driver, type DriveStep } from "driver.js";
import "driver.js/dist/driver.css";

const TOUR_STORAGE_KEY = "seniorease_tour_completed";

const filterExistingSteps = (steps: DriveStep[]): DriveStep[] => {
  return steps.filter((step) => {
    if (typeof document === "undefined") return true;
    if (typeof step.element === "string") return !!document.querySelector(step.element);
    return true;
  });
};

export const isTourCompleted = (): boolean => {
  return localStorage.getItem(TOUR_STORAGE_KEY) === "true";
};

export const markTourCompleted = (): void => {
  localStorage.setItem(TOUR_STORAGE_KEY, "true");
};

export const resetTourCompleted = (): void => {
  localStorage.removeItem(TOUR_STORAGE_KEY);
};

export const startDashboardTour = (onComplete?: (() => void) | unknown) => {
  const driverObj = driver({
    showProgress: true,
    animate: true,
    allowClose: true,
    smoothScroll: true,
    stagePadding: 8,
    nextBtnText: "Próximo ➔",
    prevBtnText: "← Anterior",
    doneBtnText: "Concluir ➔",
    progressText: "Passo {{current}} de {{total}}",
    onHighlightStarted: (element) => {
      if (element) {
        element.scrollIntoView({ behavior: "instant" as ScrollBehavior, block: "center" });
        setTimeout(() => {
          try {
            driverObj.refresh();
          } catch (e) {}
        }, 20);
      }
    },
    onDestroyed: () => {
      markTourCompleted();
      if (typeof onComplete === "function") {
        onComplete();
      }
    },
    steps: filterExistingSteps([
      {
        element: "#senior-ease-logo",
        popover: {
          title: "👋 Bem-vindo ao SeniorEase!",
          description: "Sua plataforma acessível de atividades com leitura por voz, auto-contraste e navegação simplificada e inclusiva.",
          side: "bottom",
          align: "start"
        }
      },
      {
        element: "#font-btn-group",
        popover: {
          title: "🔍 Controle de Fonte (A- / A+)",
          description: "Aumente ou diminua as letras de qualquer página do sistema em tempo real usando estes botões no topo.",
          side: "bottom",
          align: "center"
        }
      },
      {
        element: "#a11y-toolbar-floating",
        popover: {
          title: "♿ Barra Flutuante de Acessibilidade",
          description: "Tradução nativa em LIBRAS (VLibras), Modo Escuro e Alto Contraste ao seu alcance a qualquer momento.",
          side: "left",
          align: "start"
        }
      },
      {
        element: "#welcome-banner",
        popover: {
          title: "🔊 Resumo Falado em Voz Alta",
          description: "Clique no botão de voz para ouvir a síntese falada com as principais orientações e tarefas do seu dia.",
          side: "bottom",
          align: "center"
        }
      },
      {
        element: "#priority-task-card",
        popover: {
          title: "🎯 Próxima Atividade Prioritária",
          description: "Veja o seu próximo compromisso acadêmico ou tarefa em destaque e execute diretamente em um único clique.",
          side: "bottom",
          align: "center"
        }
      },
      {
        element: "#dashboard-stats-row",
        popover: {
          title: "📊 Resumo de Desempenho",
          description: "Acompanhe quantas tarefas foram concluídas hoje, quantas estão pendentes e sua sequência de dias ativos.",
          side: "bottom",
          align: "center"
        }
      },
      {
        element: "#qs-heading",
        popover: {
          title: "⚙️ Preferências Rápidas",
          description: "Alterne instantaneamente entre o tema Padrão (Branco), Alto Contraste e Modo Escuro.",
          side: "top",
          align: "start"
        }
      },
      {
        element: "#modules-grid",
        popover: {
          title: "🧩 Módulos Principais",
          description: "Acesse rapidamente a área de Personalização, Minhas Atividades, Perfil ou Suporte por telefone 0800.",
          side: "top",
          align: "center"
        }
      },
      {
        element: "#recent-activity-section",
        popover: {
          title: "📋 Histórico de Atividades",
          description: "Acompanhe de forma simples o status de tudo o que você concluiu ou ainda precisa fazer, com botão de áudio por item.",
          side: "top",
          align: "center"
        }
      }
    ])
  });

  driverObj.drive();
};

export const startTasksTour = (onComplete?: (() => void) | unknown) => {
  const driverObj = driver({
    showProgress: true,
    animate: true,
    allowClose: true,
    smoothScroll: true,
    nextBtnText: "Próximo ➔",
    prevBtnText: "← Anterior",
    doneBtnText: "Concluir ➔",
    progressText: "Passo {{current}} de {{total}}",
    onHighlightStarted: (element) => {
      if (element) {
        element.scrollIntoView({ behavior: "instant" as ScrollBehavior, block: "center" });
        setTimeout(() => {
          try {
            driverObj.refresh();
          } catch (e) {}
        }, 20);
      }
    },
    onDestroyed: () => {
      if (typeof onComplete === "function") {
        onComplete();
      }
    },
    steps: filterExistingSteps([
      {
        element: "#btn-new-task",
        popover: {
          title: "➕ Cadastrar Nova Atividade",
          description: "Adicione tarefas ditando por voz com o microfone ou digitando os passos da sua rotina.",
          side: "bottom",
          align: "end"
        }
      },
      {
        element: "#tasks-progress-card",
        popover: {
          title: "📊 Barra de Progresso",
          description: "Visualize a porcentagem e quantas atividades já foram finalizadas no dia.",
          side: "bottom",
          align: "center"
        }
      },
      {
        element: "#task-list",
        popover: {
          title: "✅ Lista de Tarefas com Voz",
          description: "Marque o que já fez, ouça as instruções em áudio passo a passo e gerencie seu dia com facilidade.",
          side: "top",
          align: "center"
        }
      }
    ])
  });

  driverObj.drive();
};

export const startProfileTour = (onComplete?: (() => void) | unknown) => {
  const driverObj = driver({
    showProgress: true,
    animate: true,
    allowClose: true,
    smoothScroll: true,
    nextBtnText: "Próximo ➔",
    prevBtnText: "← Anterior",
    doneBtnText: "Concluir ➔",
    progressText: "Passo {{current}} de {{total}}",
    onHighlightStarted: (element) => {
      if (element) {
        element.scrollIntoView({ behavior: "instant" as ScrollBehavior, block: "center" });
        setTimeout(() => {
          try {
            driverObj.refresh();
          } catch (e) {}
        }, 20);
      }
    },
    onDestroyed: () => {
      if (typeof onComplete === "function") {
        onComplete();
      }
    },
    steps: filterExistingSteps([
      {
        element: "#user-profile-card",
        popover: {
          title: "👤 Seus Dados Cadastrais",
          description: "Atualize seu Nome Completo e E-mail de acesso. Clique em 'Salvar Informações Cadastrais' para salvar.",
          side: "bottom",
          align: "start"
        }
      },
      {
        element: "#caregiver-input",
        popover: {
          title: "🤝 Apoio & Cuidador",
          description: "Campo opcional para registrar o telefone ou e-mail do seu cuidador/familiar em caso de apoio.",
          side: "top",
          align: "start"
        }
      },
      {
        element: "#accessibility-preferences-card",
        popover: {
          title: "⚙️ Preferências de Acessibilidade",
          description: "Ajuste o tamanho do texto, os temas visuais (Padrão, Alto Contraste, Escuro Carbon) e opções de confirmações por voz.",
          side: "left",
          align: "start"
        }
      }
    ])
  });

  driverObj.drive();
};
