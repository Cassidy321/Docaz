import { z } from "zod";

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, "L'email est requis")
    .email("L'adresse email n'est pas valide"),
});

export const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, "Le mot de passe doit contenir au moins 8 caractères")
      .regex(/[a-z]/, "Le mot de passe doit contenir au moins une minuscule")
      .regex(/[A-Z]/, "Le mot de passe doit contenir au moins une majuscule")
      .regex(/\d/, "Le mot de passe doit contenir au moins un chiffre"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
  });

export const passwordErrors = {
  required: "Ce champ est requis",
  emailInvalid: "L'adresse email n'est pas valide",
  passwordTooShort: "Le mot de passe doit contenir au moins 8 caractères",
  passwordWeak: "Le mot de passe ne respecte pas les critères de sécurité",
  passwordMismatch: "Les mots de passe ne correspondent pas",
  serverError: "Une erreur est survenue. Veuillez réessayer.",
  networkError: "Impossible de contacter le serveur. Vérifiez votre connexion.",
  tokenInvalid: "Ce lien de réinitialisation est invalide ou a expiré",
  tokenExpired: "Ce lien de réinitialisation a expiré",
};
