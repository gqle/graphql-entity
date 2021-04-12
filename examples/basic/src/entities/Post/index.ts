import { PostEntity } from './post.generated'
import { User } from '../User'

interface PostOptions {
  author: User
}

export class Post implements PostEntity {
  author: User

  constructor({ author }: PostOptions) {
    this.author = author
  }
}
