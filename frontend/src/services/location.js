class Location {
  static baseUrl = "https://geo.api.gouv.fr/communes";

  static cache = new Map();

  /**
   * @param {string} query
   * @param {number} limit
   * @returns {Promise<Array>}
   */
  static async searchCities(query, limit = 8) {
    if (query.length < 2) return [];

    const cacheKey = `search_${query.toLowerCase()}_${limit}`;
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    try {
      const response = await fetch(
        `${this.baseUrl}?nom=${encodeURIComponent(
          query
        )}&fields=nom,departement&format=json&boost=population&limit=${limit}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      const suggestions = data.map((commune) => ({
        name: commune.nom,
        department: commune.departement?.nom || "",
        displayName: `${commune.nom}${
          commune.departement ? ", " + commune.departement.nom : ""
        }`,
      }));

      this.cache.set(cacheKey, suggestions);
      setTimeout(() => this.cache.delete(cacheKey), 5 * 60 * 1000);

      return suggestions;
    } catch (error) {
      console.error("Erreur lors de la recherche de villes:", error);
      return [];
    }
  }

  /**
   * @param {string} cityName
   * @returns {Promise<boolean>}
   */
  static async validateCity(cityName) {
    if (!cityName?.trim()) return false;

    const cacheKey = `validate_${cityName.toLowerCase()}`;
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    try {
      const response = await fetch(
        `${this.baseUrl}?nom=${encodeURIComponent(
          cityName
        )}&fields=nom&format=json&boost=population&limit=20`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      const isValid = data.some(
        (commune) => commune.nom.toLowerCase() === cityName.toLowerCase()
      );

      this.cache.set(cacheKey, isValid);
      setTimeout(() => this.cache.delete(cacheKey), 10 * 60 * 1000);

      return isValid;
    } catch (error) {
      console.error("Erreur validation ville:", error);
      return true;
    }
  }

  static clearCache() {
    this.cache.clear();
  }

  static getCacheSize() {
    return this.cache.size;
  }
}

export default Location;
