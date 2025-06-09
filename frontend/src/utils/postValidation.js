import { z } from "zod";

const validateCity = async (location) => {
  try {
    const response = await fetch(
      `https://geo.api.gouv.fr/communes?nom=${encodeURIComponent(location)}&fields=nom&format=json&limit=1`
    );
    const data = await response.json();
    
    const exactMatch = data.some(commune => 
      commune.nom.toLowerCase() === location.toLowerCase()
    );
    
    return exactMatch;
  } catch (error) {
    console.error('Erreur validation ville:', error);
    return true;
  }
};

export const postSchema = z.object({
  title: z
    .string()
    .min(5, { message: "Le titre doit contenir au moins 5 caractères" })
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
    .min(2, { message: "La localisation doit contenir au moins 2 caractères" })
    .max(100, {
      message: "La localisation ne peut pas dépasser 100 caractères",
    })
    .refine(async (location) => await validateCity(location), {
      message: "Cette localisation n'existe pas ou n'est pas reconnue",
    }),
});