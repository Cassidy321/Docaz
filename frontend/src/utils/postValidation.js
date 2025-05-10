import { z } from "zod";

export const postSchema = z.object({
  title: z
    .string()
    .max(100, { message: "Le titre ne peut pas dépasser 100 caractères" }),
  description: z
    .string()
    .min(10, { message: "La description doit contenir au moins 10 caractères" })
    .max(2000, {
      message: "La description ne peut pas dépasser 2000 caractères",
    }),
  price: z
    .string()
    .min(1, { message: "Le prix est requis" })
    .refine((val) => !isNaN(parseInt(val)), {
      message: "Le prix doit être un nombre",
    })
    .refine((val) => parseInt(val) >= 0, {
      message: "Le prix doit être un nombre positif",
    })
    .transform((val) => parseInt(val)),
  location: z
    .string()
    .min(3, { message: "La localisation doit contenir au moins 3 caractères" })
    .max(100, {
      message: "La localisation ne peut pas dépasser 100 caractères",
    }),
});
