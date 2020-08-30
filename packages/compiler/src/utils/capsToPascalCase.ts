export const capsToPascalCase = (input: string): string => {
  return input
    .split('_')
    .map((str) => `${str[0].toUpperCase()}${str.slice(1).toLowerCase()}`)
    .join('')
}
