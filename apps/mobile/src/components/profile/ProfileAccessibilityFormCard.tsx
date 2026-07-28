import React from "react";
import { StyleSheet, Text, View, TouchableOpacity, Switch } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { 
  Sliders, 
  RotateCcw, 
  ZoomIn, 
  Eye, 
  Sun, 
  Moon, 
  ShieldCheck, 
  Volume2, 
  Bell, 
  Save 
} from "lucide-react-native";
import type { MobileThemeColors } from "../../theme/mobileTheme";
import type { UserSettings } from "@seniorease/core";
import type { UserProfile } from "../../context/AppContext";

interface ProfileAccessibilityFormCardProps {
  settings: UserSettings;
  updateSettings: (newSettings: UserSettings) => Promise<void>;
  updateUserProfile: (partial: Partial<UserProfile>) => Promise<void>;
  triggerToast: (msg: string) => void;
  theme: { colors: MobileThemeColors; fontScale: number };
}

export const ProfileAccessibilityFormCard: React.FC<ProfileAccessibilityFormCardProps> = ({
  settings,
  updateSettings,
  updateUserProfile,
  triggerToast,
  theme,
}) => {
  const { colors, fontScale } = theme;
  const contrastMode = settings.contrastMode || "standard";
  const isHighContrast = colors.mode === "high";
  const primaryAccentColor = isHighContrast ? colors.primary : "#0F62FE";

  const handleResetAll = async () => {
    await updateSettings({ ...settings, fontScale: 1.0, contrastMode: "standard" });
    triggerToast("Todas as preferências foram resetadas para o padrão!");
  };

  const handleSaveAllPreferences = async () => {
    triggerToast("✨ Todas as preferências foram salvas com sucesso!");
  };

  return (
    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border, borderWidth: colors.borderWidth }]} id="profile-accessibility-form-card">
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

      <TouchableOpacity
        activeOpacity={0.75}
        style={[styles.switchCardRow, { backgroundColor: colors.surfaceSubtle, borderColor: colors.border, borderWidth: colors.borderWidth }]}
        onPress={async () => {
          const newVal = !(settings.criticalConfirmation ?? true);
          await updateSettings({ ...settings, criticalConfirmation: newVal });
          triggerToast(newVal ? "Confirmação de ações ativada" : "Confirmações desativadas");
        }}
        accessibilityRole="switch"
        accessibilityState={{ checked: settings.criticalConfirmation ?? true }}
      >
        <ShieldCheck size={26} color="#24A148" />
        <View style={{ flex: 1 }}>
          <Text style={[styles.switchCardTitle, { color: colors.text, fontSize: Math.round(15 * fontScale) }]}>
            Confirmação de Ações Críticas
          </Text>
          <Text style={[styles.switchCardSub, { color: colors.textMuted, fontSize: Math.round(13 * fontScale) }]}>
            Pede confirmação antes de excluir tarefas ou sair
          </Text>
        </View>
        <View pointerEvents="none">
          <Switch
            value={settings.criticalConfirmation ?? true}
            trackColor={{ false: "#E0E0E0", true: primaryAccentColor }}
            thumbColor="#FFFFFF"
          />
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        activeOpacity={0.75}
        style={[styles.switchCardRow, { backgroundColor: colors.surfaceSubtle, borderColor: colors.border, borderWidth: colors.borderWidth }]}
        onPress={async () => {
          const newVal = !(settings.feedbackVisual ?? true);
          await updateSettings({ ...settings, feedbackVisual: newVal });
          triggerToast(newVal ? "Feedback reforçado ativado" : "Feedback desativado");
        }}
        accessibilityRole="switch"
        accessibilityState={{ checked: settings.feedbackVisual ?? true }}
      >
        <Volume2 size={26} color={primaryAccentColor} />
        <View style={{ flex: 1 }}>
          <Text style={[styles.switchCardTitle, { color: colors.text, fontSize: Math.round(15 * fontScale) }]}>
            Feedback Visual e Sonoro Reforçado
          </Text>
          <Text style={[styles.switchCardSub, { color: colors.textMuted, fontSize: Math.round(13 * fontScale) }]}>
            Ativa animações festivas e sintetizador de voz nativo
          </Text>
        </View>
        <View pointerEvents="none">
          <Switch
            value={settings.feedbackVisual ?? true}
            trackColor={{ false: "#E0E0E0", true: primaryAccentColor }}
            thumbColor="#FFFFFF"
          />
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        activeOpacity={0.75}
        style={[styles.switchCardRow, { backgroundColor: colors.surfaceSubtle, borderColor: colors.border, borderWidth: colors.borderWidth }]}
        onPress={async () => {
          const currentSimplified = settings.navigationMode === "simplified";
          const newMode = !currentSimplified ? "simplified" : "standard";
          await updateSettings({ ...settings, navigationMode: newMode });
          triggerToast(!currentSimplified ? "Modo Simplificado ativado" : "Modo Padrão ativado");
        }}
        accessibilityRole="switch"
        accessibilityState={{ checked: settings.navigationMode === "simplified" }}
      >
        <Bell size={26} color="#F1C21B" />
        <View style={{ flex: 1 }}>
          <Text style={[styles.switchCardTitle, { color: colors.text, fontSize: Math.round(15 * fontScale) }]}>
            Modo de Navegação Simplificado
          </Text>
          <Text style={[styles.switchCardSub, { color: colors.textMuted, fontSize: Math.round(13 * fontScale) }]}>
            Oculta distrações secundárias para foco máximo
          </Text>
        </View>
        <View pointerEvents="none">
          <Switch
            value={settings.navigationMode === "simplified"}
            trackColor={{ false: "#E0E0E0", true: primaryAccentColor }}
            thumbColor="#FFFFFF"
          />
        </View>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.submitBtnPrimary, { backgroundColor: primaryAccentColor, marginTop: 6 }]} onPress={handleSaveAllPreferences}>
        <Save size={18} color={colors.primaryContrast} />
        <Text style={[styles.submitBtnPrimaryText, { color: colors.primaryContrast, fontSize: Math.round(15 * fontScale) }]}>
          Salvar Todas as Minhas Preferências
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.resetDataBtn, { borderColor: colors.border }]}
        onPress={async () => {
          await AsyncStorage.clear();
          triggerToast("🧹 Dados e Tour zerados! Redirecionando...");
          setTimeout(() => {
            updateUserProfile({ isAuthenticated: false });
          }, 600);
        }}
      >
        <RotateCcw size={16} color={colors.textMuted} />
        <Text style={[styles.resetDataBtnText, { color: colors.textMuted, fontSize: Math.round(13 * fontScale) }]}>
          Resetar Dados de Teste (Limpar Armazenamento & Tour)
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },
  a11yHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  labelRowWithIcon: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  cardTitle: {
    fontWeight: "bold",
  },
  cardSubTitle: {},
  resetBtnRed: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#DA1E28",
    backgroundColor: "#FFF0F0",
  },
  resetBtnRedText: {
    color: "#DA1E28",
    fontWeight: "bold",
  },
  subCardBox: {
    padding: 14,
    borderRadius: 10,
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
    padding: 12,
    borderRadius: 8,
    gap: 8,
  },
  scaleBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    alignItems: "center",
  },
  scaleBadgeText: {
    fontWeight: "bold",
  },
  actionBtnSolid: {
    minHeight: 44,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  actionBtnSolidText: {
    fontWeight: "bold",
  },
  actionBtnOutline: {
    minHeight: 44,
    borderRadius: 8,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
  },
  actionBtnOutlineText: {
    fontWeight: "bold",
  },
  contrastBtnWeb: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    minHeight: 44,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
  },
  contrastBtnWebText: {
    fontWeight: "bold",
  },
  switchCardRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 12,
    borderRadius: 10,
  },
  switchCardTitle: {
    fontWeight: "bold",
  },
  switchCardSub: {},
  submitBtnPrimary: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    minHeight: 52,
    borderRadius: 8,
  },
  submitBtnPrimaryText: {
    fontWeight: "bold",
  },
  resetDataBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    marginTop: 4,
  },
  resetDataBtnText: {
    fontWeight: "600",
  },
});
