import { z } from "zod";
import Location from "../services/location";

export const POST_LIMITS = {
  TITLE_MIN: 5,
  TITLE_MAX: 100,
  DESCRIPTION_MIN: 10,
  DESCRIPTION_MAX: 2000,
  LOCATION_MIN: 2,
  LOCATION_MAX: 100,
  PRICE_MIN: 0,
};

export const postSchema = z.object({
  title: z
    .string()
    .min(POST_LIMITS.TITLE_MIN, {
      message: `Le titre doit contenir au moins ${POST_LIMITS.TITLE_MIN} caractères`,
    })
    .max(POST_LIMITS.TITLE_MAX, {
      message: `Le titre ne peut pas dépasser ${POST_LIMITS.TITLE_MAX} caractères`,
    }),
  description: z
    .string()
    .min(POST_LIMITS.DESCRIPTION_MIN, {
      message: `La description doit contenir au moins ${POST_LIMITS.DESCRIPTION_MIN} caractères`,
    })
    .max(POST_LIMITS.DESCRIPTION_MAX, {
      message: `La description ne peut pas dépasser ${POST_LIMITS.DESCRIPTION_MAX} caractères`,
    }),
  price: z
    .string()
    .min(1, { message: "Le prix est requis" })
    .refine((val) => !isNaN(parseInt(val)), {
      message: "Le prix doit être un nombre",
    })
    .refine((val) => parseInt(val) >= POST_LIMITS.PRICE_MIN, {
      message: "Le prix doit être un nombre positif",
    })
    .transform((val) => parseInt(val)),
  location: z
    .string()
    .min(POST_LIMITS.LOCATION_MIN, {
      message: `La localisation doit contenir au moins ${POST_LIMITS.LOCATION_MIN} caractères`,
    })
    .max(POST_LIMITS.LOCATION_MAX, {
      message: `La localisation ne peut pas dépasser ${POST_LIMITS.LOCATION_MAX} caractères`,
    })
    .refine(async (location) => await Location.validateCity(location), {
      message: "Cette localisation n'existe pas ou n'est pas reconnue",
    }),
});
