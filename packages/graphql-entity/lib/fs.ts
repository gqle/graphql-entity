import { promises as fs, constants } from 'fs'
import { AbsolutePath } from './path'

export const ensureDirectory = async (directory: AbsolutePath): Promise<void> => {
  try {
    await fs.access(directory.path, constants.F_OK)
  } catch {
    await fs.mkdir(directory.path)
  }
}

export const readFileToString = (filePath: AbsolutePath): Promise<string> => {
  return fs.readFile(filePath.path).then((buf) => buf.toString())
}

export const writeStringToFile = (filePath: AbsolutePath, contents: string): Promise<void> => {
  return fs.writeFile(filePath.path, contents)
}
