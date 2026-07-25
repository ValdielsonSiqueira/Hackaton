import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { User, Mail, HeartHandshake, Save } from "lucide-react";
import { profileSchema } from "../../schemas/forms";

import { Avatar, AvatarFallback } from "../ui/avatar";

interface UserProfileFormProps {
  initialName: string;
  initialEmail: string;
  initialCaregiverContact: string;
  onSave: (data: { name: string; email: string; caregiverContact: string }) => void;
  onTriggerToast: (msg: string) => void;
}

export const UserProfileForm: React.FC<UserProfileFormProps> = ({
  initialName,
  initialEmail,
  initialCaregiverContact,
  onSave,
  onTriggerToast,
}) => {
  const [nameInput, setNameInput] = useState(initialName);
  const [emailInput, setEmailInput] = useState(initialEmail);
  const [caregiverContact, setCaregiverContact] = useState(initialCaregiverContact);

  const [nameErrorMsg, setNameErrorMsg] = useState<string | null>(null);
  const [emailErrorMsg, setEmailErrorMsg] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setNameErrorMsg(null);
    setEmailErrorMsg(null);

    const result = profileSchema.safeParse({
      name: nameInput,
      email: emailInput,
      caregiverContact,
    });

    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;
      if (fieldErrors.name?.[0]) setNameErrorMsg(fieldErrors.name[0]);
      if (fieldErrors.email?.[0]) setEmailErrorMsg(fieldErrors.email[0]);
      onTriggerToast("⚠️ Por favor, corrija os campos indicados");
      return;
    }

    onSave({
      name: result.data.name,
      email: result.data.email,
      caregiverContact: result.data.caregiverContact || "",
    });
    onTriggerToast("Informações do perfil salvas com sucesso!");
  };

  return (
    <Card className="login-card p-6" id="user-profile-card">
      <CardHeader className="p-0 mb-6">
        <div className="flex items-center gap-4">
          <Avatar className="w-16 h-16 shrink-0">
            <AvatarFallback className="text-2xl bg-[#0f62fe] text-white font-semibold">
              {(nameInput || "U").charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-2xl font-normal">{nameInput || "Estudante"}</CardTitle>
            <CardDescription className="text-[#525252]">Estudante SeniorEase — FIAP Inclusive</CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className={`form-group ${nameErrorMsg ? "error" : ""}`} id="fg-user-name">
            <label htmlFor="user-name-input" className="flex items-center gap-2 mb-2 font-semibold text-[var(--ink)]">
              <User className="w-4 h-4 text-[var(--primary)]" /> Seu Nome Completo
            </label>
            <Input
              id="user-name-input"
              value={nameInput}
              onChange={(e) => {
                setNameInput(e.target.value);
                if (nameErrorMsg) setNameErrorMsg(null);
              }}
              placeholder="Seu nome completo"
              required
              aria-required="true"
              aria-invalid={Boolean(nameErrorMsg)}
              aria-describedby={nameErrorMsg ? "name-error-msg" : undefined}
            />
            {!nameErrorMsg && <p className="form-helper">Como deseja ser chamado no sistema</p>}
            {nameErrorMsg && <p className="form-error-msg" id="name-error-msg" role="alert">{nameErrorMsg}</p>}
          </div>

          <div className={`form-group ${emailErrorMsg ? "error" : ""}`} id="fg-user-email">
            <label htmlFor="user-email-input" className="flex items-center gap-2 mb-2 font-semibold text-[var(--ink)]">
              <Mail className="w-4 h-4 text-[var(--primary)]" /> Seu E-mail
            </label>
            <Input
              id="user-email-input"
              type="email"
              value={emailInput}
              onChange={(e) => {
                setEmailInput(e.target.value);
                if (emailErrorMsg) setEmailErrorMsg(null);
              }}
              placeholder="seu.email@exemplo.com"
              required
              aria-required="true"
              aria-invalid={Boolean(emailErrorMsg)}
              aria-describedby={emailErrorMsg ? "email-error-msg" : undefined}
            />
            {!emailErrorMsg && <p className="form-helper">Seu e-mail de acesso e notificações</p>}
            {emailErrorMsg && <p className="form-error-msg" id="email-error-msg" role="alert">{emailErrorMsg}</p>}
          </div>

          <div className="form-group pt-2">
            <label htmlFor="caregiver-input" className="flex items-center gap-2 mb-2 font-semibold text-[var(--ink)]">
              <HeartHandshake className="w-4 h-4 text-[var(--primary)]" /> E-mail ou Telefone do Cuidador / Familiar (Opcional)
            </label>
            <Input
              id="caregiver-input"
              value={caregiverContact}
              onChange={(e) => setCaregiverContact(e.target.value)}
              placeholder="Ex: Maria (Filha) - (11) 99999-8888"
            />
            <p className="form-helper">Usado apenas para cópia de lembretes e apoio de emergência (deixe em branco se não houver).</p>
          </div>

          <div className="pt-2">
            <Button
              type="submit"
              variant="primary"
              className="w-full flex items-center justify-center gap-2"
            >
              <Save className="w-5 h-5" /> Salvar Informações Cadastrais
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
