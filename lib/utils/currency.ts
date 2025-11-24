/**
 * Format a number as CFA currency
 * @param amount - The amount to format
 * @returns Formatted currency string
 */
export function formatCFA(amount: number): string {
  return `${amount.toLocaleString("fr-FR", { minimumFractionDigits: 0, maximumFractionDigits: 0 })} FCFA`
}

/**
 * Parse CFA currency string to number
 * @param cfaString - The CFA string to parse
 * @returns Parsed number
 */
export function parseCFA(cfaString: string): number {
  return Number.parseFloat(cfaString.replace(/[^\d.]/g, ""))
}
