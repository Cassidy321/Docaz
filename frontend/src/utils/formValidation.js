import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, { message: "L'email est requis" })
    .email({ message: "Format d'email invalide" }),
  password: z.string().min(1, { message: "Le mot de passe est requis" }),
});

export const registerSchema = z
  .object({
    firstName: z
      .string()
      .min(1, { message: "Le prénom est requis" })
      .max(50, { message: "Le prénom est trop long" }),
    lastName: z
      .string()
      .min(1, { message: "Le nom est requis" })
      .max(50, { message: "Le nom est trop long" }),
    email: z
      .string()
      .min(1, { message: "L'email est requis" })
      .email({ message: "Format d'email invalide" }),
    password: z
      .string()
      .min(8, {
        message: "Le mot de passe doit contenir au moins 8 caractères",
      })
      .max(100, { message: "Le mot de passe est trop long" }),
    confirmPassword: z
      .string()
      .min(1, { message: "Veuillez confirmer votre mot de passe" }),
    acceptTerms: z.boolean().refine((val) => val === true, {
      message: "Vous devez accepter les conditions d'utilisation",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
  });
