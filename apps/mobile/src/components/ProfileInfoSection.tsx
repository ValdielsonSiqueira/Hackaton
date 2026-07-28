import React from "react";
import { StyleSheet, Text, View, TextInput, TouchableOpacity } from "react-native";
import { User, Mail, HeartHandshake, Save } from "lucide-react-native";
import type { MobileThemeColors } from "../theme/mobileTheme";

interface ProfileInfoSectionProps {
  name: string;
  setName: (val: string) => void;
  email: string;
  setEmail: (val: string) => void;
  caregiver: string;
  setCaregiver: (val: string) => void;
  onSave: () => void;
  theme: { colors: MobileThemeColors; fontScale: number };
}

export const ProfileInfoSection: React.FC<ProfileInfoSectionProps> = ({
  name,
  setName,
  email,
  setEmail,
  caregiver,
  setCaregiver,
  onSave,
  theme,
}) => {
  const { colors, fontScale } = theme;
  const isHighContrast = colors.mode === "high";
  const primaryAccentColor = isHighContrast ? colors.primary : "#0F62FE";

  return (
    <View
      style={[
        styles.outerBox,
        { backgroundColor: colors.surfaceSubtle, borderColor: colors.border, borderWidth: colors.borderWidth },
      ]}
      id="user-profile-card"
    >
      <View style={styles.headerTitleRow}>
        <User size={20} color={primaryAccentColor} />
        <Text style={[styles.headerTitle, { color: colors.text, fontSize: Math.round(18 * fontScale) }]}>
          Seus Dados Cadastrais
        </Text>
      </View>

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
      </View>

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
      </View>

      <View style={styles.fieldGroup} id="caregiver-input">
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
          Usado apenas para cópia de lembretes e apoio de emergência.
        </Text>
      </View>

      <TouchableOpacity
        style={[styles.submitBtnPrimary, { backgroundColor: primaryAccentColor }]}
        onPress={onSave}
      >
        <Save size={18} color={colors.primaryContrast} />
        <Text style={[styles.submitBtnPrimaryText, { color: colors.primaryContrast, fontSize: Math.round(15 * fontScale) }]}>
          Salvar Informações Cadastrais
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  outerBox: {
    padding: 16,
    borderRadius: 12,
    gap: 14,
  },
  headerTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  headerTitle: {
    fontWeight: "bold",
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
    minHeight: 48,
    borderRadius: 6,
    borderWidth: 1,
    paddingHorizontal: 12,
    fontSize: 15,
  },
  subHint: {
    marginTop: 2,
  },
  submitBtnPrimary: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    minHeight: 52,
    borderRadius: 8,
    marginTop: 6,
  },
  submitBtnPrimaryText: {
    fontWeight: "bold",
  },
});
