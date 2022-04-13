import type { Last, Or, RewrapShallow } from "./util-types";

export type StringParsable = {
  toString(): string;
};

export type ParameterSlot = {
  name: string;
  original: string;
  isOptional: boolean;
  isChained: boolean;
};

type GetParamName<P extends string> = P extends `+?${infer N}`
  ? N
  : P extends `?${infer N}`
  ? N
  : P;

type IsOptional<P extends string, THEN, ELSE> = P extends `?${string}`
  ? THEN
  : ELSE;

type IsChained<P extends string, THEN, ELSE> = P extends `+?${string}`
  ? THEN
  : ELSE;

type GetParamsFromString<
  T extends string,
  AllParams extends Record<string, any>[] = []
> = T extends `${string}{${infer K}}${infer Rest}`
  ? IsChained<
      K,
      GetParamsFromString<
        Rest,
        [
          ...Or<
            {
              [Key in keyof AllParams]: AllParams[Key] &
                Partial<Record<GetParamName<K>, undefined>>;
            },
            [Partial<Record<GetParamName<K>, undefined>>]
          >,
          Required<Last<AllParams>> &
            Partial<Record<GetParamName<K>, StringParsable>>
        ]
      >,
      IsOptional<
        K,
        GetParamsFromString<
          Rest,
          Or<
            [
              ...{
                [Key in keyof AllParams]: AllParams[Key] &
                  Partial<Record<GetParamName<K>, StringParsable>>;
              }
            ],
            [Partial<Record<GetParamName<K>, StringParsable>>]
          >
        >,
        GetParamsFromString<
          Rest,
          Or<
            [
              ...{
                [Key in keyof AllParams]: AllParams[Key] &
                  Record<GetParamName<K>, StringParsable>;
              }
            ],
            [Record<GetParamName<K>, StringParsable>]
          >
        >
      >
    >
  : AllParams;

export type RewrapElems<U extends string> = {
  [I in keyof GetParamsFromString<U>]: RewrapShallow<GetParamsFromString<U>[I]>;
};

export type UrlLiteralParams<U extends string> = RewrapElems<U> extends {
  length: 0;
}
  ? Record<never, string>
  : RewrapElems<U>[number];

export type UrlTemplate<U extends string> = {
  generate(parameters: UrlLiteralParams<U>): string;
  readonly template: U;
  readonly parametersCount: number;
  readonly parameters: {
    name: string;
    isOptional: boolean;
    isChained: boolean;
  }[];
};
