export const formatPostDate = (date) => {
  if (!date) return "Date non disponible";

  const postDate = new Date(date);

  if (isNaN(postDate.getTime())) {
    return "Date non disponible";
  }

  const now = new Date();
  const startOfToday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  );
  const startOfPostDate = new Date(
    postDate.getFullYear(),
    postDate.getMonth(),
    postDate.getDate()
  );
  const diffInDays = Math.floor(
    (startOfToday - startOfPostDate) / (1000 * 60 * 60 * 24)
  );
  const timeString = postDate.toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
  });

  if (diffInDays === 0) {
    return `Aujourd'hui à ${timeString}`;
  } else if (diffInDays === 1) {
    return `Hier à ${timeString}`;
  } else {
    return postDate.toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  }
};
