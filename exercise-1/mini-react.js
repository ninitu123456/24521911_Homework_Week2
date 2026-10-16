export function createTextElement(text) {
  return {
    type: "TEXT_ELEMENT",
    props: {
      nodeValue: String(text)
    },
    children: []
  };
}


export function createElement(type, props, ...children) {
  if (typeof type !== "string" || !/^[a-z][a-z0-9-]*$/.test(type)) {
    throw new TypeError("Invalid element type");
  }

  if (props !== null && (
    typeof props !== "object" ||
    Array.isArray(props)
  )) {
    throw new TypeError("Invalid props");
  }

  const normalizedChildren = children
    .flat(Infinity)
    .filter(child =>
      child !== null &&
      child !== undefined &&
      typeof child !== "boolean"
    )
    .map(child => {
      if (typeof child === "string" ||
          typeof child === "number") {
        return createTextElement(child);
      }

      if (child && typeof child === "object" &&
          typeof child.type === "string") {
        return child;
      }

      throw new TypeError("Invalid child");
    });

  return {
    type,
    props: props ?? {},
    children: normalizedChildren
  };
}
