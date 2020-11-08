import { AbsolutePath } from '../../lib/path'
import { TSFile } from './TSFile'

export class TSWriter {
  public files: TSFile[] = []

  private constructor() {}

  static create() {
    return new TSWriter()
  }

  public file(filepath: AbsolutePath): TSFile {
    let file = this.files.find((file) => file.isAtPath(filepath))

    if (!file) {
      file = new TSFile({ filepath })
      this.files.push(file)
    }

    return file
  }
}
