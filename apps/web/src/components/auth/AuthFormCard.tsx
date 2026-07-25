import React, { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../ui/card";
import { ArrowRight, UserPlus, UserCheck } from "lucide-react";
import { loginSchema, registerSchema } from "../../schemas/forms";
import { AccessibilityTip } from "./AccessibilityTip";
import { useHelp } from "../../context/HelpContext";

interface AuthFormCardProps {
  initialName?: string;
  initialEmail?: string;
  onSuccess: (data: { name?: string; email: string }) => void;
}

export const AuthFormCard: React.FC<AuthFormCardProps> = ({
  initialName = "João da Silva",
  initialEmail = "joao@exemplo.com",
  onSuccess,
}) => {
  const { openHelpModal } = useHelp();
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [name, setName] = useState(initialName);
  const [email, setEmail] = useState(initialEmail);
  const [password, setPassword] = useState("12345678");

  const [nameErrorMsg, setNameErrorMsg] = useState<string | null>(null);
  const [emailErrorMsg, setEmailErrorMsg] = useState<string | null>(null);
  const [passwordErrorMsg, setPasswordErrorMsg] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setNameErrorMsg(null);
    setEmailErrorMsg(null);
    setPasswordErrorMsg(null);

    if (isRegisterMode) {
      const result = registerSchema.safeParse({ name, email, password });
      if (!result.success) {
        const fieldErrors = result.error.flatten().fieldErrors;
        if (fieldErrors.name?.[0]) setNameErrorMsg(fieldErrors.name[0]);
        if (fieldErrors.email?.[0]) setEmailErrorMsg(fieldErrors.email[0]);
        if (fieldErrors.password?.[0]) setPasswordErrorMsg(fieldErrors.password[0]);
        return;
      }
      onSuccess({ name: result.data.name, email: result.data.email });
    } else {
      const result = loginSchema.safeParse({ email, password });
      if (!result.success) {
        const fieldErrors = result.error.flatten().fieldErrors;
        if (fieldErrors.email?.[0]) setEmailErrorMsg(fieldErrors.email[0]);
        if (fieldErrors.password?.[0]) setPasswordErrorMsg(fieldErrors.password[0]);
        return;
      }
      onSuccess({ email: result.data.email });
    }
  };

  const toggleMode = () => {
    setIsRegisterMode(!isRegisterMode);
    setNameErrorMsg(null);
    setEmailErrorMsg(null);
    setPasswordErrorMsg(null);
  };

  return (
    <Card className="bg-[var(--canvas)] border border-[var(--surface-2)] p-8 sm:p-10 rounded-lg shadow-sm w-full" id="login-card">
      <CardHeader className="p-0 mb-6">
        <CardTitle className="text-2xl font-normal text-[var(--ink)] mb-2" id="login-heading">
          {isRegisterMode ? "Criar sua conta" : "Bem-vindo de volta"}
        </CardTitle>
        <CardDescription className="text-sm text-[var(--ink-muted)] tracking-wide">
          {isRegisterMode
            ? "Preencha seus dados para começar a usar"
            : "Entre com seus dados para continuar"}
        </CardDescription>
      </CardHeader>

      <CardContent className="p-0">
        <form id="login-form" onSubmit={handleSubmit} noValidate className="space-y-5">
          {isRegisterMode && (
            <div className="relative" id="fg-name">
              <label htmlFor="name-input" className="block text-sm font-medium text-[var(--ink)] mb-2 tracking-wide">
                Seu nome completo
              </label>
              <Input
                type="text"
                id="name-input"
                name="name"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (nameErrorMsg) setNameErrorMsg(null);
                }}
                placeholder="Ex: João da Silva"
                autoComplete="name"
                required
                aria-required="true"
                className={`w-full h-14 bg-[var(--surface-1)] border-0 border-b ${nameErrorMsg ? "border-b-2 border-[var(--error)] focus:outline-[var(--error)]" : "border-[var(--ink-subtle)] focus:border-b-2 focus:border-[var(--primary)]"} px-4 text-base sm:text-lg text-[var(--ink)] placeholder:text-[var(--ink-subtle)] rounded-none transition-colors`}
              />
              {!nameErrorMsg && <p className="mt-1 text-xs text-[var(--ink-muted)]">Como você deseja ser chamado</p>}
              {nameErrorMsg && <p className="mt-1 text-xs text-[var(--error)] font-medium" role="alert">{nameErrorMsg}</p>}
            </div>
          )}

          <div className="relative" id="fg-email">
            <label htmlFor="email-input" className="block text-sm font-medium text-[var(--ink)] mb-2 tracking-wide">
              Seu e-mail
            </label>
            <Input
              type="email"
              id="email-input"
              name="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (emailErrorMsg) setEmailErrorMsg(null);
              }}
              placeholder="joao@exemplo.com"
              autoComplete="email"
              required
              aria-required="true"
              className={`w-full h-14 bg-[var(--surface-1)] border-0 border-b ${emailErrorMsg ? "border-b-2 border-[var(--error)] focus:outline-[var(--error)]" : "border-[var(--ink-subtle)] focus:border-b-2 focus:border-[var(--primary)]"} px-4 text-base sm:text-lg text-[var(--ink)] placeholder:text-[var(--ink-subtle)] rounded-none transition-colors`}
            />
            {!emailErrorMsg && <p className="mt-1 text-xs text-[var(--ink-muted)]">Use seu e-mail principal</p>}
            {emailErrorMsg && <p className="mt-1 text-xs text-[var(--error)] font-medium" role="alert">{emailErrorMsg}</p>}
          </div>

          <div className="relative" id="fg-password">
            <label htmlFor="password-input" className="block text-sm font-medium text-[var(--ink)] mb-2 tracking-wide">
              Sua senha
            </label>
            <Input
              type="password"
              id="password-input"
              name="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (passwordErrorMsg) setPasswordErrorMsg(null);
              }}
              placeholder="••••••••"
              autoComplete={isRegisterMode ? "new-password" : "current-password"}
              required
              aria-required="true"
              className={`w-full h-14 bg-[var(--surface-1)] border-0 border-b ${passwordErrorMsg ? "border-b-2 border-[var(--error)] focus:outline-[var(--error)]" : "border-[var(--ink-subtle)] focus:border-b-2 focus:border-[var(--primary)]"} px-4 text-base sm:text-lg text-[var(--ink)] placeholder:text-[var(--ink-subtle)] rounded-none transition-colors`}
            />
            {!passwordErrorMsg && <p className="mt-1 text-xs text-[var(--ink-muted)]">Mínimo 8 caracteres</p>}
            {passwordErrorMsg && <p className="mt-1 text-xs text-[var(--error)] font-medium" role="alert">{passwordErrorMsg}</p>}
          </div>

          <Button type="submit" variant="primary" id="login-submit-btn" className="w-full h-14 bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white font-medium text-base rounded-none flex items-center justify-center gap-2 transition-colors">
            {isRegisterMode ? (
              <>Criar e acessar minha conta <UserPlus className="w-5 h-5 ml-1" /></>
            ) : (
              <>Entrar na minha conta <ArrowRight className="w-5 h-5 ml-1" /></>
            )}
          </Button>
        </form>

        <Button
          type="button"
          variant="tertiary"
          id="register-btn"
          className="w-full h-14 mt-3 bg-[var(--canvas)] hover:bg-[var(--surface-1)] text-[var(--primary)] border border-[var(--primary)] font-medium text-base rounded-none flex items-center justify-center gap-2 transition-colors"
          onClick={toggleMode}
        >
          {isRegisterMode ? (
            <>Já tenho conta — Fazer login <UserCheck className="w-5 h-5 ml-1" /></>
          ) : (
            <>Criar minha conta <UserPlus className="w-5 h-5 ml-1" /></>
          )}
        </Button>

        <div className="flex items-center justify-between mt-5">
          <a
            type="button"
            onClick={openHelpModal}
            className="text-sm font-semibold text-[var(--primary)] hover:underline cursor-pointer border-0 bg-transparent p-0"
          >
            Preciso de ajuda
          </a>
        </div>

        <AccessibilityTip />
      </CardContent>
    </Card>
  );
};
