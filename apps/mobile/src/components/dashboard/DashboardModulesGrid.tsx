import React from "react";
import { StyleSheet, Text, View, TouchableOpacity, LayoutChangeEvent } from "react-native";
import { Sliders, BookCheck, User, PhoneCall } from "lucide-react-native";
import type { MobileThemeColors } from "../../theme/mobileTheme";

interface DashboardModulesGridProps {
  onNavigateTab: (tab: "dashboard" | "tasks" | "profile" | "help") => void;
  onOpenHelpModal: () => void;
  onLayout?: (e: LayoutChangeEvent) => void;
  theme: { colors: MobileThemeColors; fontScale: number };
}

export const DashboardModulesGrid: React.FC<DashboardModulesGridProps> = ({
  onNavigateTab,
  onOpenHelpModal,
  onLayout,
  theme,
}) => {
  const { colors, fontScale } = theme;
  const isHighContrast = colors.mode === "high";
  const primaryAccentColor = isHighContrast ? colors.primary : "#0F62FE";

  return (
    <View style={styles.modulesSection} id="dashboard-modules-grid">
      <View style={styles.modulesHeader}>
        <Text style={[styles.modulesHeaderTitle, { color: colors.text, fontSize: Math.round(20 * fontScale) }]}>
          Acesse os módulos
        </Text>
      </View>

      <View style={styles.modulesGrid} onLayout={onLayout}>
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
            Ajustar tamanho da fonte e contraste da tela
          </Text>
        </TouchableOpacity>

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
          onPress={() => onNavigateTab("tasks")}
        >
          <BookCheck size={36} color="#8A3FFC" style={{ marginBottom: 8 }} />
          <Text style={[styles.moduleTitle, { color: colors.text, fontSize: Math.round(16 * fontScale) }]}>
            Gerenciar Atividades
          </Text>
          <Text style={[styles.moduleDesc, { color: colors.textMuted, fontSize: Math.round(12 * fontScale) }]}>
            Cadastrar ou filtrar tarefas por voz
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.moduleCard,
            { 
              backgroundColor: colors.card, 
              borderColor: colors.border, 
              borderWidth: colors.borderWidth, 
              borderTopWidth: 4, 
              borderTopColor: "#0072C3" 
            },
          ]}
          onPress={() => onNavigateTab("profile")}
        >
          <User size={36} color="#0072C3" style={{ marginBottom: 8 }} />
          <Text style={[styles.moduleTitle, { color: colors.text, fontSize: Math.round(16 * fontScale) }]}>
            Seu Perfil
          </Text>
          <Text style={[styles.moduleDesc, { color: colors.textMuted, fontSize: Math.round(12 * fontScale) }]}>
            Cadastrar nome, email e dados do cuidador
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.moduleCard,
            { 
              backgroundColor: colors.card, 
              borderColor: colors.border, 
              borderWidth: colors.borderWidth, 
              borderTopWidth: 4, 
              borderTopColor: "#198038" 
            },
          ]}
          onPress={onOpenHelpModal}
        >
          <PhoneCall size={36} color="#198038" style={{ marginBottom: 8 }} />
          <Text style={[styles.moduleTitle, { color: colors.text, fontSize: Math.round(16 * fontScale) }]}>
            0800 Apoio Humano
          </Text>
          <Text style={[styles.moduleDesc, { color: colors.textMuted, fontSize: Math.round(12 * fontScale) }]}>
            Ligação telefônica gratuita de suporte
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  modulesSection: {
    gap: 12,
  },
  modulesHeader: {
    marginTop: 6,
  },
  modulesHeaderTitle: {
    fontWeight: "bold",
  },
  modulesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  moduleCard: {
    width: "48%",
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 130,
  },
  moduleTitle: {
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 4,
    flexShrink: 1,
  },
  moduleDesc: {
    textAlign: "center",
    lineHeight: 18,
    flexShrink: 1,
  },
});
