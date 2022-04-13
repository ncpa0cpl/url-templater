# url-templater.ts

A template mechanism for parametrized url links, provide the url template and get a generator that will inject the parameters for you.

## Full TypeScript support!

Template parameters are recognized by the TypeScript type system and ensured to be included in the generator arguments, making it easier for you to avoid mistakes during the development before the code is ever deployed or tested.

## Generator Arguments

Url returned by the generator is always a string, meaning the arguments must also be parsed to strings, however not only strings and numbers can be provided as the arguments to the generator. Anything that has a `.toString` method, can be an argument. When generating the url, that method will be called and it's result will be inserted into the url.

## Example

Url Template function takes a string with a parametrized url, anything within the string that is inside curly braces is considered a parameter. Each parameter within the string will be an argument to the template generator.

```ts
import { urlTemplate } from "url-templater.ts";

const apiTemplate = urlTemplate("/api/product/{id}");

// /api/product/1
const generatedUrl = apiTemplate.generate({ id: 1 });
```

There is no limit to how many parameters you can have.

```ts
import { urlTemplate } from "url-templater.ts";

const apiTemplate = urlTemplate("/api/{a}/{b}/{c}/{d}");

// /api/foo/bar/baz/qux
const generatedUrl = apiTemplate.generate({
  a: "foo",
  b: "bar",
  c: "baz",
  d: "qux",
});
```

Parameters can also be optional, for that add a question sign `?` at the beginning of the parameter name.

```ts
import { urlTemplate } from "url-templater.ts";

const apiTemplate = urlTemplate("/api/product/{?id}");

// /api/product/1
const generatedUrlWithId = apiTemplate.generate({ id: 1 });

// /api/product/
const generatedUrlWithoutId = apiTemplate.generate({});
```

Parameters can also be optionally chained, an optionally chained argument, if it is specified, will require each preceding optional argument to be defined.

```ts
import { urlTemplate } from "url-templater.ts";

const apiTemplate = urlTemplate("/api/book/{?id}/{+?pageNumber}"); // Here if the pageNumber is specified, the book ID also must be provided

// /api/book
const generatedUrl = apiTemplate.generate({}); // this is ok

// /api/5
const generatedUrl = apiTemplate.generate({ id: 5 }); // this is ok

// /api/5/1
const generatedUrl = apiTemplate.generate({ id: 5, pageNumber: 1 }); // this is ok

const generatedUrl = apiTemplate.generate({ pageNumber: 1 }); // this is not ok, id is preceding the pageNumber, so the id must be defined
```
