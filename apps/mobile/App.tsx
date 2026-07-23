import React, { useState } from "react";
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  TouchableOpacity, 
  TextInput, 
  Alert, 
  Vibration,
  SafeAreaView
} from "react-native";
import { StatusBar } from "expo-status-bar";
import * as Haptics from "expo-haptics";
import { AppProvider, useApp } from "./src/context/AppContext";
import { tokens } from "@seniorease/core";
import { 
  Video, 
  Play, 
  FileText, 
  ArrowLeft, 
  AlertTriangle
} from "lucide-react-native";

// Lesson definitions matching the web portal layout
interface Lesson {
  id: string;
  title: string;
  duration: string;
  description: string;
}

const lessonsList: Lesson[] = [
  {
    id: "1",
    title: "Aula 1: Introdução ao E-Learning",
    duration: "10 min",
    description: "Conceitos básicos sobre o uso de computadores e a internet para estudos."
  },
  {
    id: "2",
    title: "Aula 2: Primeiros Passos na Plataforma",
    duration: "12 min",
    description: "Como navegar pelas páginas do SeniorEase, alternar abas e encontrar informações."
  },
  {
    id: "3",
    title: "Aula 3: Configurando seu Navegador",
    duration: "15 min",
    description: "Dicas úteis de como aproximar o zoom e ajustar os contrastes do seu próprio navegador."
  },
  {
    id: "4",
    title: "Aula 4: História da Arte Moderna",
    duration: "25 min",
    description: "Nesta aula discutiremos o Impressionismo e o Expressionismo como pontos de partida para a modernidade."
  },
  {
    id: "5",
    title: "Aula 5: Técnicas de Leitura Acadêmica",
    duration: "20 min",
    description: "Métodos de leitura ativa e tomada de anotações eficientes para a terceira idade."
  }
];

function MainApp() {
  const { 
    settings, 
    updateSettings, 
    completedLessons,
    completeLesson,
    currentLessonId,
    setCurrentLessonId
  } = useApp();

  const [activeTab, setActiveTab] = useState<"dashboard" | "classes" | "settings" | "help">("dashboard");

  // Lesson states
  const [activeLesson, setActiveLesson] = useState<Lesson>(
    lessonsList.find(l => l.id === currentLessonId) || lessonsList[3]
  );
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  // Chatbot states
  const [chatMessages, setChatMessages] = useState<Array<{ text: string, sender: 'bot' | 'user' }>>([
    { text: "Olá! Sou seu assistente digital. Como posso facilitar seu dia hoje?", sender: 'bot' },
    { text: "Escolha uma das opções abaixo para começarmos:", sender: 'bot' }
  ]);

  // Resolve dynamic colors based on settings & DESIGN.md
  const isHighContrast = settings.contrastMode === "high";
  const currentColors = isHighContrast ? tokens.colors.highContrast : tokens.colors.light;
  
  // Resolve font sizes
  const fontSizeTheme = tokens.fontSizes[settings.fontSizeScale];
  const parseSize = (sizeStr: string) => parseInt(sizeStr.replace("px", ""), 10);

  // Resolve spacing & touch target
  const spacingTheme = tokens.spacing[settings.spacingScale];
  const touchHeight = parseSize(spacingTheme.buttonHeight);
  const paddingSize = settings.spacingScale === "large" ? 24 : 16;
  const gapSize = settings.spacingScale === "large" ? 16 : 12;

  // Haptic feedback trigger helper
  const triggerHaptic = (type: "success" | "warning" | "selection") => {
    if (settings.feedbackVisual) {
      if (type === "success") {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } else if (type === "warning") {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      } else {
        Haptics.selectionAsync();
      }
    } else {
      Vibration.vibrate(100);
    }
  };

  const handleFontChange = (scale: "standard" | "medium" | "large") => {
    updateSettings({ ...settings, fontSizeScale: scale });
    triggerHaptic("selection");
  };

  const handleSpacingChange = (scale: "standard" | "large") => {
    updateSettings({ ...settings, spacingScale: scale });
    triggerHaptic("selection");
  };

  const handleFeedbackChange = (val: boolean) => {
    updateSettings({ ...settings, feedbackVisual: val });
    triggerHaptic("selection");
  };

  const handleConfirmationChange = (val: boolean) => {
    updateSettings({ ...settings, criticalConfirmation: val });
    triggerHaptic("selection");
  };

  const handleLessonClick = (lesson: Lesson) => {
    setActiveLesson(lesson);
    setCurrentLessonId(lesson.id);
    setIsVideoPlaying(false);
    triggerHaptic("selection");
  };

  const handleCompleteLessonAction = () => {
    completeLesson(activeLesson.id);
    triggerHaptic("success");
    Alert.alert("Parabéns! 🎉", "Aula marcada como concluída!");
  };

  const handleEmergencyHelp = () => {
    triggerHaptic("warning");
    Alert.alert(
      "Ajuda de Emergência",
      "Deseja ligar agora para o plantão de suporte acadêmico FIAP Inclusive?",
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Ligar por Telefone", 
          onPress: () => {
            Alert.alert("Chamando...", "Conectando ao número 0800-FIAP-INCLUSIVE.");
          } 
        }
      ]
    );
  };

  const addChatMessage = (text: string, sender: 'bot' | 'user') => {
    const updated = [...chatMessages, { text, sender }];
    setChatMessages(updated);
    triggerHaptic("selection");

    if (sender === 'user') {
      setTimeout(() => {
        let reply = "Entendi. Vou encaminhar sua dúvida para nossa central ou você pode usar o botão 'Ligar para assistente'.";
        if (text.includes("Dúvida sobre a aula")) {
          reply = "Qual o tema da aula que você tem dúvidas? Caso prefira, você pode acessar a aba de anotações no portal web.";
        } else if (text.includes("Dificuldade para ler")) {
          reply = "Você pode ir na aba 'Ajustes' para aumentar o tamanho do texto ou ativar o Alto Contraste.";
        }
        setChatMessages(prev => [...prev, { text: reply, sender: 'bot' }]);
        triggerHaptic("success");
      }, 800);
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: currentColors.background }]}>
      <StatusBar style={isHighContrast ? "light" : "dark"} />

      {/* HEADER */}
      <View style={[styles.header, { borderBottomColor: currentColors.primary, padding: paddingSize }]}>
        <View style={styles.headerTitleRow}>
          <View style={[styles.logoBadge, { backgroundColor: currentColors.primary }]}>
            <Text style={styles.logoText}>S</Text>
          </View>
          <View>
            <Text style={[styles.headerEyebrow, { color: currentColors.text }]}>FIAP INCLUSIVE</Text>
            <Text style={[styles.headerTitle, { color: currentColors.text, fontSize: parseSize(fontSizeTheme.xl) }]}>
              SeniorEase
            </Text>
          </View>
        </View>

        <TouchableOpacity 
          style={[styles.contrastBtn, { backgroundColor: isHighContrast ? "#FFFF00" : "#FFFFFF", borderColor: currentColors.primary }]} 
          onPress={() => {
            updateSettings({
              ...settings,
              contrastMode: isHighContrast ? "standard" : "high"
            });
            triggerHaptic("selection");
          }}
        >
          <Text style={{ color: "#000", fontWeight: "bold", fontSize: 13 }}>
            {isHighContrast ? "Padrão" : "Contraste"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* EMERGENCY BUTTON BAR */}
      <View style={{ paddingHorizontal: paddingSize, paddingTop: 8 }}>
        <TouchableOpacity 
          onPress={handleEmergencyHelp} 
          style={[styles.emergencyBtn, { height: touchHeight }]}
        >
          <AlertTriangle size={20} color="#FFF" />
          <Text style={styles.emergencyBtnText}>Ajuda de Emergência</Text>
        </TouchableOpacity>
      </View>

      {/* TABS NAVIGATION */}
      <View style={styles.tabContainer}>
        <View style={[styles.tabsRow, { backgroundColor: isHighContrast ? "#000" : "#F4F3EC", borderColor: currentColors.border }]}>
          <TouchableOpacity
            onPress={() => { setActiveTab("dashboard"); setIsVideoPlaying(false); triggerHaptic("selection"); }}
            style={[
              styles.tabItem, 
              { height: touchHeight - 8 },
              activeTab === "dashboard" && [styles.tabItemActive, { backgroundColor: currentColors.primary }]
            ]}
          >
            <Text style={[styles.tabLabel, { 
              color: activeTab === "dashboard" ? currentColors.primaryContrast : "#888",
              fontSize: parseSize(fontSizeTheme.sm)
            }]}>Início</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => { setActiveTab("classes"); setIsVideoPlaying(false); triggerHaptic("selection"); }}
            style={[
              styles.tabItem, 
              { height: touchHeight - 8 },
              activeTab === "classes" && [styles.tabItemActive, { backgroundColor: currentColors.primary }]
            ]}
          >
            <Text style={[styles.tabLabel, { 
              color: activeTab === "classes" ? currentColors.primaryContrast : "#888",
              fontSize: parseSize(fontSizeTheme.sm)
            }]}>Aulas</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => { setActiveTab("settings"); setIsVideoPlaying(false); triggerHaptic("selection"); }}
            style={[
              styles.tabItem, 
              { height: touchHeight - 8 },
              activeTab === "settings" && [styles.tabItemActive, { backgroundColor: currentColors.primary }]
            ]}
          >
            <Text style={[styles.tabLabel, { 
              color: activeTab === "settings" ? currentColors.primaryContrast : "#888",
              fontSize: parseSize(fontSizeTheme.sm)
            }]}>Ajustes</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => { setActiveTab("help"); setIsVideoPlaying(false); triggerHaptic("selection"); }}
            style={[
              styles.tabItem, 
              { height: touchHeight - 8 },
              activeTab === "help" && [styles.tabItemActive, { backgroundColor: currentColors.primary }]
            ]}
          >
            <Text style={[styles.tabLabel, { 
              color: activeTab === "help" ? currentColors.primaryContrast : "#888",
              fontSize: parseSize(fontSizeTheme.sm)
            }]}>Ajuda</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* CONTENT SCROLL */}
      <ScrollView contentContainerStyle={{ padding: paddingSize, paddingBottom: 120 }} style={styles.scrollContainer}>
        
        {/* TAB 1: INÍCIO */}
        {activeTab === "dashboard" && (
          <View style={{ gap: gapSize }}>
            <Text style={[styles.welcomeTitle, { color: currentColors.text, fontSize: parseSize(fontSizeTheme.xl) }]}>
              Olá, João!
            </Text>
            <Text style={[styles.welcomeSubtitle, { color: currentColors.text, fontSize: parseSize(fontSizeTheme.base) }]}>
              O que vamos fazer hoje? Seu portal está pronto.
            </Text>

            {/* Bento Quick Actions */}
            <TouchableOpacity 
              onPress={() => { setActiveTab("classes"); triggerHaptic("selection"); }}
              style={[styles.bentoBtn, { backgroundColor: currentColors.surfaceContainerLow, borderColor: currentColors.primary }]}
            >
              <Text style={[styles.bentoTitle, { color: currentColors.text, fontSize: parseSize(fontSizeTheme.lg) }]}>
                🎓 Ver Minhas Aulas
              </Text>
              <Text style={{ color: currentColors.text, opacity: 0.8 }}>Acesse as aulas e conteúdos acadêmicos</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              onPress={() => {
                Alert.alert("Progresso", `Você concluiu ${completedLessons.length} de ${lessonsList.length} aulas.`);
                triggerHaptic("selection");
              }}
              style={[styles.bentoBtn, { backgroundColor: currentColors.surfaceContainerLow, borderColor: currentColors.primary }]}
            >
              <Text style={[styles.bentoTitle, { color: currentColors.text, fontSize: parseSize(fontSizeTheme.lg) }]}>
                📈 Ver Meu Progresso
              </Text>
              <Text style={{ color: currentColors.text, opacity: 0.8 }}>Acompanhe suas notas e conquistas</Text>
            </TouchableOpacity>

            {/* Reminders section - Styled with Mint and Amber */}
            <Text style={[styles.sectionTitle, { color: currentColors.text, fontSize: parseSize(fontSizeTheme.lg), marginTop: 12 }]}>
              🔔 Lembretes importantes
            </Text>

            {/* Mint Block Container */}
            <View style={[styles.card, { backgroundColor: "#b8f1b9", borderColor: isHighContrast ? "#FFF" : "transparent" }]}>
              <Text style={{ color: "#000", fontWeight: "bold" }}>AULA AO VIVO EM 15 MINUTOS</Text>
              <Text style={{ color: "#000", fontSize: 18, fontWeight: "bold", marginVertical: 4 }}>História da Arte Moderna</Text>
              <TouchableOpacity 
                onPress={() => {
                  Alert.alert("Sucesso", "Você entrou na sala de aula ao vivo.");
                  triggerHaptic("success");
                }}
                style={[styles.primaryActionBtn, { height: touchHeight, backgroundColor: currentColors.primary, marginTop: 8 }]}
              >
                <Text style={[styles.primaryActionBtnText, { color: currentColors.primaryContrast }]}>Entrar Agora</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* TAB 2: AULAS */}
        {activeTab === "classes" && (
          <View style={{ gap: gapSize }}>
            {/* Active video player mock */}
            <View style={[styles.card, { backgroundColor: "#000", padding: 12, overflow: "hidden", minHeight: 180, justifyContent: "center", alignItems: "center" }]}>
              {!isVideoPlaying ? (
                <View style={{ alignItems: "center", padding: 16 }}>
                  <TouchableOpacity 
                    onPress={() => { setIsVideoPlaying(true); triggerHaptic("selection"); }}
                    style={{ width: 60, height: 60, borderRadius: 30, backgroundColor: "#36693d", justifyContent: "center", alignItems: "center", marginBottom: 8 }}
                  >
                    <Play size={32} color="#FFF" />
                  </TouchableOpacity>
                  <Text style={{ color: "#FFF", fontWeight: "bold", fontSize: 16, textAlign: "center" }}>{activeLesson.title}</Text>
                </View>
              ) : (
                <View style={{ padding: 20, alignItems: "center" }}>
                  <Video size={40} color="#36693d" />
                  <Text style={{ color: "#FFF", marginVertical: 8 }}>Reproduzindo vídeo...</Text>
                  <TouchableOpacity onPress={() => setIsVideoPlaying(false)} style={{ backgroundColor: "#FFF", paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6 }}>
                    <Text style={{ color: "#000", fontWeight: "bold" }}>Pausar</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>

            {/* Lesson description */}
            <View style={[styles.card, { backgroundColor: "#f3f3f3", borderColor: isHighContrast ? "#FFF" : "transparent" }]}>
              <Text style={{ color: "#000", fontWeight: "bold", fontSize: 18 }}>{activeLesson.title}</Text>
              <Text style={{ color: "#000", opacity: 0.8, marginVertical: 8 }}>{activeLesson.description}</Text>
              <TouchableOpacity
                onPress={handleCompleteLessonAction}
                disabled={completedLessons.includes(activeLesson.id)}
                style={[styles.primaryActionBtn, { height: touchHeight, backgroundColor: "#36693d", opacity: completedLessons.includes(activeLesson.id) ? 0.6 : 1 }]}
              >
                <Text style={{ color: "#FFF", fontWeight: "bold" }}>
                  {completedLessons.includes(activeLesson.id) ? "✓ Aula Concluída" : "Marcar como Concluída"}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Lesson navigation list */}
            <Text style={[styles.sectionTitle, { color: currentColors.text, fontSize: parseSize(fontSizeTheme.base), marginTop: 12 }]}>
              Lista de Aulas:
            </Text>

            {lessonsList.map(lesson => (
              <TouchableOpacity
                key={lesson.id}
                onPress={() => handleLessonClick(lesson)}
                style={[
                  styles.lessonItemRow,
                  { borderColor: activeLesson.id === lesson.id ? "#36693d" : currentColors.border },
                  activeLesson.id === lesson.id && { backgroundColor: "rgba(54, 105, 61, 0.1)" }
                ]}
              >
                <View style={{ flex: 1 }}>
                  <Text style={{ fontWeight: "bold", color: currentColors.text }}>{lesson.title}</Text>
                  <Text style={{ fontSize: 12, color: currentColors.text, opacity: 0.6 }}>{lesson.duration}</Text>
                </View>
                <Text style={{ fontSize: 18 }}>
                  {completedLessons.includes(lesson.id) ? "✅" : "○"}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* TAB 3: AJUSTES */}
        {activeTab === "settings" && (
          <View style={[styles.card, { backgroundColor: "#eeeeee", borderColor: isHighContrast ? "#FFF" : "transparent", gap: 20 }]}>
            <Text style={[styles.welcomeTitle, { color: "#000", fontSize: parseSize(fontSizeTheme.lg) }]}>
              Painel de Acessibilidade
            </Text>

            {/* Font scaling */}
            <View style={styles.settingsSection}>
              <Text style={{ color: "#000", fontWeight: "bold", fontSize: 16 }}>Tamanho da Letra</Text>
              <View style={{ flexDirection: "row", gap: 8 }}>
                {(["standard", "medium", "large"] as const).map(scale => (
                  <TouchableOpacity
                    key={scale}
                    onPress={() => handleFontChange(scale)}
                    style={[
                      styles.secondaryActionBtn,
                      { height: touchHeight, flex: 1 },
                      settings.fontSizeScale === scale && { backgroundColor: currentColors.primary }
                    ]}
                  >
                    <Text style={{ 
                      color: settings.fontSizeScale === scale ? currentColors.primaryContrast : "#000", 
                      fontWeight: "bold"
                    }}>
                      {scale === "standard" ? "Normal" : scale === "medium" ? "Grande" : "M. Grande"}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Spacing scaling */}
            <View style={styles.settingsSection}>
              <Text style={{ color: "#000", fontWeight: "bold", fontSize: 16 }}>Espaçamento dos Botões</Text>
              <View style={{ flexDirection: "row", gap: 8 }}>
                {(["standard", "large"] as const).map(scale => (
                  <TouchableOpacity
                    key={scale}
                    onPress={() => handleSpacingChange(scale)}
                    style={[
                      styles.secondaryActionBtn,
                      { height: touchHeight, flex: 1 },
                      settings.spacingScale === scale && { backgroundColor: currentColors.primary }
                    ]}
                  >
                    <Text style={{ 
                      color: settings.spacingScale === scale ? currentColors.primaryContrast : "#000", 
                      fontWeight: "bold"
                    }}>
                      {scale === "standard" ? "Padrão" : "Botões Maiores"}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Checklist options */}
            <View style={{ gap: 12, backgroundColor: "rgba(255,255,255,0.4)", padding: 12, borderRadius: 12 }}>
              <TouchableOpacity
                onPress={() => handleFeedbackChange(!settings.feedbackVisual)}
                style={styles.toggleRow}
              >
                <Text style={{ fontSize: 16, color: "#000", fontWeight: "600" }}>
                  {settings.feedbackVisual ? "☑" : "☐"} Alertas e Haptics
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => handleConfirmationChange(!settings.criticalConfirmation)}
                style={styles.toggleRow}
              >
                <Text style={{ fontSize: 16, color: "#000", fontWeight: "600" }}>
                  {settings.criticalConfirmation ? "☑" : "☐"} Confirmações Extras
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* TAB 4: AJUDA */}
        {activeTab === "help" && (
          <View style={{ gap: gapSize }}>
            {/* Ligar imediato */}
            <View style={[styles.card, { backgroundColor: "#041627", borderBottomWidth: 8, borderBottomColor: "#36693d" }]}>
              <Text style={{ color: "#FFF", fontSize: 20, fontWeight: "bold" }}>Precisa de ajuda humana?</Text>
              <Text style={{ color: "#FFF", opacity: 0.8, marginVertical: 8 }}>Nossa equipe de apoio atende por telefone grátis.</Text>
              <TouchableOpacity 
                onPress={() => alert("Ligando para suporte...")}
                style={[styles.primaryActionBtn, { height: touchHeight, backgroundColor: "#36693d" }]}
              >
                <Text style={{ color: "#FFF", fontWeight: "bold" }}>Ligar para Assistente</Text>
              </TouchableOpacity>
            </View>

            {/* Chatbot widget mockup */}
            <View style={[styles.card, { backgroundColor: currentColors.surface, borderColor: currentColors.primary }]}>
              <Text style={{ color: currentColors.text, fontWeight: "bold", fontSize: 18, borderBottomWidth: 1, borderBottomColor: "#DDD", paddingBottom: 8, marginBottom: 8 }}>🤖 Suporte Acadêmico</Text>
              
              <ScrollView style={{ height: 180, marginBottom: 8 }}>
                {chatMessages.map((msg, idx) => (
                  <View 
                    key={idx} 
                    style={{ 
                      padding: 10, 
                      borderRadius: 8, 
                      marginVertical: 4,
                      backgroundColor: msg.sender === "bot" ? "#E2E8F0" : "#b8f1b9",
                      alignSelf: msg.sender === "bot" ? "flex-start" : "flex-end"
                    }}
                  >
                    <Text style={{ color: "#000" }}>{msg.text}</Text>
                  </View>
                ))}
              </ScrollView>

              <View style={{ gap: 6 }}>
                <TouchableOpacity onPress={() => addChatMessage("Dúvida sobre a aula", "user")} style={styles.chatOptionBtn}>
                  <Text style={{ color: "#000", fontWeight: "bold" }}>Dúvida sobre a aula</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => addChatMessage("Dificuldade para ler", "user")} style={styles.chatOptionBtn}>
                  <Text style={{ color: "#000", fontWeight: "bold" }}>Dificuldade para ler</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainApp />
    </AppProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scrollContainer: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 2,
    backgroundColor: "#fff",
  },
  headerTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8
  },
  logoBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center"
  },
  logoText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18
  },
  headerEyebrow: {
    fontFamily: "monospace",
    fontSize: 10,
    letterSpacing: 1,
    fontWeight: "bold",
    opacity: 0.5,
    marginBottom: -2
  },
  headerTitle: {
    fontWeight: "900",
    letterSpacing: -1
  },
  contrastBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
  },
  emergencyBtn: {
    backgroundColor: "#ba1a1a",
    flexDirection: "row",
    gap: 8,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    width: "100%",
  },
  emergencyBtnText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 16
  },
  tabContainer: {
    paddingHorizontal: 16,
    paddingTop: 12,
    alignItems: "center"
  },
  tabsRow: {
    flexDirection: "row",
    borderRadius: 8,
    borderWidth: 1,
    padding: 4,
    width: "100%",
  },
  tabItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
  },
  tabItemActive: {
    // Solid background handled in render styles
  },
  tabLabel: {
    fontWeight: "bold",
  },
  card: {
    borderWidth: 2,
    borderRadius: 8,
    padding: 16,
  },
  welcomeTitle: {
    fontWeight: "bold",
    letterSpacing: -1
  },
  welcomeSubtitle: {
    opacity: 0.8
  },
  bentoBtn: {
    borderWidth: 2,
    borderRadius: 8,
    padding: 16,
  },
  bentoTitle: {
    fontWeight: "bold",
    marginBottom: 4
  },
  sectionTitle: {
    fontWeight: "bold"
  },
  primaryActionBtn: {
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryActionBtnText: {
    fontWeight: "bold",
    textAlign: "center"
  },
  secondaryActionBtn: {
    borderRadius: 8,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#041627",
    paddingHorizontal: 16
  },
  settingsSection: {
    gap: 8
  },
  toggleRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6
  },
  lessonItemRow: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 2,
    borderRadius: 8,
    padding: 12,
    backgroundColor: "#FFF"
  },
  chatOptionBtn: {
    padding: 10,
    backgroundColor: "#F1F5F9",
    borderWidth: 1,
    borderColor: "#CBD5E1",
    borderRadius: 8,
  }
});
