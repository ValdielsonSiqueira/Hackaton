import React, { useState, useRef } from "react";
import { 
  StyleSheet, 
  Text, 
  View, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  Switch, 
  LayoutChangeEvent 
} from "react-native";
import type { MobileThemeColors } from "../theme/mobileTheme";
import type { UserProfile } from "../context/AppContext";
import type { UserSettings } from "@seniorease/core";
import { SpotlightCutoutTour, SpotlightStep } from "../components/SpotlightCutoutTour";
import { 
  User, 
  Mail, 
  HeartHandshake, 
  Save, 
  Compass, 
  CheckCircle2, 
  ArrowRight, 
  Sliders, 
  RotateCcw, 
  ZoomIn, 
  Eye, 
  Sun, 
  Moon, 
  ShieldCheck, 
  Volume2, 
  Bell 
} from "lucide-react-native";

interface ProfileViewProps {
  theme: { colors: MobileThemeColors; fontScale: number };
  settings: UserSettings;
  updateSettings: (newSettings: UserSettings) => Promise<void>;
  userProfile: UserProfile;
  updateUserProfile: (partial: Partial<UserProfile>) => Promise<void>;
  triggerToast: (msg: string) => void;
  speakText: (text: string) => void;
  onNavigateTab?: (tab: "dashboard" | "tasks" | "profile" | "help") => void;
  bottomInset?: number;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  theme,
  settings,
  updateSettings,
  userProfile,
  updateUserProfile,
  triggerToast,
  speakText,
  onNavigateTab,
  bottomInset = 0,
}) => {
  const scrollViewRef = useRef<ScrollView>(null);
  const { colors, fontScale } = theme;
  const contrastMode = settings.contrastMode || "standard";
  const isHighContrast = colors.mode === "high";
  const primaryAccentColor = isHighContrast ? colors.primary : "#0F62FE";

  const [name, setName] = useState(userProfile.name);
  const [email, setEmail] = useState(userProfile.email);
  const [caregiver, setCaregiver] = useState(userProfile.caregiverContact);
  const [showProfileTour, setShowProfileTour] = useState(false);

  const [headerY, setHeaderY] = useState(0);
  const [personalY, setPersonalY] = useState(100);
  const [sidebarY, setSidebarY] = useState(400);
  const [a11yY, setA11yY] = useState(650);

  const profileTourSteps: SpotlightStep[] = [
    {
      id: "profile-step-1",
      targetName: "Cabeçalho de Informações",
      title: "1/3 Suas Informações e Preferências",
      description: "Gerencie seus dados pessoais, e-mail de estudante e contato do cuidador.",
      voiceText: "Aqui você edita seu nome e e-mail cadastrado no SeniorEase.",
      tip: "Toque em 'Salvar Informações Cadastrais' após realizar alterações.",
      scrollY: headerY,
    },
    {
      id: "profile-step-2",
      targetName: "Armazenamento Persistente",
      title: "2/3 Preferências Seguras",
      description: "Toda alteração de tamanho de letra, alto contraste e confirmações é salva automaticamente no dispositivo.",
      voiceText: "Suas preferências de acessibilidade ficam salvas em segurança.",
      tip: "Você pode voltar ao painel ou ver suas atividades a qualquer momento.",
      scrollY: sidebarY,
    },
    {
      id: "profile-step-3",
      targetName: "Preferências de Acessibilidade",
      title: "3/3 Personalização de Acessibilidade",
      description: "Ajuste o tamanho da fonte (A+/A-), alterne modos de contraste e ative confirmações de segurança.",
      voiceText: "Personalize o tamanho do texto e as cores para sua melhor visualização.",
      tip: "O botão Resetar restaura as preferências padrão.",
      scrollY: a11yY,
    },
  ];

  const handleSaveProfile = async () => {
    await updateUserProfile({
      name: name.trim(),
      email: email.trim(),
      caregiverContact: caregiver.trim(),
    });
    triggerToast("✨ Informações do perfil salvas com sucesso!");
  };

  const handleSaveAllPreferences = async () => {
    triggerToast("✨ Todas as preferências foram salvas com sucesso!");
  };

  const handleResetAll = async () => {
    await updateSettings({ ...settings, fontScale: 1.0, contrastMode: "standard" });
    triggerToast("Todas as preferências foram resetadas para o padrão!");
  };

  const handleStepChange = (_stepIndex: number, scrollY: number) => {
    scrollViewRef.current?.scrollTo({
      y: Math.max(0, scrollY - 10),
      animated: true,
    });
  };

  const userInitial = (name || "E").charAt(0).toUpperCase();

  return (
    <ScrollView
      ref={scrollViewRef}
      contentContainerStyle={[styles.container, { paddingBottom: 90 + bottomInset }]}
      showsVerticalScrollIndicator={false}
    >
      {/* Title Header (Replicating Web ProfileHeader.tsx 1:1) */}
      <View
        style={styles.headerBlock}
        onLayout={(e: LayoutChangeEvent) => setHeaderY(e.nativeEvent.layout.y)}
      >
        <View style={styles.titleRowMobile}>
          <Text style={[styles.title, { color: colors.text, fontSize: Math.round(22 * fontScale) }]}>
            Suas Informações e Preferências
          </Text>
          <TouchableOpacity
            style={[styles.tourBtnWeb, { borderColor: isHighContrast ? colors.border : "#E0E0E0", backgroundColor: colors.card }]}
            onPress={() => setShowProfileTour(true)}
          >
            <Compass size={16} color={primaryAccentColor} />
            <Text style={[styles.tourBtnWebText, { color: colors.text, fontSize: Math.round(13 * fontScale) }]}>
              Tour Guiado
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* 1. User Profile Form Card (Replicating Web UserProfileForm.tsx 1:1) */}
      <View
        style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border, borderWidth: colors.borderWidth }]}
        onLayout={(e: LayoutChangeEvent) => setPersonalY(e.nativeEvent.layout.y)}
      >
        {/* Avatar Header Row */}
        <View style={styles.avatarRow}>
          <View style={[styles.avatarCircle, { backgroundColor: primaryAccentColor }]}>
            <Text style={styles.avatarInitial}>{userInitial}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.profileNameText, { color: colors.text, fontSize: Math.round(20 * fontScale) }]}>
              {name || "Estudante"}
            </Text>
            <Text style={[styles.profileSubText, { color: colors.textMuted, fontSize: Math.round(13 * fontScale) }]}>
              Estudante SeniorEase — FIAP Inclusive
            </Text>
          </View>
        </View>

        {/* Field 1: Seu Nome Completo */}
        <View style={styles.fieldGroup}>
          <View style={styles.labelRowWithIcon}>
            <User size={16} color={primaryAccentColor} />
            <Text style={[styles.label, { color: colors.text, fontSize: Math.round(14 * fontScale) }]}>
              Seu Nome Completo
            </Text>
          </View>
          <TextInput
            style={[styles.input, { backgroundColor: colors.surfaceSubtle, color: colors.text, borderColor: colors.border }]}
            value={name}
            onChangeText={setName}
            placeholder="Seu nome completo"
            placeholderTextColor={colors.textMuted}
          />
          <Text style={[styles.subHint, { color: colors.textMuted, fontSize: Math.round(11 * fontScale) }]}>
            Como deseja ser chamado no sistema
          </Text>
        </View>

        {/* Field 2: Seu E-mail */}
        <View style={styles.fieldGroup}>
          <View style={styles.labelRowWithIcon}>
            <Mail size={16} color={primaryAccentColor} />
            <Text style={[styles.label, { color: colors.text, fontSize: Math.round(14 * fontScale) }]}>
              Seu E-mail
            </Text>
          </View>
          <TextInput
            style={[styles.input, { backgroundColor: colors.surfaceSubtle, color: colors.text, borderColor: colors.border }]}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            placeholder="Seu e-mail de estudante"
            placeholderTextColor={colors.textMuted}
          />
          <Text style={[styles.subHint, { color: colors.textMuted, fontSize: Math.round(11 * fontScale) }]}>
            Seu e-mail de acesso e notificações
          </Text>
        </View>

        {/* Field 3: Cuidador / Familiar */}
        <View style={styles.fieldGroup}>
          <View style={styles.labelRowWithIcon}>
            <HeartHandshake size={16} color={primaryAccentColor} />
            <Text style={[styles.label, { color: colors.text, fontSize: Math.round(14 * fontScale) }]}>
              E-mail ou Telefone do Cuidador / Familiar (Opcional)
            </Text>
          </View>
          <TextInput
            style={[styles.input, { backgroundColor: colors.surfaceSubtle, color: colors.text, borderColor: colors.border }]}
            value={caregiver}
            onChangeText={setCaregiver}
            placeholder="Ex: Maria (Filha) - (11) 99999-8888"
            placeholderTextColor={colors.textMuted}
          />
          <Text style={[styles.subHint, { color: colors.textMuted, fontSize: Math.round(11 * fontScale) }]}>
            Usado apenas para cópia de lembretes e apoio de emergência (deixe em branco se não houver).
          </Text>
        </View>

        {/* Save Profile Button */}
        <TouchableOpacity style={[styles.submitBtnPrimary, { backgroundColor: primaryAccentColor }]} onPress={handleSaveProfile}>
          <Save size={18} color={colors.primaryContrast} />
          <Text style={[styles.submitBtnPrimaryText, { color: colors.primaryContrast, fontSize: Math.round(15 * fontScale) }]}>
            Salvar Informações Cadastrais
          </Text>
        </TouchableOpacity>
      </View>

      {/* 2. Sidebar Cards (Replicating Web ProfileSidebar.tsx 1:1) */}
      <View style={styles.sidebarBlock} onLayout={(e: LayoutChangeEvent) => setSidebarY(e.nativeEvent.layout.y)}>
        {/* Card 1: Armazenamento Persistente */}
        <View style={[styles.card, { backgroundColor: colors.surfaceSubtle, borderColor: colors.border, borderWidth: colors.borderWidth }]}>
          <View style={styles.sidebarTitleRow}>
            <CheckCircle2 size={18} color={primaryAccentColor} />
            <Text style={[styles.sidebarBadgeText, { color: primaryAccentColor, fontSize: Math.round(13 * fontScale) }]}>
              Armazenamento Persistente
            </Text>
          </View>
          <Text style={[styles.sidebarHeading, { color: colors.text, fontSize: Math.round(16 * fontScale) }]}>
            Suas preferências estão seguras
          </Text>
          <Text style={[styles.sidebarDesc, { color: colors.textMuted, fontSize: Math.round(13 * fontScale) }]}>
            Toda alteração de tamanho de letra, alto contraste e confirmações é salva automaticamente.
          </Text>
        </View>

        {/* Card 2: Navegação Rápida */}
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border, borderWidth: colors.borderWidth }]}>
          <Text style={[styles.sidebarHeading, { color: colors.text, fontSize: Math.round(15 * fontScale), marginBottom: 10 }]}>
            Navegação Rápida
          </Text>
          <View style={styles.sidebarBtnsCol}>
            <TouchableOpacity
              style={[styles.submitBtnPrimary, { backgroundColor: primaryAccentColor }]}
              onPress={() => onNavigateTab?.("dashboard")}
            >
              <Text style={[styles.submitBtnPrimaryText, { color: colors.primaryContrast, fontSize: Math.round(14 * fontScale) }]}>
                Voltar ao Painel
              </Text>
              <ArrowRight size={18} color={colors.primaryContrast} />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.cancelBtnOutline, { borderColor: isHighContrast ? colors.border : "#E0E0E0", backgroundColor: colors.card }]}
              onPress={() => onNavigateTab?.("tasks")}
            >
              <Text style={[styles.cancelBtnOutlineText, { color: primaryAccentColor, fontSize: Math.round(14 * fontScale) }]}>
                Ver Minhas Atividades
              </Text>
              <ArrowRight size={18} color={primaryAccentColor} />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* 3. Accessibility Preferences Form Card (Replicating Web AccessibilityPreferencesForm.tsx 1:1) */}
      <View
        style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border, borderWidth: colors.borderWidth }]}
        onLayout={(e: LayoutChangeEvent) => setA11yY(e.nativeEvent.layout.y)}
      >
        {/* Card Header Row with Reset Button */}
        <View style={styles.a11yHeaderRow}>
          <View style={{ flex: 1 }}>
            <View style={styles.labelRowWithIcon}>
              <Sliders size={18} color={primaryAccentColor} />
              <Text style={[styles.cardTitle, { color: colors.text, fontSize: Math.round(17 * fontScale) }]}>
                Preferências de Acessibilidade Salvas
              </Text>
            </View>
            <Text style={[styles.cardSubTitle, { color: colors.textMuted, fontSize: Math.round(12 * fontScale) }]}>
              Ajuste como o SeniorEase se comporta para você
            </Text>
          </View>

          <TouchableOpacity style={styles.resetBtnRed} onPress={handleResetAll}>
            <RotateCcw size={18} color="#DA1E28" />
            <Text style={[styles.resetBtnRedText, { fontSize: Math.round(15 * fontScale) }]}>
              Resetar Acessibilidade
            </Text>
          </TouchableOpacity>
        </View>

        {/* Sub-Card 1: Tamanho do Texto da Plataforma */}
        <View style={[styles.subCardBox, { backgroundColor: colors.surfaceSubtle, borderColor: colors.border, borderWidth: colors.borderWidth }]}>
          <View style={styles.subCardHeaderRow}>
            <ZoomIn size={22} color={primaryAccentColor} />
            <View style={{ flex: 1 }}>
              <Text style={[styles.subCardHeaderTitle, { color: colors.text, fontSize: Math.round(15 * fontScale) }]}>
                Tamanho do Texto da Plataforma
              </Text>
              <Text style={[styles.subCardHeaderSub, { color: colors.textMuted, fontSize: Math.round(12 * fontScale) }]}>
                Aumente ou diminua as letras da tela
              </Text>
            </View>
          </View>

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
              style={[styles.actionBtnOutline, { borderColor: isHighContrast ? colors.border : "#E0E0E0" }]}
              onPress={() => updateSettings({ ...settings, fontScale: Math.max(0.8, fontScale - 0.1) })}
            >
              <Text style={[styles.actionBtnOutlineText, { color: primaryAccentColor, fontSize: Math.round(14 * fontScale) }]}>
                A- Diminuir
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Sub-Card 2: Modo de Contraste e Tema Visual */}
        <View style={[styles.subCardBox, { backgroundColor: colors.surfaceSubtle, borderColor: colors.border, borderWidth: colors.borderWidth }]}>
          <View style={styles.subCardHeaderRow}>
            <Eye size={22} color={primaryAccentColor} />
            <View style={{ flex: 1 }}>
              <Text style={[styles.subCardHeaderTitle, { color: colors.text, fontSize: Math.round(15 * fontScale) }]}>
                Modo de Contraste e Tema Visual
              </Text>
              <Text style={[styles.subCardHeaderSub, { color: colors.textMuted, fontSize: Math.round(12 * fontScale) }]}>
                Escolha a paleta mais confortável para sua visão
              </Text>
            </View>
          </View>

          <View style={[styles.innerBox, { backgroundColor: colors.card, borderColor: colors.border, borderWidth: colors.borderWidth }]}>
            <TouchableOpacity
              style={[
                styles.contrastBtnWeb,
                { 
                  backgroundColor: contrastMode === "standard" ? primaryAccentColor : colors.card, 
                  borderColor: contrastMode === "standard" ? primaryAccentColor : colors.border,
                },
              ]}
              onPress={() => updateSettings({ ...settings, contrastMode: "standard" })}
            >
              <Sun size={16} color={contrastMode === "standard" ? colors.primaryContrast : colors.text} />
              <Text style={[styles.contrastBtnWebText, { color: contrastMode === "standard" ? colors.primaryContrast : colors.text, fontSize: Math.round(13 * fontScale) }]}>
                Padrão (Branco)
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.contrastBtnWeb,
                { 
                  backgroundColor: contrastMode === "high" ? "#000000" : colors.card, 
                  borderColor: contrastMode === "high" ? "#FFFF00" : colors.border,
                  borderWidth: contrastMode === "high" ? 2 : 1,
                },
              ]}
              onPress={() => updateSettings({ ...settings, contrastMode: "high" })}
            >
              <Eye size={16} color={contrastMode === "high" ? "#FFFF00" : colors.text} />
              <Text style={[styles.contrastBtnWebText, { color: contrastMode === "high" ? "#FFFF00" : colors.text, fontSize: Math.round(13 * fontScale) }]}>
                Alto Contraste
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.contrastBtnWeb,
                { 
                  backgroundColor: contrastMode === "dark" ? "#161616" : colors.card, 
                  borderColor: contrastMode === "dark" ? "#161616" : colors.border,
                },
              ]}
              onPress={() => updateSettings({ ...settings, contrastMode: "dark" })}
            >
              <Moon size={16} color={contrastMode === "dark" ? "#F1C21B" : colors.text} />
              <Text style={[styles.contrastBtnWebText, { color: contrastMode === "dark" ? "#F1C21B" : colors.text, fontSize: Math.round(13 * fontScale) }]}>
                Modo Escuro
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Switch Row 1: Confirmação de Ações Críticas */}
        <View style={[styles.switchCardRow, { backgroundColor: colors.surfaceSubtle, borderColor: colors.border, borderWidth: colors.borderWidth }]}>
          <ShieldCheck size={22} color="#24A148" />
          <View style={{ flex: 1 }}>
            <Text style={[styles.switchCardTitle, { color: colors.text, fontSize: Math.round(14 * fontScale) }]}>
              Confirmação de Ações Críticas
            </Text>
            <Text style={[styles.switchCardSub, { color: colors.textMuted, fontSize: Math.round(12 * fontScale) }]}>
              Pede confirmação antes de excluir tarefas ou sair
            </Text>
          </View>
          <Switch
            value={settings.criticalConfirmation ?? true}
            onValueChange={async (val) => {
              await updateSettings({ ...settings, criticalConfirmation: val });
              triggerToast(val ? "Confirmação de ações ativada" : "Confirmações desativadas");
            }}
            trackColor={{ false: "#E0E0E0", true: primaryAccentColor }}
            thumbColor="#FFFFFF"
          />
        </View>

        {/* Switch Row 2: Feedback Visual e Sonoro Reforçado */}
        <View style={[styles.switchCardRow, { backgroundColor: colors.surfaceSubtle, borderColor: colors.border, borderWidth: colors.borderWidth }]}>
          <Volume2 size={22} color={primaryAccentColor} />
          <View style={{ flex: 1 }}>
            <Text style={[styles.switchCardTitle, { color: colors.text, fontSize: Math.round(14 * fontScale) }]}>
              Feedback Visual e Sonoro Reforçado
            </Text>
            <Text style={[styles.switchCardSub, { color: colors.textMuted, fontSize: Math.round(12 * fontScale) }]}>
              Ativa animações festivas e sintetizador de voz nativo
            </Text>
          </View>
          <Switch
            value={settings.feedbackVisual ?? true}
            onValueChange={async (val) => {
              await updateSettings({ ...settings, feedbackVisual: val });
              triggerToast(val ? "Feedback reforçado ativado" : "Feedback desativado");
            }}
            trackColor={{ false: "#E0E0E0", true: primaryAccentColor }}
            thumbColor="#FFFFFF"
          />
        </View>

        {/* Switch Row 3: Modo de Navegação Simplificado */}
        <View style={[styles.switchCardRow, { backgroundColor: colors.surfaceSubtle, borderColor: colors.border, borderWidth: colors.borderWidth }]}>
          <Bell size={22} color="#F1C21B" />
          <View style={{ flex: 1 }}>
            <Text style={[styles.switchCardTitle, { color: colors.text, fontSize: Math.round(14 * fontScale) }]}>
              Modo de Navegação Simplificado
            </Text>
            <Text style={[styles.switchCardSub, { color: colors.textMuted, fontSize: Math.round(12 * fontScale) }]}>
              Oculta distrações secundárias para foco máximo
            </Text>
          </View>
          <Switch
            value={settings.navigationMode === "simplified"}
            onValueChange={async (val) => {
              const newMode = val ? "simplified" : "standard";
              await updateSettings({ ...settings, navigationMode: newMode });
              triggerToast(val ? "Modo Simplificado ativado" : "Modo Padrão ativado");
            }}
            trackColor={{ false: "#E0E0E0", true: primaryAccentColor }}
            thumbColor="#FFFFFF"
          />
        </View>

        {/* Save All Preferences Button */}
        <TouchableOpacity style={[styles.submitBtnPrimary, { backgroundColor: primaryAccentColor, marginTop: 6 }]} onPress={handleSaveAllPreferences}>
          <Save size={18} color={colors.primaryContrast} />
          <Text style={[styles.submitBtnPrimaryText, { color: colors.primaryContrast, fontSize: Math.round(15 * fontScale) }]}>
            Salvar Todas as Minhas Preferências
          </Text>
        </TouchableOpacity>
      </View>

      {/* Spotlight Tour for Profile Page */}
      <SpotlightCutoutTour
        visible={showProfileTour}
        theme={theme}
        steps={profileTourSteps}
        onClose={() => setShowProfileTour(false)}
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
  headerBlock: {},
  titleRowMobile: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  title: {
    fontWeight: "bold",
    flex: 1,
  },
  tourBtnWeb: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderWidth: 1,
    borderRadius: 6,
  },
  tourBtnWebText: {
    fontWeight: "500",
  },
  card: {
    padding: 16,
    borderRadius: 10,
    gap: 14,
  },
  avatarRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  avatarCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarInitial: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "bold",
  },
  profileNameText: {
    fontWeight: "normal",
  },
  profileSubText: {
    marginTop: 2,
  },
  fieldGroup: {
    gap: 6,
  },
  labelRowWithIcon: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  label: {
    fontWeight: "bold",
  },
  input: {
    minHeight: 52,
    borderWidth: 0,
    borderBottomWidth: 2,
    borderRadius: 4,
    paddingHorizontal: 12,
    fontSize: 15,
  },
  subHint: {
    marginTop: 2,
  },
  submitBtnPrimary: {
    minHeight: 60,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 10,
    flexWrap: "wrap",
  },
  submitBtnPrimaryText: {
    fontWeight: "bold",
    textAlign: "center",
    flexShrink: 1,
  },
  sidebarBlock: {
    gap: 14,
  },
  sidebarTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  sidebarBadgeText: {
    fontWeight: "bold",
  },
  sidebarHeading: {
    fontWeight: "bold",
  },
  sidebarDesc: {
    lineHeight: 18,
  },
  sidebarBtnsCol: {
    gap: 10,
  },
  cancelBtnOutline: {
    minHeight: 56,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 10,
    borderWidth: 1.5,
    flexWrap: "wrap",
  },
  cancelBtnOutlineText: {
    fontWeight: "bold",
    textAlign: "center",
    flexShrink: 1,
  },
  a11yHeaderRow: {
    flexDirection: "column",
    alignItems: "stretch",
    gap: 14,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  cardTitle: {
    fontWeight: "bold",
  },
  cardSubTitle: {
    marginTop: 2,
  },
  resetBtnRed: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    minHeight: 50,
    borderWidth: 1.5,
    borderColor: "#DA1E28",
    paddingHorizontal: 14,
    paddingVertical: 14,
    borderRadius: 8,
    flexWrap: "wrap",
  },
  resetBtnRedText: {
    color: "#DA1E28",
    fontWeight: "bold",
    textAlign: "center",
    flexShrink: 1,
  },
  subCardBox: {
    padding: 14,
    borderRadius: 8,
    gap: 8,
  },
  subCardHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  subCardHeaderTitle: {
    fontWeight: "bold",
  },
  subCardHeaderSub: {},
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
  contrastBtnWeb: {
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
  contrastBtnWebText: {
    fontWeight: "bold",
    textAlign: "center",
    flexShrink: 1,
  },
  switchCardRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 8,
    gap: 10,
  },
  switchCardTitle: {
    fontWeight: "bold",
  },
  switchCardSub: {
    marginTop: 2,
  },
});
