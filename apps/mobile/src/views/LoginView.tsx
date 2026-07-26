import React, { useState } from "react";
import { 
  StyleSheet, 
  Text, 
  View, 
  TextInput, 
  TouchableOpacity, 
  ScrollView 
} from "react-native";
import type { MobileThemeColors } from "../theme/mobileTheme";
import { UserPlus, ArrowRight, Settings } from "lucide-react-native";

interface LoginViewProps {
  theme: { colors: MobileThemeColors; fontScale: number };
  onLoginSuccess: (email: string, name?: string) => void;
  onOpenHelpModal: () => void;
  speakText?: (text: string) => void;
}

export const LoginView: React.FC<LoginViewProps> = ({
  theme,
  onLoginSuccess,
  onOpenHelpModal,
}) => {
  const { colors, fontScale } = theme;
  const isHighContrast = colors.mode === "high";

  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [name, setName] = useState("João da Silva");
  const [email, setEmail] = useState("valdielson.silva@gmail.com");
  const [password, setPassword] = useState("senha123456");

  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const heroBg = isHighContrast ? "#000000" : "#161616";
  const heroTextColor = isHighContrast ? colors.text : "#FFFFFF";
  const heroMutedColor = isHighContrast ? colors.textMuted : "#C6C6C6";
  const highlightBlueColor = isHighContrast ? colors.primary : "#0F62FE";

  const handleSubmit = () => {
    setEmailError(null);
    setPasswordError(null);

    if (!email.trim() || !email.includes("@")) {
      setEmailError("Por favor, digite seu e-mail de estudante (ex: nome@fiap.com.br)");
      return;
    }

    if (password.length < 6) {
      setPasswordError("Sua senha deve ter pelo menos 6 caracteres");
      return;
    }

    onLoginSuccess(email, isRegisterMode ? name : undefined);
  };

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      {/* Dark Hero Section (Replicating Web HeroSection 1:1 rounded-lg) */}
      <View
        style={[styles.heroCard, { backgroundColor: heroBg, borderColor: colors.border, borderWidth: isHighContrast ? 2 : 0 }]}
      >
        <Text style={[styles.badgeText, { color: isHighContrast ? colors.textMuted : "#A8A8A8" }]}>
          FIAP INCLUSIVE
        </Text>
        
        <Text style={[styles.heroTitle, { color: heroTextColor, fontSize: Math.round(30 * fontScale) }]}>
          Digital sem{"\n"}
          <Text style={{ color: highlightBlueColor, fontWeight: "bold" }}>complicação.</Text>
        </Text>

        <Text style={[styles.heroSubtitle, { color: heroMutedColor, fontSize: Math.round(14 * fontScale) }]}>
          O SeniorEase foi feito para você. Simples, claro e sempre do seu jeito.
        </Text>
      </View>

      {/* Auth Form Card (Replicating Web AuthFormCard 1:1 rounded-lg) */}
      <View
        style={[
          styles.authCard,
          { 
            backgroundColor: colors.card, 
            borderColor: isHighContrast ? colors.border : "#E0E0E0", 
            borderWidth: isHighContrast ? 2 : 1 
          },
        ]}
      >
        <Text style={[styles.formTitle, { color: colors.text, fontSize: Math.round(22 * fontScale) }]}>
          {isRegisterMode ? "Criar sua conta" : "Bem-vindo de volta"}
        </Text>
        <Text style={[styles.formSubTitle, { color: colors.textMuted, fontSize: Math.round(13 * fontScale) }]}>
          {isRegisterMode
            ? "Preencha seus dados para começar a usar"
            : "Entre com seus dados para continuar"}
        </Text>

        {isRegisterMode && (
          <View style={styles.fieldGroup}>
            <Text style={[styles.label, { color: colors.text, fontSize: Math.round(14 * fontScale) }]}>
              Seu nome completo
            </Text>
            <TextInput
              style={[
                styles.input,
                { backgroundColor: colors.surfaceSubtle, color: colors.text, borderColor: colors.border },
              ]}
              value={name}
              onChangeText={setName}
              placeholder="Ex: João da Silva"
              placeholderTextColor={colors.textMuted}
            />
          </View>
        )}

        {/* Email Field */}
        <View style={styles.fieldGroup}>
          <Text style={[styles.label, { color: colors.text, fontSize: Math.round(14 * fontScale) }]}>
            Seu e-mail
          </Text>
          <TextInput
            style={[
              styles.input,
              { backgroundColor: colors.surfaceSubtle, color: colors.text, borderColor: emailError ? colors.urgent : colors.border },
            ]}
            value={email}
            onChangeText={(t) => {
              setEmail(t);
              if (emailError) setEmailError(null);
            }}
            placeholder="valdielson.silva@gmail.com"
            placeholderTextColor={colors.textMuted}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <Text style={[styles.subHint, { color: colors.textMuted, fontSize: Math.round(11 * fontScale) }]}>
            Use seu e-mail principal
          </Text>
          {emailError && <Text style={[styles.errorMsg, { color: colors.urgent }]}>{emailError}</Text>}
        </View>

        {/* Password Field */}
        <View style={styles.fieldGroup}>
          <Text style={[styles.label, { color: colors.text, fontSize: Math.round(14 * fontScale) }]}>
            Sua senha
          </Text>
          <TextInput
            style={[
              styles.input,
              { backgroundColor: colors.surfaceSubtle, color: colors.text, borderColor: passwordError ? colors.urgent : colors.border },
            ]}
            value={password}
            onChangeText={(t) => {
              setPassword(t);
              if (passwordError) setPasswordError(null);
            }}
            placeholder="••••••••"
            placeholderTextColor={colors.textMuted}
            secureTextEntry
          />
          <Text style={[styles.subHint, { color: colors.textMuted, fontSize: Math.round(11 * fontScale) }]}>
            Mínimo 8 caracteres
          </Text>
          {passwordError && <Text style={[styles.errorMsg, { color: colors.urgent }]}>{passwordError}</Text>}
        </View>

        {/* Submit Primary Button */}
        <TouchableOpacity
          style={[styles.submitBtn, { backgroundColor: highlightBlueColor }]}
          onPress={handleSubmit}
        >
          <Text style={[styles.submitBtnText, { color: colors.primaryContrast, fontSize: Math.round(16 * fontScale) }]}>
            {isRegisterMode ? "Confirmar Cadastro" : "Entrar na minha conta"}
          </Text>
          <ArrowRight size={20} color={colors.primaryContrast} />
        </TouchableOpacity>

        {/* Toggle Mode Secondary Button */}
        <TouchableOpacity
          style={[styles.toggleBtn, { borderColor: highlightBlueColor }]}
          onPress={() => setIsRegisterMode(!isRegisterMode)}
        >
          {isRegisterMode ? (
            <Text style={[styles.toggleBtnText, { color: highlightBlueColor, fontSize: Math.round(14 * fontScale) }]}>
              Já tenho conta — Fazer login
            </Text>
          ) : (
            <>
              <Text style={[styles.toggleBtnText, { color: highlightBlueColor, fontSize: Math.round(14 * fontScale) }]}>
                Criar minha conta
              </Text>
              <UserPlus size={18} color={highlightBlueColor} />
            </>
          )}
        </TouchableOpacity>

        {/* Support Help Link */}
        <TouchableOpacity style={styles.helpLink} onPress={onOpenHelpModal}>
          <Text style={[styles.helpLinkText, { color: highlightBlueColor, fontSize: Math.round(14 * fontScale) }]}>
            Preciso de ajuda
          </Text>
        </TouchableOpacity>

        {/* Accessibility Tip Box (Matching Web 1:1) */}
        <View style={[styles.tipCard, { backgroundColor: colors.surfaceSubtle, borderLeftColor: highlightBlueColor }]}>
          <Settings size={20} color={highlightBlueColor} style={{ marginTop: 2 }} />
          <Text style={[styles.tipText, { color: colors.textMuted, fontSize: Math.round(12 * fontScale) }]}>
            <Text style={{ fontWeight: "bold", color: colors.text }}>Quer ajustar o tamanho do texto?</Text> Use os botões <Text style={{ fontWeight: "bold", color: colors.text }}>A-</Text> e <Text style={{ fontWeight: "bold", color: colors.text }}>A+</Text> no topo para personalizar sua visão.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 40,
    gap: 16,
  },
  heroCard: {
    padding: 24,
    borderRadius: 10,
    gap: 10,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 1.5,
    textTransform: "uppercase",
  },
  heroTitle: {
    fontWeight: "300",
    lineHeight: 38,
  },
  heroSubtitle: {
    lineHeight: 22,
    marginTop: 4,
  },
  authCard: {
    padding: 20,
    borderRadius: 10,
    gap: 14,
  },
  formTitle: {
    fontWeight: "normal",
  },
  formSubTitle: {
    marginTop: -8,
    marginBottom: 4,
  },
  fieldGroup: {
    gap: 4,
  },
  label: {
    fontWeight: "600",
  },
  subHint: {
    marginTop: 2,
  },
  input: {
    minHeight: 56,
    borderWidth: 0,
    borderBottomWidth: 2,
    borderRadius: 4,
    paddingHorizontal: 14,
    fontSize: 16,
  },
  errorMsg: {
    fontSize: 12,
    fontWeight: "bold",
    marginTop: 2,
  },
  submitBtn: {
    minHeight: 62,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 22,
    paddingVertical: 16,
    borderRadius: 8,
    marginTop: 10,
  },
  submitBtnText: {
    fontWeight: "bold",
  },
  toggleBtn: {
    minHeight: 56,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
    borderRadius: 8,
    borderWidth: 1.5,
  },
  toggleBtnText: {
    fontWeight: "bold",
  },
  helpLink: {
    alignSelf: "flex-start",
    paddingVertical: 4,
  },
  helpLinkText: {
    fontWeight: "500",
  },
  tipCard: {
    flexDirection: "row",
    gap: 10,
    padding: 12,
    borderRadius: 6,
    borderLeftWidth: 4,
    marginTop: 4,
  },
  tipText: {
    flex: 1,
    lineHeight: 18,
  },
});
