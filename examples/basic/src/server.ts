import { createEntityServer, RootEntity } from './__generated__'
import { Post } from './entities/Post'
import { User } from './entities/User'

export class Root implements RootEntity {
  /*
   * Queries
   */
  randomPost() {
    const author = new User('Random')
    return new Post({ author })
  }
}

export const server = createEntityServer({ root: new Root() })
