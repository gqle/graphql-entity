export const capitalizeInitial = (str: string) => `${str.slice(0, 1).toUpperCase()}${str.slice(1)}`

export const withoutLastNewline = (str: string) => str.slice(0, -1)
