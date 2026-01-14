/**
 * Formatea un número como moneda en formato colombiano
 * @param value - El valor numérico a formatear
 * @returns String formateado como moneda (ej: "$1,234.56")
 */
export function formatCurrency(value: number | string | null | undefined): string {
    if (value === null || value === undefined || value === '') {
        return '$0';
    }

    const numValue = typeof value === 'string' ? parseFloat(value) : value;

    if (isNaN(numValue)) {
        return '$0';
    }

    return new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
    })
        .format(numValue)
        .replace('COP', '')
        .trim();
}

/**
 * Formatea un número con separadores de miles
 * @param value - El valor numérico a formatear
 * @param decimals - Número de decimales (por defecto 2)
 * @returns String formateado (ej: "1,234.56")
 */
export function formatNumber(value: number | string | null | undefined, decimals: number = 2): string {
    if (value === null || value === undefined || value === '') {
        return '0';
    }

    const numValue = typeof value === 'string' ? parseFloat(value) : value;

    if (isNaN(numValue)) {
        return '0';
    }

    return new Intl.NumberFormat('es-CO', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
    }).format(numValue);
}

/**
 * Formatea un porcentaje
 * @param value - El valor numérico a formatear
 * @param decimals - Número de decimales (por defecto 2)
 * @returns String formateado (ej: "12.50%")
 */
export function formatPercentage(value: number | string | null | undefined, decimals: number = 2): string {
    if (value === null || value === undefined || value === '') {
        return '0%';
    }

    const numValue = typeof value === 'string' ? parseFloat(value) : value;

    if (isNaN(numValue)) {
        return '0%';
    }

    return `${formatNumber(numValue, decimals)}%`;
}
