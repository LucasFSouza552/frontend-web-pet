export function saveStorage(key: string, token: string) {
    localStorage.setItem(key, token);
}

export function getStorage(key: string): string | null {
    return localStorage.getItem(key);
}

export function removeStorage(key: string) {
    localStorage.removeItem(key);
}