import { PostEntity } from './__generated__'
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
