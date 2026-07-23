import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { TopNav } from "../components/layout/TopNav";
import { useApp } from "../context/AppContext";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../components/ui/card";
import { ArrowRight, Settings, ZoomIn, ListTodo, ShieldCheck, UserCheck, UserPlus } from "lucide-react";
import { loginSchema, registerSchema } from "../schemas/forms";

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { updateUserProfile, userProfile } = useApp();

  useEffect(() => {
    if (userProfile.isAuthenticated) {
      navigate("/dashboard", { replace: true });
    }
  }, [userProfile.isAuthenticated, navigate]);
  
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [name, setName] = useState(userProfile.name || "João da Silva");
  const [email, setEmail] = useState(userProfile.email || "joao@exemplo.com");
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

      updateUserProfile({
        name: result.data.name,
        email: result.data.email,
        isAuthenticated: true,
      });
      navigate("/dashboard");
    } else {
      const result = loginSchema.safeParse({ email, password });
      if (!result.success) {
        const fieldErrors = result.error.flatten().fieldErrors;
        if (fieldErrors.email?.[0]) setEmailErrorMsg(fieldErrors.email[0]);
        if (fieldErrors.password?.[0]) setPasswordErrorMsg(fieldErrors.password[0]);
        return;
      }

      updateUserProfile({
        email: result.data.email,
        isAuthenticated: true,
      });
      navigate("/dashboard");
    }
  };

  const toggleMode = () => {
    setIsRegisterMode(!isRegisterMode);
    setNameErrorMsg(null);
    setEmailErrorMsg(null);
    setPasswordErrorMsg(null);
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <TopNav />

      <main style={{ flex: 1 }}>
        {/* Hero Section */}
        <section className="hero" aria-labelledby="hero-heading">
          <div className="hero-inner">
            {/* Left Column */}
            <div className="hero-text">
              <p className="hero-eyebrow">FIAP Inclusive</p>
              <h1 className="hero-title" id="hero-heading">
                Digital sem<br />
                <strong>complicação.</strong>
              </h1>
              <p className="hero-sub">
                O SeniorEase foi feito para você. Simples, claro e sempre do seu jeito.
              </p>
            </div>

            {/* Right Column: Shadcn Card Login */}
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

                <div className="a11y-notice" role="complementary" aria-label="Dica de acessibilidade">
                  <Settings className="w-6 h-6 text-[#0f62fe] shrink-0" aria-hidden="true" />
                  <p>
                    <strong>Quer ajustar o tamanho do texto?</strong><br />
                    Use os botões <strong>A-</strong> e <strong>A+</strong> no topo para personalizar sua visão.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Features Section */}
        <section className="features-section" aria-labelledby="features-heading">
          <div style={{ maxWidth: "1080px", margin: "0 auto" }}>
            <p className="section-label">Por que o SeniorEase</p>
            <h2 id="features-heading">Feito para a sua vida</h2>
            <p>Tudo que você precisa, sem nada que atrapalhe.</p>

            <div className="feature-grid" role="list">
              <Card className="feature-card">
                <ZoomIn className="w-8 h-8 text-[#0f62fe] mb-4" aria-hidden="true" />
                <h3>Texto do seu tamanho</h3>
                <p>Ajuste o tamanho das letras com um toque. A plataforma lembra sua preferência sempre que você entrar.</p>
              </Card>
              <Card className="feature-card">
                <ListTodo className="w-8 h-8 text-[#0f62fe] mb-4" aria-hidden="true" />
                <h3>Tarefas simplificadas</h3>
                <p>Organize seu dia com passos claros e guiados. Nunca mais esqueça uma atividade importante.</p>
              </Card>
              <Card className="feature-card">
                <ShieldCheck className="w-8 h-8 text-[#0f62fe] mb-4" aria-hidden="true" />
                <h3>Segurança em cada clique</h3>
                <p>Antes de qualquer ação importante, a plataforma sempre pede sua confirmação. Sem surpresas.</p>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Banner */}
        <div className="cta-banner" role="complementary">
          <h2>Pronto para começar sua jornada digital com segurança?</h2>
          <Button variant="ctaInverse" onClick={() => navigate("/dashboard")}>
            Acessar minha conta <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </main>

      {/* Footer */}
      <footer className="footer" role="contentinfo">
        <span className="footer-logo">Senior<span>Ease</span></span>
        <p>© 2025 SeniorEase — FIAP Inclusive — Todos os direitos reservados</p>
      </footer>
    </div>
  );
};
