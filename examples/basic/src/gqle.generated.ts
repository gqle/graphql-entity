// @gqle/generated
import { Awaitable, Maybe, Resolvable } from "graphql-entity/prelude";
import { createEntityServer as baseCreateEntityServer } from "graphql-entity";
import { Post as Post, CreatePostParameters } from "./entities/Post/post.generated";
import { User as User } from "./entities/User/user.generated";
import { Query as _Query, Mutation as _Mutation } from "./entities/default.generated";


/*
 * Entities
 */

export interface Entities {
  Post: Post;
  User: User;
  Query: _Query;
  Mutation: _Mutation;
}

/*
 * Root
 */

export interface Root {
  randomPost: Resolvable<Maybe<Post>>;
  createPost: Resolvable<Maybe<Post>, CreatePostParameters>;
}

/*
 * Aliases
 */

export type RootEntity = Root

/*
 * Server
 */

export const createEntityServer = (opts: { root: RootEntity }) =>
  baseCreateEntityServer<RootEntity>(opts);
