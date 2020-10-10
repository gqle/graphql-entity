// @gqle/generated
import { Maybe, Awaitable } from "@gqle/graphql-entity/dist/prelude";
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
 * Extensions
 */

export interface Extensions {
  randomPost(): Awaitable<Maybe<Post>>;
}

