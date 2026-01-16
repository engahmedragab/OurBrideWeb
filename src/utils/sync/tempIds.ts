// Shared temp ID helpers for planning books
// Use negative IDs for new entities to preserve backend mapping

export const generateTempId = (): number => -Math.floor(Date.now() + Math.random() * 1000)

export const isTempId = (id?: number | null): boolean => typeof id === 'number' && id < 0
