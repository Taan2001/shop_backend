export function isIntegerStringRegex(str: string): boolean {
    return /^[+-]?\d+$/.test(str.trim());
}
