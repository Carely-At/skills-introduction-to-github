/**
 * Génère un CampusID unique basé sur le rôle de l'utilisateur
 * Format:
 * - Client: CLI-XXXXXX (6 chiffres)
 * - Vendor: VEN-XXXXXX (6 chiffres)
 * - Delivery: DEL-XXXXXX (6 chiffres)
 * - Admin: ADM-XXXXXX (6 chiffres)
 */
export function generateCampusId(role: "client" | "vendor" | "delivery" | "admin"): string {
  const prefixes = {
    client: "CLI",
    vendor: "VEN",
    delivery: "DEL",
    admin: "ADM",
  }

  const prefix = prefixes[role]
  const randomNumber = Math.floor(100000 + Math.random() * 900000) // 6 chiffres
  const timestamp = Date.now().toString().slice(-3) // 3 derniers chiffres du timestamp

  return `${prefix}-${randomNumber}${timestamp}`
}

/**
 * Vérifie si une chaîne est un CampusID valide
 */
export function isCampusId(input: string): boolean {
  const campusIdRegex = /^(CLI|VEN|DEL|ADM)-\d{9}$/
  return campusIdRegex.test(input)
}

/**
 * Extrait le rôle d'un CampusID
 */
export function getRoleFromCampusId(campusId: string): string | null {
  const roleMap: { [key: string]: string } = {
    CLI: "client",
    VEN: "vendor",
    DEL: "delivery",
    ADM: "admin",
  }

  const prefix = campusId.split("-")[0]
  return roleMap[prefix] || null
}
