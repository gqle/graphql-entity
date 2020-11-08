// @gqle/generated
import { Maybe, Awaitable } from "graphql-entity/prelude";
import { User } from "../../User/__generated__/index";


/*
 * Definitions
 */

export interface Post {
  author: User;
}


/*
 * Entities
 */

export type PostEntity = Post



/*
 * RootExtensions
 */

export interface RootExtensions {
  randomPost(): Awaitable<Maybe<Post>>;
}

