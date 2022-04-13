import replaceAll from "string.prototype.replaceall";
import { removeDuplicateSlashes } from "./remove-duplicate-slashes";
import type {
  ParameterSlot,
  StringParsable,
  UrlLiteralParams,
  UrlTemplate,
} from "./url-template.types";

replaceAll.shim();

const urlParamRegex = /{.+?}/g;
const paramMatchStripRegex = /(^{\?)|(^{\+\?)|(^{)|(}$)/g;
const isParamOptionalRegex = /^({\?)|({\+\?)/;
const isParamChainedRegex = /^{\+\?/;

export const urlTemplate = <U extends string>(url: U): UrlTemplate<U> => {
  const slots: ParameterSlot[] = [];

  const matches = url.match(urlParamRegex);

  if (matches !== null) {
    for (const match of matches.reverse()) {
      const name = match.replace(paramMatchStripRegex, "");

      slots.push({
        name,
        original: match,
        isOptional: isParamOptionalRegex.test(match),
        isChained: isParamChainedRegex.test(match),
      });
    }
  }

  const generate = (parameters: UrlLiteralParams<U>) => {
    let result: string = url;
    let allowOptionals = true;

    for (const slot of slots) {
      const value = parameters[slot.name as keyof typeof parameters] as
        | StringParsable
        | undefined;

      if (value === undefined || value === null) {
        if (slot.isOptional && allowOptionals) {
          result = result.replaceAll(`${slot.original}`, "");
          continue;
        } else {
          throw new Error(`[${slot.name}] parameter must be provided.`);
        }
      } else {
        result = result.replaceAll(
          slot.original,
          value.toString().replaceAll(" ", "%20")
        );

        if (slot.isChained) {
          allowOptionals = false;
        }
      }
    }

    return removeDuplicateSlashes(result.replaceAll("{}", ""));
  };

  return {
    generate,
    get template() {
      return url;
    },
    get parametersCount() {
      return slots.length;
    },
    get parameters() {
      return slots
        .map((s) => ({
          name: s.name,
          isOptional: s.isOptional,
          isChained: s.isChained,
        }))
        .reverse();
    },
  };
};
