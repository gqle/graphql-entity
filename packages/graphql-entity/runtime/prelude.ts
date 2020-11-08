export type Maybe<T> = T | null

export type Awaitable<T> = T | Promise<T>

export type Resolvable<T, U = never> = Awaitable<T> | ((params: U) => Awaitable<T>)
