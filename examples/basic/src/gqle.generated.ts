// @gqle/generated
import { Awaitable, Maybe, Resolvable } from "graphql-entity/prelude";
import { createEntityServer as baseCreateEntityServer } from "graphql-entity";
import { Query as _Query, Mutation as _Mutation } from "./default.generated";
import { Post as Post, CreatePostParameters } from "./entities/Post/post.generated";
import { User as User } from "./entities/User/user.generated";


/*
 * Entities
 */

export interface Entities {
  Query: _Query;
  Mutation: _Mutation;
  Post: Post;
  User: User;
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
