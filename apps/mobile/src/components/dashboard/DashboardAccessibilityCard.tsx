import React, { useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity, Switch, LayoutChangeEvent } from "react-native";
import { Settings, RotateCcw, ZoomIn, Eye, Sun, Moon, ShieldCheck } from "lucide-react-native";
import type { MobileThemeColors } from "../../theme/mobileTheme";
import type { UserSettings } from "@seniorease/core";

interface DashboardAccessibilityCardProps {
  settings: UserSettings;
  updateSettings: (newSettings: UserSettings) => Promise<void>;
  triggerToast: (msg: string) => void;
  onLayout?: (e: LayoutChangeEvent) => void;
  theme: { colors: MobileThemeColors; fontScale: number };
}

export const DashboardAccessibilityCard: React.FC<DashboardAccessibilityCardProps> = ({
  settings,
  updateSettings,
  triggerToast,
  onLayout,
  theme,
}) => {
  const [confirmActions, setConfirmActions] = useState(true);
  const [voiceReminders, setVoiceReminders] = useState(true);

  const { colors, fontScale } = theme;
  const contrastMode = settings.contrastMode || "standard";
  const isHighContrast = contrastMode === "high";
  const primaryAccentColor = isHighContrast ? colors.primary : "#0F62FE";

  return (
    <View
      style={[styles.cardContainer, { backgroundColor: colors.card, borderColor: colors.border, borderWidth: colors.borderWidth }]}
      onLayout={onLayout}
      id="dashboard-accessibility-card"
    >
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

      <View style={styles.subCardsGrid}>
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
            <TouchableOpacity
              activeOpacity={0.75}
              style={styles.switchRow}
              onPress={() => {
                const newVal = !confirmActions;
                setConfirmActions(newVal);
                triggerToast(newVal ? "Confirmação de ações ativada" : "Confirmação desativada");
              }}
              accessibilityRole="switch"
              accessibilityState={{ checked: confirmActions }}
            >
              <Text style={[styles.switchLabel, { color: colors.text, fontSize: Math.round(14 * fontScale) }]}>
                Confirmar Ações
              </Text>
              <View pointerEvents="none">
                <Switch
                  value={confirmActions}
                  trackColor={{ false: "#E0E0E0", true: primaryAccentColor }}
                  thumbColor="#FFFFFF"
                />
              </View>
            </TouchableOpacity>

            <View style={styles.dividerDashed} />

            <TouchableOpacity
              activeOpacity={0.75}
              style={styles.switchRow}
              onPress={() => {
                const newVal = !voiceReminders;
                setVoiceReminders(newVal);
                triggerToast(newVal ? "Lembretes por voz ativados" : "Lembretes desativados");
              }}
              accessibilityRole="switch"
              accessibilityState={{ checked: voiceReminders }}
            >
              <Text style={[styles.switchLabel, { color: colors.text, fontSize: Math.round(14 * fontScale) }]}>
                Lembretes por Voz
              </Text>
              <View pointerEvents="none">
                <Switch
                  value={voiceReminders}
                  trackColor={{ false: "#E0E0E0", true: primaryAccentColor }}
                  thumbColor="#FFFFFF"
                />
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    padding: 18,
    borderRadius: 16,
    gap: 14,
  },
  cardTopRowMobile: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  cardTopTitleGroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  cardTopTitleText: {
    fontWeight: "bold",
  },
  resetBtnOutline: {
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
  resetBtnOutlineText: {
    color: "#DA1E28",
    fontWeight: "bold",
  },
  subCardsGrid: {
    gap: 14,
  },
  subCardBox: {
    padding: 14,
    borderRadius: 12,
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
    marginBottom: 4,
  },
  innerBox: {
    padding: 12,
    borderRadius: 10,
    gap: 10,
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
    minHeight: 46,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  actionBtnSolidText: {
    fontWeight: "bold",
  },
  actionBtnOutline: {
    minHeight: 46,
    borderRadius: 8,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
  },
  actionBtnOutlineText: {
    fontWeight: "bold",
  },
  contrastBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    minHeight: 46,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
  },
  contrastBtnText: {
    fontWeight: "bold",
  },
  switchRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 4,
  },
  switchLabel: {
    fontWeight: "600",
  },
  dividerDashed: {
    height: 1,
    backgroundColor: "#E0E0E0",
    marginVertical: 4,
  },
});
