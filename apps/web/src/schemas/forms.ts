import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Por favor, digite seu e-mail")
    .email("Insira um e-mail válido (ex: joao@exemplo.com)"),
  password: z
    .string()
    .min(1, "Por favor, digite sua senha")
    .min(8, "Senha muito curta — use ao menos 8 caracteres"),
});

export type LoginFormData = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Por favor, digite seu nome completo"),
  email: z
    .string()
    .min(1, "Por favor, digite seu e-mail")
    .email("Insira um e-mail válido (ex: joao@exemplo.com)"),
  password: z
    .string()
    .min(1, "Por favor, digite sua senha")
    .min(8, "Senha muito curta — use ao menos 8 caracteres"),
});

export type RegisterFormData = z.infer<typeof registerSchema>;

export const taskSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Insira um nome para a atividade (ex: Ler capítulo 5)"),
  category: z.string().default("ACADÊMICO"),
  priority: z.enum(["high", "medium", "low"]).default("medium"),
  duePreset: z.string().default("HOJE 18:00"),
});

export type TaskFormData = z.infer<typeof taskSchema>;

export const profileSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Insira seu nome completo"),
  email: z
    .string()
    .min(1, "Por favor, digite seu e-mail")
    .email("Insira um e-mail válido (ex: joao@exemplo.com)"),
  caregiverContact: z.string().optional(),
});

export type ProfileFormData = z.infer<typeof profileSchema>;
