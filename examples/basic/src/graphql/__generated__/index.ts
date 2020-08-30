// @gqle/generated
import { Awaitable, Maybe } from "@gqle/graphql-entity/dist/prelude";
import { createEntityServer as baseCreateEntityServer } from "@gqle/graphql-entity";
import { Post as Post } from "../entities/Post/__generated__/index";
import { User as User } from "../entities/User/__generated__/index";
import { Query as _Query, Mutation as _Mutation } from "../entities/__generated__/index";


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
 * Query
 */

export interface Query {
  randomPost(): Awaitable<Maybe<Post>>;
}


/*
 * Aliases
 */

export type QueryEntity = Query


/*
 * Server
 */

export const createEntityServer = (opts: { Query: QueryEntity }) =>
  baseCreateEntityServer<QueryEntity>(opts);

