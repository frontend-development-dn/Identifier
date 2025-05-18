export function checkNumber(value: any, onError: number = -1): number | null {
    const parsed = parseInt(value);
    return isNaN(parsed) && onError === -1 ? null :
        isNaN(parsed) && onError !== -1 ? onError :
        parsed;
}