// @gqle/generated
import { Awaitable, Maybe, Resolvable } from "graphql-entity/prelude";
import { User } from "../../User/__generated__/index";


/*
 * Definitions
 */

// Input
export interface CreatePostAuthorInput {
  name: string;
}

export interface Post {
  author: Resolvable<User>;
}

/*
 * Entities
 */

export type PostEntity = Post


/*
 * RootExtensions
 */

export interface CreatePostParameters {
  author: CreatePostAuthorInput;
}

export interface RootExtensions {
  randomPost: Resolvable<Maybe<Post>>;
  createPost: Resolvable<Maybe<Post>, CreatePostParameters>;
}
