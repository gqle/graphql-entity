import * as path from 'path'

export function relative(from: AbsolutePath, to: AbsolutePath): RelativePath {
  return RelativePath.from(path.relative(from.path, to.path))
}

export function resolve(base: AbsolutePath, to: Path): AbsolutePath {
  return AbsolutePath.from(path.resolve(base.path, to.path))
}

export class Path {
  public path: string

  protected constructor({ path }: { path: string }) {
    this.path = path
  }

  static from(path: string) {
    return new Path({ path })
  }
}

export class RelativePath extends Path {
  protected type: 'relative' = 'relative'

  static from(path: string) {
    return new RelativePath({ path })
  }

  resolve(base: AbsolutePath): AbsolutePath {
    return resolve(base, this)
  }
}

export class AbsolutePath extends Path {
  protected type: 'absolute' = 'absolute'

  static from(path: string) {
    return new AbsolutePath({ path })
  }

  resolveTo(to: Path): AbsolutePath {
    return resolve(this, to)
  }

  pathTo(to: AbsolutePath): RelativePath {
    return relative(this, to)
  }

  pathFrom(from: AbsolutePath): RelativePath {
    return relative(from, this)
  }
}
