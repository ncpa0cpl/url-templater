export type Rewrap<T> = T extends Function
  ? T
  : T extends object
  ? T extends infer O
    ? {
        [K in keyof O as string extends K
          ? never
          : number extends K
          ? never
          : K]: Rewrap<O[K]>;
      }
    : T
  : T;

export type RewrapShallow<T> = T extends infer O
  ? {
      [K in keyof O as string extends K
        ? never
        : number extends K
        ? never
        : K]: O[K];
    }
  : T;

export type Or<
  A extends Record<string, any>[],
  B extends Record<string, any>[]
> = A extends { length: 0 } ? B : A;

export type Last<T extends Record<string, any>[]> = T extends [
  ...infer A,
  infer B
]
  ? B
  : Record<never, any>;

export type First<T extends Record<string, any>[]> = T extends [
  infer A,
  ...infer B
]
  ? A
  : Record<never, any>;

export type SetValues<R extends Record<string, any>, T> = RewrapShallow<{
  [K in keyof R]: T;
}>;
