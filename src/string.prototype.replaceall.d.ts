declare module "string.prototype.replaceall" {
  const replaceAll: ((
    str: string,
    searchFor: string | RegExp,
    replaceWith: string
  ) => string) & { shim(): void };
  export default replaceAll;
}
