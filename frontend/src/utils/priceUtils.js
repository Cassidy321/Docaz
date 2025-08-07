export const formatPrice = (price) => {
  if (price === undefined || price === null) return "Prix non défini";

  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 0,
  }).format(price);
};
