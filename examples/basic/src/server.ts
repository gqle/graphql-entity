import { createEntityServer, RootEntity } from './gqle.generated'
import { Post } from './entities/Post'
import { User } from './entities/User'
import { CreatePostParameters } from './entities/Post/post.generated'

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
