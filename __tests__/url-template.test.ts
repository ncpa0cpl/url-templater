import { urlTemplate } from "../src";

describe("urlTemplate", () => {
  describe("with positive scenarios", () => {
    it("should correctly inject single parameter", () => {
      const template = urlTemplate("http://swapi.dev/api/people/{id}");

      expect(template.generate({ id: 15 })).toEqual(
        "http://swapi.dev/api/people/15"
      );
    });

    it("should correctly inject multiple parameters", () => {
      const template = urlTemplate(
        "http://swapi.dev/api/people/{id}/?format={format}"
      );

      expect(template.generate({ id: 69, format: "wookiee" })).toEqual(
        "http://swapi.dev/api/people/69/?format=wookiee"
      );
    });

    it("should remove white-spaces from the parameters", () => {
      const template = urlTemplate("http://swapi.dev/api/people/{id}/rest");

      expect(template.generate({ id: "a  b" })).toEqual(
        "http://swapi.dev/api/people/a%20%20b/rest"
      );
    });

    it("should correctly inject anything that's string parsable", () => {
      class StrParsable {
        toString() {
          return "foobar";
        }
      }

      const template = urlTemplate(
        "http://swapi.dev/api/people/{id}/?search={search}"
      );

      expect(
        template.generate({ id: new StrParsable(), search: [1, "a", 65, true] })
      ).toEqual("http://swapi.dev/api/people/foobar/?search=1,a,65,true");
    });

    it("should correctly inject optional parameter", () => {
      const template = urlTemplate("http://swapi.dev/api/people/{?id}");

      expect(template.generate({ id: 123 })).toEqual(
        "http://swapi.dev/api/people/123"
      );
    });

    it("should correctly inject multiple optional parameters", () => {
      const template = urlTemplate(
        "http://swapi.dev/api/people/{?id}/?search={?search}"
      );

      expect(template.generate({ id: 123, search: "foo" })).toEqual(
        "http://swapi.dev/api/people/123/?search=foo"
      );
    });

    it("should correctly inject one of optional parameters", () => {
      const template = urlTemplate(
        "http://swapi.dev/api/people/{?id}/?search={?search}"
      );

      expect(template.generate({ id: 123 })).toEqual(
        "http://swapi.dev/api/people/123/?search="
      );

      expect(template.generate({ search: "foo" })).toEqual(
        "http://swapi.dev/api/people/?search=foo"
      );
    });

    it("should correctly parse template without any optionals specified", () => {
      const template1 = urlTemplate("http://swapi.dev/api/people/{?a}/{?b}");

      expect(template1.generate({})).toEqual("http://swapi.dev/api/people");

      const template2 = urlTemplate(
        "http://swapi.dev/api/people/{?a}/{b}/{?c}"
      );

      expect(template2.generate({ b: "b" })).toEqual(
        "http://swapi.dev/api/people/b"
      );
    });

    it("should correctly inject optional chained parameter", () => {
      const template = urlTemplate(
        "http://swapi.dev/api/people/{?id}/?search={+?search}"
      );

      expect(template.generate({ search: "r2", id: 20 })).toEqual(
        "http://swapi.dev/api/people/20/?search=r2"
      );
    });

    it("should correctly parse template without any chained optionals specified", () => {
      const template1 = urlTemplate("http://swapi.dev/api/people/{+?a}/{+?b}");

      expect(template1.generate({})).toEqual("http://swapi.dev/api/people");

      const template2 = urlTemplate(
        "http://swapi.dev/api/people/{+?a}/{b}/{+?c}"
      );

      expect(template2.generate({ b: "b" })).toEqual(
        "http://swapi.dev/api/people/b"
      );
    });
  });

  describe("with negative scenarios", () => {
    it("should throw an error if a required parameter is not specified", () => {
      const template1 = urlTemplate("http://swapi.dev/api/people/{a}");
      const template2 = urlTemplate("http://swapi.dev/api/people/{a}/{b}");

      // @ts-expect-error
      expect(() => template1.generate({})).toThrowError();
      // @ts-expect-error
      expect(() => template2.generate({ a: "a" })).toThrowError();
      // @ts-expect-error
      expect(() => template2.generate({ b: "b" })).toThrowError();
    });

    it("should throw an error if any of the optional is not defined when a chained optional is", () => {
      const template = urlTemplate(
        "http://swapi.dev/api/people/{?a}/{+?b}/{+?c}/{?d}"
      );

      // @ts-expect-error
      expect(() => template.generate({ c: "c" })).toThrowError();
      // @ts-expect-error
      expect(() => template.generate({ b: "b" })).toThrowError();
      // @ts-expect-error
      expect(() => template.generate({ b: "b", c: "c" })).toThrowError();
      // @ts-expect-error
      expect(() => template.generate({ a: "a", c: "c" })).toThrowError();

      expect(() => template.generate({ a: "a", b: "b" })).not.toThrowError();
    });
  });
});
