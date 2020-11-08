import { dirname } from 'path'
import { AbsolutePath } from '../../lib/path'
import { unique } from '../utils/unique'
import { capsToPascalCase } from '../utils/capsToPascalCase'
import { withoutLastNewline } from '../../lib/string'

export interface TSImport {
  path: AbsolutePath | string
  name: string
  isDefault?: boolean
  alias?: string
}

export interface TSInterface {
  name: string
  values: [string, string][]
  comment?: string
}

export interface TSEnum {
  name: string
  members: [key: string, value: string][]
}

export class TSFileSection {
  public name: string
  public interfaces: TSInterface[] = []
  public enums: TSEnum[] = []
  public raw: string[] = []

  constructor({ name }: { name: string }) {
    this.name = name
  }

  addEnum(tsEnum: TSEnum) {
    this.enums.push(tsEnum)
  }

  addInterface(tsInterface: TSInterface) {
    this.interfaces.push(tsInterface)
  }

  addRaw(raw: string) {
    this.raw.push(raw)
  }

  write(): string {
    let result = ''

    result += `\n/*\n * ${this.name}\n */\n\n`

    for (const { name, members } of this.enums) {
      result += `export enum ${name} {\n`
      for (const [key, value] of members) {
        result += `  ${capsToPascalCase(key)} = ${value},\n`
      }
      result += `}\n\n`
    }

    for (const { name, values, comment } of this.interfaces) {
      if (comment) {
        result += `// ${comment}\n`
      }
      result += `export interface ${name} {\n`
      for (const [key, value] of values) {
        result += `  ${key}: ${value};\n`
      }
      result += `}\n\n`
    }

    for (const raw of this.raw) {
      result += `${raw}\n\n`
    }

    result = withoutLastNewline(result)

    return result
  }
}

export class TSFile {
  public readonly filepath: AbsolutePath
  private imports: TSImport[] = []
  private sections: TSFileSection[] = []

  public constructor({ filepath }: { filepath: AbsolutePath }) {
    this.filepath = filepath
  }

  public isAtPath(filepath: AbsolutePath): boolean {
    return this.filepath.path === filepath.path
  }

  public addImport(tsImport: TSImport) {
    this.imports.push(tsImport)
  }

  public section(name: string): TSFileSection {
    let section = this.sections.find((s) => s.name === name)

    if (!section) {
      section = new TSFileSection({ name })
      this.sections.push(section)
    }

    return section
  }

  public writeImports(): string {
    let result = ''

    const froms = unique(this.imports.map((i) => i.path))

    for (const from of froms) {
      const path = from instanceof AbsolutePath ? this.importPath(from) : from

      const imports = this.imports.filter((i) => i.path === from)
      const defaultImports = imports.filter((i) => i.isDefault)
      const nonDefaultImports = imports.filter((i) => !i.isDefault)

      if (defaultImports.length) {
        const [defaultImport] = defaultImports
        if (defaultImport.alias) {
          result += `import default as ${defaultImport.alias} from "${path}";\n`
        } else {
          result += `import default from "${path}";\n`
        }
      }

      if (nonDefaultImports.length) {
        const names = nonDefaultImports
          .map((i) => (i.alias ? `${i.name} as ${i.alias}` : i.name))
          .join(', ')
        result += `import { ${names} } from "${path}";\n`
      }
    }

    return result
  }

  public write(): string {
    // write imports
    let result = '// @gqle/generated\n'

    result += this.writeImports()

    result += '\n'

    for (const section of this.sections) {
      result += section.write()
    }

    return result
  }

  private importPath(path: AbsolutePath): string {
    let result = AbsolutePath.from(dirname(this.filepath.path)).pathTo(path).path

    if (result.endsWith('.ts')) {
      result = result.slice(0, -3)
    }

    return result
  }
}
