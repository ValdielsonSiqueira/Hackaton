export const isSpeechSupported = (): boolean => {
  return typeof window !== "undefined" && "speechSynthesis" in window;
};

export const stopSpeech = (): void => {
  if (isSpeechSupported()) {
    window.speechSynthesis.cancel();
  }
};

export const speakText = (text: string, rate: number = 0.85): boolean => {
  if (!isSpeechSupported()) {
    return false;
  }

  stopSpeech();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "pt-BR";
  utterance.rate = rate; // Paused speech rate tailored for senior comprehension
  window.speechSynthesis.speak(utterance);
  return true;
};

export const speakDashboardSummary = (
  studentName: string,
  pendingToday: number,
  totalTasks: number,
  nextTaskTitle?: string
): boolean => {
  let text = `Olá, ${studentName || "Estudante"}! `;
  if (pendingToday > 0) {
    text += `Você tem ${pendingToday} ${pendingToday === 1 ? "atividade pendente" : "atividades pendentes"} hoje. `;
    if (nextTaskTitle) {
      text += `Sua atividade prioritária é: ${nextTaskTitle}. Clique no botão para executar a atividade.`;
    }
  } else if (totalTasks > 0) {
    text += `Parabéns! Todas as suas ${totalTasks} atividades do dia foram concluídas com sucesso.`;
  } else {
    text += `Você ainda não possui atividades cadastradas hoje. Clique em Ver Atividades para adicionar novas tarefas.`;
  }

  return speakText(text);
};

export const speakTaskDetails = (
  title: string,
  category: string,
  due: string,
  done: boolean
): boolean => {
  const text = `Atividade: ${title}. Categoria: ${category || "Geral"}. Prazo: ${due}. Status: ${done ? "Concluída" : "Pendente"}.`;
  return speakText(text);
};
