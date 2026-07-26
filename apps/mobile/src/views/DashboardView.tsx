import React, { useState, useRef } from "react";
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  ScrollView, 
  Switch, 
  LayoutChangeEvent 
} from "react-native";
import type { MobileThemeColors } from "../theme/mobileTheme";
import type { MobileTaskItem } from "../context/AppContext";
import type { UserSettings } from "@seniorease/core";
import { SpotlightCutoutTour, SpotlightStep } from "../components/SpotlightCutoutTour";
import { 
  Volume2, 
  Compass, 
  BookOpen, 
  Target, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Circle, 
  Clock, 
  Flame, 
  Settings, 
  RotateCcw, 
  ZoomIn, 
  Eye, 
  ShieldCheck, 
  Sun, 
  Moon, 
  Sliders, 
  BookCheck, 
  User, 
  HelpCircle, 
  FileCheck, 
  Video, 
  MessageSquare, 
  Plus 
} from "lucide-react-native";

interface DashboardViewProps {
  theme: { colors: MobileThemeColors; fontScale: number };
  settings: UserSettings;
  updateSettings: (newSettings: UserSettings) => Promise<void>;
  studentName: string;
  activityTasks: MobileTaskItem[];
  toggleActivityTask: (id: string) => Promise<void>;
  speakText: (text: string) => void;
  triggerToast: (msg: string) => void;
  onNavigateTab: (tab: "dashboard" | "tasks" | "profile" | "help") => void;
  onOpenHelpModal: () => void;
  bottomInset?: number;
}

const getGreeting = () => {
  const hours = new Date().getHours();
  if (hours >= 5 && hours < 12) {
    return { text: "Bom dia", icon: "☀️🌿" };
  } else if (hours >= 12 && hours < 18) {
    return { text: "Boa tarde", icon: "🌤️🌿" };
  } else {
    return { text: "Boa noite", icon: "🌙🌿" };
  }
};

export const DashboardView: React.FC<DashboardViewProps> = ({
  theme,
  settings,
  updateSettings,
  studentName,
  activityTasks,
  toggleActivityTask,
  speakText,
  triggerToast,
  onNavigateTab,
  onOpenHelpModal,
  bottomInset = 0,
}) => {
  const scrollViewRef = useRef<ScrollView>(null);
  const [showTour, setShowTour] = useState(false);

  // Local switch states for Proteções & Leitura
  const [confirmActions, setConfirmActions] = useState(true);
  const [voiceReminders, setVoiceReminders] = useState(true);

  // Dynamic Scroll Y positions captured via onLayout
  const [bannerY, setBannerY] = useState(0);
  const [priorityY, setPriorityY] = useState(200);
  const [quickSettingsY, setQuickSettingsY] = useState(500);
  const [modulesY, setModulesY] = useState(850);
  const [recentTasksY, setRecentTasksY] = useState(1200);

  const { colors, fontScale } = theme;
  const contrastMode = settings.contrastMode || "standard";
  const isHighContrast = contrastMode === "high";
  const isSimplified = settings.navigationMode === "simplified";

  const greeting = getGreeting();
  const studentFirstName = studentName ? studentName.split(" ")[0] : "Estudante";
  const pendingCount = activityTasks.filter((t) => !t.done).length;
  const completedCount = activityTasks.filter((t) => t.done).length;
  const nextTask = activityTasks.find((t) => !t.done);

  const primaryAccentColor = isHighContrast ? colors.primary : "#0F62FE";
  const bannerBg = isHighContrast ? "#000000" : "#161616";
  const bannerButtonBg = isHighContrast ? "#222200" : "#262626";

  const tourSteps: SpotlightStep[] = [
    {
      id: "step-1",
      targetName: "Banner de Boas-Vindas",
      title: "1/5 Bem-vindo ao SeniorEase",
      description: "Apresenta o resumo diário das suas tarefas acadêmicas e permite ouvir a explicação por voz.",
      voiceText: "Bem-vindo ao SeniorEase! Este é o seu banner principal com o resumo diário das tarefas.",
      tip: "Toque em 'Ouvir resumo por voz' para escutar em voz alta.",
      scrollY: bannerY,
    },
    {
      id: "step-2",
      targetName: "Atividade de Alta Prioridade",
      title: "2/5 Atividade com Prioridade Urgente",
      description: "Destaca a tarefa acadêmica mais importante do momento para você concluir em 1 toque.",
      voiceText: "Aqui fica sua atividade de maior prioridade. Clique em Executar Atividade Agora assim que terminar.",
      tip: "Finalize primeiro as tarefas com badge de alta prioridade.",
      scrollY: priorityY,
    },
    {
      id: "step-3",
      targetName: "Painel de Acessibilidade",
      title: "3/5 Ajustes Rápidos de Acessibilidade",
      description: "Permite aumentar o tamanho da fonte (A+/A-) e alternar entre Alto Contraste (WCAG AAA) ou Modo Escuro.",
      voiceText: "Neste painel você ajusta o tamanho do texto e as cores de alto contraste.",
      tip: "Você também pode acessar essas preferências no botão flutuante verde 'Acessível'.",
      scrollY: quickSettingsY,
    },
    {
      id: "step-4",
      targetName: "Módulos da Plataforma",
      title: "4/5 Módulos de Navegação",
      description: "Acesse rapidamente suas atividades, perfil acadêmico e a Central de Suporte 0800.",
      voiceText: "Aqui você encontra os atalhos para os módulos principais da plataforma.",
      tip: "Ligue para 0800 700 8000 se precisar de suporte telefônico gratuito.",
      scrollY: modulesY,
    },
    {
      id: "step-5",
      targetName: "Lista de Atividades Recentes",
      title: "5/5 Atividades Recentes e Áudio",
      description: "Acompanhe o progresso de cada tarefa e use o ícone de alto-falante para ouvir o texto.",
      voiceText: "Toque no ícone de alto-falante em qualquer atividade para ouvir o nome da tarefa em voz alta.",
      tip: "A marcação verde indica que a atividade já foi concluída.",
      scrollY: recentTasksY,
    },
  ];

  const getActivityIcon = (category: string) => {
    const cat = (category || "").toUpperCase();
    if (cat.includes("AULA") || cat.includes("ONLINE")) return <Video size={20} color={primaryAccentColor} />;
    if (cat.includes("LEITURA")) return <BookOpen size={20} color={primaryAccentColor} />;
    if (cat.includes("PARTICIPAÇ") || cat.includes("FÓRUM")) return <MessageSquare size={20} color={colors.success} />;
    return <FileCheck size={20} color={colors.text} />;
  };

  const handleStepChange = (_stepIndex: number, scrollY: number) => {
    scrollViewRef.current?.scrollTo({
      y: Math.max(0, scrollY - 10),
      animated: true,
    });
  };

  const handleSpeakSummary = () => {
    let text = `Olá, ${studentFirstName || "Estudante"}! `;
    const totalTasks = activityTasks.length;
    if (pendingCount > 0) {
      text += `Você tem ${pendingCount} ${pendingCount === 1 ? "atividade pendente" : "atividades pendentes"} hoje. `;
      if (nextTask?.title) {
        text += `Sua atividade prioritária é: ${nextTask.title}. Clique no botão para executar a atividade.`;
      }
    } else if (totalTasks > 0) {
      text += `Parabéns! Todas as suas ${totalTasks} atividades do dia foram concluídas com sucesso.`;
    } else {
      text += `Você ainda não possui atividades cadastradas hoje. Clique em Ver Atividades para adicionar novas tarefas.`;
    }
    speakText(text);
  };

  return (
    <ScrollView
      ref={scrollViewRef}
      contentContainerStyle={[styles.container, { paddingBottom: 90 + bottomInset }]}
      showsVerticalScrollIndicator={false}
    >
      {/* 1. Welcome Banner */}
      <View
        style={[
          styles.bannerCard,
          { 
            backgroundColor: bannerBg, 
            borderColor: isHighContrast ? colors.border : "#333333", 
            borderWidth: isHighContrast ? 2 : 1 
          },
        ]}
        onLayout={(e: LayoutChangeEvent) => setBannerY(e.nativeEvent.layout.y)}
      >
        <View style={{ flex: 1 }}>
          {isSimplified && (
            <View style={[styles.simplifiedBadge, { backgroundColor: primaryAccentColor }]}>
              <Text style={[styles.simplifiedBadgeText, { color: colors.primaryContrast }]}>
                ✨ MODO SIMPLIFICADO ATIVO
              </Text>
            </View>
          )}

          <Text style={[styles.bannerGreeting, { color: isHighContrast ? colors.text : "#FFFFFF", fontSize: Math.round(22 * fontScale) }]}>
            {greeting.text}, {studentFirstName}! {greeting.icon}
          </Text>

          <Text style={[styles.bannerSub, { color: isHighContrast ? colors.textMuted : "#C6C6C6", fontSize: Math.round(14 * fontScale) }]}>
            {pendingCount > 0
              ? `Você tem ${pendingCount} ${pendingCount === 1 ? "atividade pendente" : "atividades pendentes"} hoje. Veja o que está planejado.`
              : "Você está em dia com todas as suas tarefas hoje!"}
          </Text>

          <View style={styles.bannerActionsRow}>
            <TouchableOpacity
              style={[styles.bannerBtn, { backgroundColor: bannerButtonBg, borderColor: isHighContrast ? colors.border : "#383838" }]}
              onPress={handleSpeakSummary}
            >
              <Volume2 size={Math.round(20 * fontScale)} color={primaryAccentColor} />
              <Text style={[styles.bannerBtnText, { color: isHighContrast ? colors.text : "#FFFFFF", fontSize: Math.round(15 * fontScale) }]}>
                Ouvir resumo por voz
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.bannerBtn, { backgroundColor: bannerButtonBg, borderColor: isHighContrast ? colors.border : "#383838" }]}
              onPress={() => setShowTour(true)}
            >
              <Compass size={Math.round(20 * fontScale)} color={primaryAccentColor} />
              <Text style={[styles.bannerBtnText, { color: isHighContrast ? colors.text : "#FFFFFF", fontSize: Math.round(15 * fontScale) }]}>
                Ver Tour Guiado
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* BookOpen Icon on Right */}
        <View style={styles.illustrationBox}>
          <BookOpen size={48} color={primaryAccentColor} />
        </View>
      </View>

      {/* 2. Priority Task Card */}
      <View
        style={[
          styles.priorityCard,
          { 
            backgroundColor: colors.surfaceSubtle, 
            borderColor: colors.border, 
            borderWidth: colors.borderWidth,
            borderLeftWidth: 4,
            borderLeftColor: primaryAccentColor,
          },
        ]}
        onLayout={(e: LayoutChangeEvent) => setPriorityY(e.nativeEvent.layout.y)}
      >
        <View style={styles.priorityTopRow}>
          {/* Target Icon Square */}
          <View style={[styles.targetIconBox, { backgroundColor: primaryAccentColor }]}>
            <Target size={24} color={colors.primaryContrast} />
          </View>

          <View style={{ flex: 1 }}>
            <View style={styles.priorityTagRow}>
              <Sparkles size={12} color={primaryAccentColor} />
              <Text style={[styles.priorityTagText, { color: primaryAccentColor }]}>
                PRÓXIMA ATIVIDADE PRIORITÁRIA
              </Text>
            </View>

            <Text style={[styles.priorityTitle, { color: colors.text, fontSize: Math.round(18 * fontScale) }]}>
              {nextTask ? nextTask.title : "Nenhuma atividade pendente"}
            </Text>

            <Text style={[styles.prioritySubText, { color: colors.textMuted, fontSize: Math.round(13 * fontScale) }]}>
              {nextTask
                ? `Vence ${nextTask.due} — Atividade prioritária.`
                : "Parabéns! Todas as suas tarefas foram concluídas."}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.actionBtnPrimary, { backgroundColor: primaryAccentColor }]}
          onPress={() => {
            if (nextTask) {
              toggleActivityTask(nextTask.id);
              triggerToast(`🎉 Atividade concluída!`);
            } else {
              onNavigateTab("tasks");
            }
          }}
        >
          <Text style={[styles.actionBtnText, { color: colors.primaryContrast, fontSize: Math.round(15 * fontScale) }]}>
            {nextTask ? "Executar Atividade Agora" : "Ver Todas as Atividades"}
          </Text>
          <ArrowRight size={18} color={colors.primaryContrast} />
        </TouchableOpacity>
      </View>

      {/* 3. Stats Row */}
      <View style={styles.statsRow}>
        {/* Stat Card 1: Concluídas hoje */}
        <View style={[styles.statBox, { backgroundColor: colors.card, borderColor: colors.border, borderWidth: colors.borderWidth }]}>
          <CheckCircle2 size={Math.round(26 * fontScale)} color={colors.success} style={{ marginBottom: 8 }} />
          <Text style={[styles.statNumber, { color: colors.success, fontSize: Math.round(36 * fontScale) }]}>
            {completedCount}
          </Text>
          <Text style={[styles.statLabel, { color: colors.textMuted, fontSize: Math.round(13 * fontScale) }]}>
            Concluídas hoje
          </Text>
        </View>

        {/* Stat Card 2: Pendentes */}
        <View style={[styles.statBox, { backgroundColor: colors.card, borderColor: colors.border, borderWidth: colors.borderWidth }]}>
          <Clock size={Math.round(26 * fontScale)} color={colors.text} style={{ marginBottom: 8 }} />
          <Text style={[styles.statNumber, { color: colors.text, fontSize: Math.round(36 * fontScale) }]}>
            {pendingCount}
          </Text>
          <Text style={[styles.statLabel, { color: colors.textMuted, fontSize: Math.round(13 * fontScale) }]}>
            Pendentes
          </Text>
        </View>

        {/* Stat Card 3: Dias seguidos */}
        <View style={[styles.statBox, { backgroundColor: colors.card, borderColor: colors.border, borderWidth: colors.borderWidth }]}>
          <Flame size={Math.round(26 * fontScale)} color={primaryAccentColor} style={{ marginBottom: 8 }} />
          <Text style={[styles.statNumber, { color: primaryAccentColor, fontSize: Math.round(36 * fontScale) }]}>
            7
          </Text>
          <Text style={[styles.statLabel, { color: colors.textMuted, fontSize: Math.round(13 * fontScale) }]}>
            Dias seguidos
          </Text>
        </View>
      </View>

      {/* 4. Quick Accessibility Preferences */}
      {!isSimplified && (
        <View
          style={[styles.cardContainer, { backgroundColor: colors.card, borderColor: colors.border, borderWidth: colors.borderWidth }]}
          onLayout={(e: LayoutChangeEvent) => setQuickSettingsY(e.nativeEvent.layout.y)}
        >
          {/* Header Row */}
          <View style={styles.cardTopRowMobile}>
            <View style={styles.cardTopTitleGroup}>
              <Settings size={20} color={primaryAccentColor} style={{ marginTop: 2 }} />
              <Text style={[styles.cardTopTitleText, { color: colors.text, fontSize: Math.round(16 * fontScale) }]}>
                Acessibilidade
              </Text>
            </View>
            <TouchableOpacity
              onPress={async () => {
                await updateSettings({ ...settings, fontScale: 1.0, contrastMode: "standard" });
                triggerToast("Todas as preferências foram resetadas para o padrão!");
              }}
              style={styles.resetBtnOutline}
            >
              <RotateCcw size={18} color="#DA1E28" />
              <Text style={[styles.resetBtnOutlineText, { fontSize: Math.round(15 * fontScale) }]}>
                Resetar Ajustes
              </Text>
            </TouchableOpacity>
          </View>

          {/* 3 Sub-Cards Grid Layout */}
          <View style={styles.subCardsGrid}>
            {/* Sub-Card 1: Tamanho do Texto */}
            <View style={[styles.subCardBox, { backgroundColor: colors.surfaceSubtle, borderColor: colors.border, borderWidth: colors.borderWidth }]}>
              <View style={styles.subCardHeaderRow}>
                <ZoomIn size={18} color={primaryAccentColor} />
                <Text style={[styles.subCardHeaderTitle, { color: colors.text, fontSize: Math.round(15 * fontScale) }]}>
                  Tamanho do Texto
                </Text>
              </View>
              <Text style={[styles.subCardHeaderSub, { color: colors.textMuted, fontSize: Math.round(12 * fontScale) }]}>
                Aumente ou diminua as letras da página
              </Text>

              <View style={[styles.innerBox, { backgroundColor: colors.card, borderColor: colors.border, borderWidth: colors.borderWidth }]}>
                <View style={[styles.scaleBadge, { backgroundColor: colors.surfaceSubtle, borderColor: colors.border, borderWidth: 1 }]}>
                  <Text style={[styles.scaleBadgeText, { color: colors.text, fontSize: Math.round(13 * fontScale) }]}>
                    Tamanho Atual: {Math.round(fontScale * 100)}%
                  </Text>
                </View>
                <TouchableOpacity
                  style={[styles.actionBtnSolid, { backgroundColor: primaryAccentColor }]}
                  onPress={() => updateSettings({ ...settings, fontScale: Math.min(1.5, fontScale + 0.1) })}
                >
                  <Text style={[styles.actionBtnSolidText, { color: colors.primaryContrast, fontSize: Math.round(14 * fontScale) }]}>
                    A+ Aumentar
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.actionBtnOutline, { borderColor: primaryAccentColor }]}
                  onPress={() => updateSettings({ ...settings, fontScale: Math.max(0.8, fontScale - 0.1) })}
                >
                  <Text style={[styles.actionBtnOutlineText, { color: primaryAccentColor, fontSize: Math.round(14 * fontScale) }]}>
                    A- Diminuir
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Sub-Card 2: Tema e Contraste */}
            <View style={[styles.subCardBox, { backgroundColor: colors.surfaceSubtle, borderColor: colors.border, borderWidth: colors.borderWidth }]}>
              <View style={styles.subCardHeaderRow}>
                <Eye size={18} color={primaryAccentColor} />
                <Text style={[styles.subCardHeaderTitle, { color: colors.text, fontSize: Math.round(15 * fontScale) }]}>
                  Tema e Contraste
                </Text>
              </View>
              <Text style={[styles.subCardHeaderSub, { color: colors.textMuted, fontSize: Math.round(12 * fontScale) }]}>
                Escolha a cor de fundo mais confortável
              </Text>

              <View style={[styles.innerBox, { backgroundColor: colors.card, borderColor: colors.border, borderWidth: colors.borderWidth }]}>
                <TouchableOpacity
                  style={[
                    styles.contrastBtn,
                    { 
                      backgroundColor: contrastMode === "standard" ? primaryAccentColor : colors.card, 
                      borderColor: contrastMode === "standard" ? primaryAccentColor : colors.border,
                    },
                  ]}
                  onPress={() => updateSettings({ ...settings, contrastMode: "standard" })}
                >
                  <Sun size={16} color={contrastMode === "standard" ? colors.primaryContrast : colors.text} />
                  <Text style={[styles.contrastBtnText, { color: contrastMode === "standard" ? colors.primaryContrast : colors.text, fontSize: Math.round(13 * fontScale) }]}>
                    Padrão (Branco)
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.contrastBtn,
                    { 
                      backgroundColor: contrastMode === "high" ? "#000000" : colors.card, 
                      borderColor: contrastMode === "high" ? "#FFFF00" : colors.border,
                      borderWidth: contrastMode === "high" ? 2 : 1,
                    },
                  ]}
                  onPress={() => updateSettings({ ...settings, contrastMode: "high" })}
                >
                  <Eye size={16} color={contrastMode === "high" ? "#FFFF00" : colors.text} />
                  <Text style={[styles.contrastBtnText, { color: contrastMode === "high" ? "#FFFF00" : colors.text, fontSize: Math.round(13 * fontScale) }]}>
                    Alto Contraste
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.contrastBtn,
                    { 
                      backgroundColor: contrastMode === "dark" ? "#161616" : colors.card, 
                      borderColor: contrastMode === "dark" ? "#161616" : colors.border,
                    },
                  ]}
                  onPress={() => updateSettings({ ...settings, contrastMode: "dark" })}
                >
                  <Moon size={16} color={contrastMode === "dark" ? "#F1C21B" : colors.text} />
                  <Text style={[styles.contrastBtnText, { color: contrastMode === "dark" ? "#F1C21B" : colors.text, fontSize: Math.round(13 * fontScale) }]}>
                    Modo Escuro
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Sub-Card 3: Proteções & Leitura */}
            <View style={[styles.subCardBox, { backgroundColor: colors.surfaceSubtle, borderColor: colors.border, borderWidth: colors.borderWidth }]}>
              <View style={styles.subCardHeaderRow}>
                <ShieldCheck size={18} color="#24A148" />
                <Text style={[styles.subCardHeaderTitle, { color: colors.text, fontSize: Math.round(15 * fontScale) }]}>
                  Proteções & Leitura
                </Text>
              </View>
              <Text style={[styles.subCardHeaderSub, { color: colors.textMuted, fontSize: Math.round(12 * fontScale) }]}>
                Confirmações antes de ações e áudio
              </Text>

              <View style={[styles.innerBox, { backgroundColor: colors.card, borderColor: colors.border, borderWidth: colors.borderWidth }]}>
                <View style={styles.switchRow}>
                  <Text style={[styles.switchLabel, { color: colors.text, fontSize: Math.round(13 * fontScale) }]}>
                    Confirmar Ações
                  </Text>
                  <Switch
                    value={confirmActions}
                    onValueChange={(val) => {
                      setConfirmActions(val);
                      triggerToast(val ? "Confirmação de ações ativada" : "Confirmação desativada");
                    }}
                    trackColor={{ false: "#E0E0E0", true: primaryAccentColor }}
                    thumbColor="#FFFFFF"
                  />
                </View>

                <View style={styles.dividerDashed} />

                <View style={styles.switchRow}>
                  <Text style={[styles.switchLabel, { color: colors.text, fontSize: Math.round(13 * fontScale) }]}>
                    Lembretes por Voz
                  </Text>
                  <Switch
                    value={voiceReminders}
                    onValueChange={(val) => {
                      setVoiceReminders(val);
                      triggerToast(val ? "Lembretes por voz ativados" : "Lembretes desativados");
                    }}
                    trackColor={{ false: "#E0E0E0", true: primaryAccentColor }}
                    thumbColor="#FFFFFF"
                  />
                </View>
              </View>
            </View>
          </View>
        </View>
      )}

      {/* 5. Modules Grid */}
      <View style={styles.modulesHeader}>
        <Text style={[styles.modulesHeaderTitle, { color: colors.text, fontSize: Math.round(20 * fontScale) }]}>
          Acesse os módulos
        </Text>
      </View>
      <View
        style={styles.modulesGrid}
        onLayout={(e: LayoutChangeEvent) => setModulesY(e.nativeEvent.layout.y)}
      >
        {/* Module 1: Personalização */}
        <TouchableOpacity
          style={[
            styles.moduleCard,
            { 
              backgroundColor: colors.card, 
              borderColor: colors.border, 
              borderWidth: colors.borderWidth, 
              borderTopWidth: 4, 
              borderTopColor: primaryAccentColor 
            },
          ]}
          onPress={() => onNavigateTab("profile")}
        >
          <Sliders size={36} color={primaryAccentColor} style={{ marginBottom: 8 }} />
          <Text style={[styles.moduleTitle, { color: colors.text, fontSize: Math.round(16 * fontScale) }]}>
            Personalização
          </Text>
          <Text style={[styles.moduleDesc, { color: colors.textMuted, fontSize: Math.round(12 * fontScale) }]}>
            Ajuste fontes, contrastes, espaçamento e muito mais. A plataforma se adapta a você.
          </Text>
          <View style={styles.moduleActionRow}>
            <Text style={[styles.moduleActionText, { color: primaryAccentColor, fontSize: Math.round(12 * fontScale) }]}>
              Acessar configurações
            </Text>
            <ArrowRight size={14} color={primaryAccentColor} />
          </View>
        </TouchableOpacity>

        {/* Module 2: Minhas Atividades */}
        <TouchableOpacity
          style={[
            styles.moduleCard,
            { 
              backgroundColor: colors.card, 
              borderColor: colors.border, 
              borderWidth: colors.borderWidth, 
              borderTopWidth: 4, 
              borderTopColor: "#24A148" 
            },
          ]}
          onPress={() => onNavigateTab("tasks")}
        >
          <BookCheck size={36} color="#24A148" style={{ marginBottom: 8 }} />
          <Text style={[styles.moduleTitle, { color: colors.text, fontSize: Math.round(16 * fontScale) }]}>
            Minhas Atividades
          </Text>
          <Text style={[styles.moduleDesc, { color: colors.textMuted, fontSize: Math.round(12 * fontScale) }]}>
            Acompanhe suas leituras, trabalhos acadêmicos e tarefas diárias de forma simples.
          </Text>
          <View style={styles.moduleActionRow}>
            <Text style={[styles.moduleActionText, { color: primaryAccentColor, fontSize: Math.round(12 * fontScale) }]}>
              Ver atividades
            </Text>
            <ArrowRight size={14} color={primaryAccentColor} />
          </View>
        </TouchableOpacity>

        {/* Module 3: Meu Perfil */}
        <TouchableOpacity
          style={[
            styles.moduleCard,
            { 
              backgroundColor: colors.card, 
              borderColor: colors.border, 
              borderWidth: colors.borderWidth, 
              borderTopWidth: 4, 
              borderTopColor: "#8A3FFC" 
            },
          ]}
          onPress={() => onNavigateTab("profile")}
        >
          <User size={36} color="#8A3FFC" style={{ marginBottom: 8 }} />
          <Text style={[styles.moduleTitle, { color: colors.text, fontSize: Math.round(16 * fontScale) }]}>
            Meu Perfil
          </Text>
          <Text style={[styles.moduleDesc, { color: colors.textMuted, fontSize: Math.round(12 * fontScale) }]}>
            Gerencie seus dados acadêmicos, contato de apoio e preferências da conta.
          </Text>
          <View style={styles.moduleActionRow}>
            <Text style={[styles.moduleActionText, { color: primaryAccentColor, fontSize: Math.round(12 * fontScale) }]}>
              Editar perfil
            </Text>
            <ArrowRight size={14} color={primaryAccentColor} />
          </View>
        </TouchableOpacity>

        {/* Module 4: Central de Ajuda */}
        <TouchableOpacity
          style={[
            styles.moduleCard,
            { 
              backgroundColor: colors.card, 
              borderColor: colors.border, 
              borderWidth: colors.borderWidth, 
              borderTopWidth: 4, 
              borderTopColor: "#007D79" 
            },
          ]}
          onPress={onOpenHelpModal}
        >
          <HelpCircle size={36} color="#007D79" style={{ marginBottom: 8 }} />
          <Text style={[styles.moduleTitle, { color: colors.text, fontSize: Math.round(16 * fontScale) }]}>
            Central de Ajuda
          </Text>
          <Text style={[styles.moduleDesc, { color: colors.textMuted, fontSize: Math.round(12 * fontScale) }]}>
            Fale com o suporte telefônico gratuito 0800 ou veja tutoriais passo a passo.
          </Text>
          <View style={styles.moduleActionRow}>
            <Text style={[styles.moduleActionText, { color: primaryAccentColor, fontSize: Math.round(12 * fontScale) }]}>
              Obter ajuda
            </Text>
            <ArrowRight size={14} color={primaryAccentColor} />
          </View>
        </TouchableOpacity>
      </View>

      {/* 6. Recent Tasks List (Replicating Web RecentTasksList.tsx 1:1 Verbatim & Outer Box & Gold Badge) */}
      <View
        style={[styles.recentOuterBox, { backgroundColor: colors.surfaceSubtle, borderColor: colors.border, borderWidth: colors.borderWidth }]}
        onLayout={(e: LayoutChangeEvent) => setRecentTasksY(e.nativeEvent.layout.y)}
      >
        {/* Header Row with Title and Action Button */}
        <View style={styles.recentHeaderRow}>
          <Text style={[styles.recentHeaderTitle, { color: colors.text, fontSize: Math.round(18 * fontScale) }]}>
            Minhas Atividades Recentes ({activityTasks.length})
          </Text>
          <TouchableOpacity
            style={[styles.addVerTodasBtn, { backgroundColor: colors.card, borderColor: colors.border }]}
            onPress={() => onNavigateTab("tasks")}
          >
            <Plus size={16} color={primaryAccentColor} />
            <Text style={[styles.addVerTodasBtnText, { color: primaryAccentColor, fontSize: Math.round(14 * fontScale) }]}>
              Adicionar / Ver Todas
            </Text>
          </TouchableOpacity>
        </View>

        {/* Inner Card Container */}
        <View style={[styles.recentInnerCard, { backgroundColor: colors.card, borderColor: colors.border, borderWidth: colors.borderWidth }]}>
          {activityTasks.map((t, idx) => (
            <View
              key={t.id}
              style={[
                styles.recentTaskRow,
                { borderBottomWidth: idx === activityTasks.length - 1 ? 0 : 1, borderBottomColor: colors.border },
              ]}
            >
              {/* Top Bar: Audio Speaker and Category Icon on Left, Status Badge on Right */}
              <View style={styles.recentTaskHeaderBar}>
                <View style={styles.recentTaskIconGroup}>
                  {/* Speaker Voice Circular Button */}
                  <TouchableOpacity
                    style={[styles.speakerCircleBtn, { backgroundColor: colors.card, borderColor: colors.border }]}
                    onPress={() => speakText(`Atividade: ${t.title}. Categoria: ${t.category || "Geral"}. Prazo: ${t.due}. Status: ${t.done ? "Concluída" : "Pendente"}.`)}
                  >
                    <Volume2 size={Math.min(24, Math.round(18 * fontScale))} color={primaryAccentColor} />
                  </TouchableOpacity>

                  {/* Activity File Icon Box */}
                  <View style={[styles.fileIconBox, { backgroundColor: colors.surfaceSubtle, borderColor: colors.border }]}>
                    {getActivityIcon(t.category)}
                  </View>
                </View>

                {/* Status Badge */}
                <View
                  style={[
                    styles.webStatusBadge,
                    { backgroundColor: t.done ? colors.success : (isHighContrast ? colors.primary : "#F1C21B") },
                  ]}
                >
                  <Text style={[styles.webStatusBadgeText, { color: t.done ? "#FFFFFF" : "#161616", fontSize: Math.round(13 * fontScale) }]}>
                    {t.done ? "✓ Feito" : "⏳ Pendente"}
                  </Text>
                </View>
              </View>

              {/* Bottom Main Content Area: 100% width for clean multi-line word wrapping */}
              <View style={styles.recentTaskContentBox}>
                <Text style={[styles.recentTaskTitle, { color: colors.text, fontSize: Math.round(16 * fontScale), textDecorationLine: t.done ? "line-through" : "none" }]}>
                  {t.title}
                </Text>
                <Text style={[styles.recentTaskDue, { color: colors.textMuted, fontSize: Math.round(13 * fontScale) }]}>
                  {t.done ? `Concluído (${t.due})` : `Até ${t.due}`}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </View>

      {/* Spotlight Tour Component */}
      <SpotlightCutoutTour
        visible={showTour}
        theme={theme}
        steps={tourSteps}
        onClose={() => setShowTour(false)}
        speakText={speakText}
        onStepChange={handleStepChange}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 16,
  },
  bannerCard: {
    padding: 20,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  simplifiedBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    alignSelf: "flex-start",
    marginBottom: 6,
  },
  simplifiedBadgeText: {
    fontSize: 10,
    fontWeight: "bold",
  },
  bannerGreeting: {
    fontWeight: "300",
    lineHeight: 28,
  },
  bannerSub: {
    marginTop: 4,
    lineHeight: 20,
  },
  bannerActionsRow: {
    flexDirection: "column",
    gap: 12,
    marginTop: 16,
    width: "100%",
  },
  bannerBtn: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    minHeight: 56,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 10,
    borderWidth: 1.5,
    flexWrap: "wrap",
  },
  bannerBtnText: {
    fontWeight: "bold",
    textAlign: "center",
    flexShrink: 1,
  },
  illustrationBox: {
    paddingLeft: 8,
  },
  priorityCard: {
    padding: 16,
    borderRadius: 10,
    gap: 12,
  },
  priorityTopRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  targetIconBox: {
    width: 48,
    height: 48,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  priorityTagRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginBottom: 2,
  },
  priorityTagText: {
    fontSize: 11,
    fontWeight: "bold",
    letterSpacing: 0.5,
  },
  priorityTitle: {
    fontWeight: "normal",
  },
  prioritySubText: {
    marginTop: 2,
  },
  actionBtnPrimary: {
    minHeight: 60,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingVertical: 16,
    borderRadius: 10,
    marginTop: 6,
  },
  actionBtnText: {
    fontWeight: "bold",
  },
  statsRow: {
    flexDirection: "row",
    gap: 10,
  },
  statBox: {
    flex: 1,
    padding: 16,
    borderRadius: 10,
    alignItems: "flex-start",
    gap: 4,
  },
  statNumber: {
    fontWeight: "300",
    lineHeight: 38,
  },
  statLabel: {
    marginTop: 2,
  },
  cardContainer: {
    padding: 16,
    borderRadius: 12,
    gap: 14,
  },
  cardTopRowMobile: {
    flexDirection: "column",
    alignItems: "stretch",
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
    gap: 14,
  },
  cardTopTitleGroup: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
  },
  cardTopTitleText: {
    fontWeight: "bold",
    lineHeight: 22,
  },
  resetBtnOutline: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    minHeight: 52,
    borderWidth: 1.5,
    borderColor: "#DA1E28",
    paddingHorizontal: 14,
    paddingVertical: 14,
    borderRadius: 8,
    flexWrap: "wrap",
  },
  resetBtnOutlineText: {
    color: "#DA1E28",
    fontWeight: "bold",
    textAlign: "center",
    flexShrink: 1,
  },
  subCardsGrid: {
    gap: 12,
  },
  subCardBox: {
    padding: 14,
    borderRadius: 8,
    gap: 8,
  },
  subCardHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  subCardHeaderTitle: {
    fontWeight: "bold",
  },
  subCardHeaderSub: {
    marginTop: -4,
    marginBottom: 4,
  },
  innerBox: {
    padding: 10,
    borderRadius: 6,
    gap: 8,
  },
  scaleBadge: {
    padding: 8,
    borderRadius: 4,
    alignItems: "center",
  },
  scaleBadgeText: {
    fontWeight: "bold",
  },
  actionBtnSolid: {
    minHeight: 56,
    paddingVertical: 14,
    paddingHorizontal: 12,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    flexWrap: "wrap",
  },
  actionBtnSolidText: {
    fontWeight: "bold",
    textAlign: "center",
    flexShrink: 1,
  },
  actionBtnOutline: {
    minHeight: 56,
    paddingVertical: 14,
    paddingHorizontal: 12,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    borderWidth: 1.5,
    flexWrap: "wrap",
  },
  actionBtnOutlineText: {
    fontWeight: "bold",
    textAlign: "center",
    flexShrink: 1,
  },
  contrastBtn: {
    minHeight: 56,
    paddingVertical: 14,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderRadius: 8,
    borderWidth: 1.5,
    flexWrap: "wrap",
  },
  contrastBtnText: {
    fontWeight: "bold",
    textAlign: "center",
    flexShrink: 1,
  },
  switchRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 4,
  },
  switchLabel: {
    fontWeight: "500",
  },
  dividerDashed: {
    height: 1,
    backgroundColor: "#E0E0E0",
    marginVertical: 2,
  },
  modulesHeader: {
    marginTop: 6,
  },
  modulesHeaderTitle: {
    fontWeight: "bold",
  },
  modulesGrid: {
    gap: 12,
  },
  moduleCard: {
    width: "100%",
    padding: 18,
    borderRadius: 10,
    gap: 6,
  },
  moduleTitle: {
    fontWeight: "normal",
  },
  moduleDesc: {
    lineHeight: 18,
    marginBottom: 8,
  },
  moduleActionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 4,
  },
  moduleActionText: {
    fontWeight: "bold",
  },
  recentOuterBox: {
    padding: 16,
    borderRadius: 12,
    gap: 12,
    marginTop: 6,
  },
  recentHeaderRow: {
    flexDirection: "column",
    alignItems: "stretch",
    gap: 12,
  },
  recentHeaderTitle: {
    fontWeight: "600",
    flexShrink: 1,
    flexWrap: "wrap",
  },
  addVerTodasBtn: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    minHeight: 56,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 10,
    borderWidth: 1.5,
    flexWrap: "wrap",
  },
  addVerTodasBtnText: {
    fontWeight: "bold",
    textAlign: "center",
    flexShrink: 1,
  },
  recentInnerCard: {
    padding: 8,
    borderRadius: 10,
  },
  recentTaskRow: {
    flexDirection: "column",
    paddingVertical: 16,
    paddingHorizontal: 12,
    gap: 14,
  },
  recentTaskHeaderBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
  },
  recentTaskIconGroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  speakerCircleBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
  },
  fileIconBox: {
    width: 44,
    height: 44,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  recentTaskContentBox: {
    width: "100%",
    gap: 6,
  },
  recentTaskTitle: {
    fontWeight: "600",
    flexShrink: 1,
    flexWrap: "wrap",
    width: "100%",
  },
  recentTaskDue: {
    flexShrink: 1,
    flexWrap: "wrap",
    width: "100%",
  },
  webStatusBadge: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 6,
  },
  webStatusBadgeText: {
    fontWeight: "bold",
  },
});
