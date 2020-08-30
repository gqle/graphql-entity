import { createEntityServer, QueryEntity } from './__generated__'
import { Post } from './entities/Post'
import { User } from './entities/User'

export class Query implements QueryEntity {
  randomPost() {
    const author = new User('Random')
    return new Post({ author })
  }
}

export const server = createEntityServer({ Query: new Query() })
