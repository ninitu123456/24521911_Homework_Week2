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


export function renderToDOM(vnode) {
  // 1. Kiểm tra VNode hợp lệ
  if (!vnode || typeof vnode !== "object" ||
      typeof vnode.type !== "string") {
    throw new TypeError("Invalid VNode");
  }

  // 2. Nếu là văn bản thì tạo Text Node
  if (vnode.type === "TEXT_ELEMENT") {
    return document.createTextNode(vnode.props.nodeValue);
  }

  // 3. Tạo phần tử HTML thật
  const dom = document.createElement(vnode.type);

  // 4. Gán các thuộc tính HTML
  for (const [key, value] of Object.entries(vnode.props)) {
    if (key === "children" || key === "key") continue;

    if (key.startsWith("on")) {
      // Exercise 1: gắn event listener trực tiếp
      if (typeof value === "function") {
        const eventName = key.slice(2).toLowerCase();
        dom.addEventListener(eventName, value);
      }
      continue;
    }

    if (key === "className") {
      dom.setAttribute("class", value);
    } else if (value !== null && value !== undefined &&
               typeof value !== "function") {
      dom.setAttribute(key, String(value));
    }
  }

  // 5. Render các phần tử con
  for (const child of vnode.children) {
    dom.appendChild(renderToDOM(child));
  }

  // 6. Trả về DOM thật
  return dom;
}
