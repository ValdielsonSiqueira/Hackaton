import React, { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../ui/card";
import { ArrowRight, UserPlus, UserCheck } from "lucide-react";
import { loginSchema, registerSchema } from "../../schemas/forms";
import { AccessibilityTip } from "./AccessibilityTip";

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
    <Card className="login-card" id="login-card">
      <CardHeader className="p-0 mb-4">
        <CardTitle id="login-heading">
          {isRegisterMode ? "Criar sua conta" : "Bem-vindo de volta"}
        </CardTitle>
        <CardDescription className="card-sub">
          {isRegisterMode
            ? "Preencha seus dados para começar a usar"
            : "Entre com seus dados para continuar"}
        </CardDescription>
      </CardHeader>

      <CardContent className="p-0">
        <form id="login-form" onSubmit={handleSubmit} noValidate>
          {isRegisterMode && (
            <div className={`form-group ${nameErrorMsg ? "error" : ""}`} id="fg-name">
              <label htmlFor="name-input">Seu nome completo</label>
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
              />
              {!nameErrorMsg && <p className="form-helper">Como você deseja ser chamado</p>}
              {nameErrorMsg && <p className="form-error-msg" role="alert">{nameErrorMsg}</p>}
            </div>
          )}

          <div className={`form-group ${emailErrorMsg ? "error" : ""}`} id="fg-email">
            <label htmlFor="email-input">Seu e-mail</label>
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
            />
            {!emailErrorMsg && <p className="form-helper">Use seu e-mail principal</p>}
            {emailErrorMsg && <p className="form-error-msg" role="alert">{emailErrorMsg}</p>}
          </div>

          <div className={`form-group ${passwordErrorMsg ? "error" : ""}`} id="fg-password">
            <label htmlFor="password-input">Sua senha</label>
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
            />
            {!passwordErrorMsg && <p className="form-helper">Mínimo 8 caracteres</p>}
            {passwordErrorMsg && <p className="form-error-msg" role="alert">{passwordErrorMsg}</p>}
          </div>

          <Button type="submit" variant="primary" id="login-submit-btn" className="w-full">
            {isRegisterMode ? (
              <>Criar e acessar minha conta <UserPlus className="w-5 h-5 ml-2" /></>
            ) : (
              <>Entrar na minha conta <ArrowRight className="w-5 h-5 ml-2" /></>
            )}
          </Button>
        </form>

        <Button
          type="button"
          variant="tertiary"
          id="register-btn"
          className="w-full mt-3"
          onClick={toggleMode}
        >
          {isRegisterMode ? (
            <>Já tenho conta — Fazer login <UserCheck className="w-5 h-5 ml-2" /></>
          ) : (
            <>Criar minha conta <UserPlus className="w-5 h-5 ml-2" /></>
          )}
        </Button>

        <div className="link-row">
          <a href="#forgot" onClick={(e) => { e.preventDefault(); alert("Enviamos as instruções para o seu e-mail!"); }}>
            Esqueci minha senha
          </a>
          <a href="#help" onClick={(e) => { e.preventDefault(); alert("Suporte 24h SeniorEase: 0800 700 8000"); }}>
            Preciso de ajuda
          </a>
        </div>

        <AccessibilityTip />
      </CardContent>
    </Card>
  );
};
