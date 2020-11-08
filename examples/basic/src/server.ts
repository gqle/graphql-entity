import { createEntityServer, RootEntity } from './__generated__'
import { Post } from './entities/Post'
import { User } from './entities/User'
import { CreatePostParameters } from './entities/Post/__generated__'

export class Root implements RootEntity {
  /*
   * Queries
   */
  randomPost() {
    const author = new User('Random')
    return new Post({ author })
  }

  /*
   * Mutations
   */
  createPost(parameters: CreatePostParameters) {
    const author = new User(parameters.author.name)
    return new Post({ author })
  }
}

export const server = createEntityServer({ root: new Root() })
