export const removeDuplicateSlashes = (s: string) => {
  const parts = s.split("/");

  const filtered = parts.reduce((result: string[], part, index) => {
    const prev = parts[index - 1] ?? "";

    if (part === "" && !prev.endsWith(":")) {
      return result;
    }

    result.push(part);
    return result;
  }, []);

  return filtered.join("/");
};
