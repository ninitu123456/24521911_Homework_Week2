
const stateStore = [];

let cursor = 0;

export function resetCursor() {
  cursor = 0;
}

export function getStateStore() {
  return [...stateStore];
}



let triggerRender = () => {};

export function setRenderer(renderFunction) {
  triggerRender = renderFunction;
}

export function useState(initialValue) {
  const currentCursor = cursor;

  // Chỉ khởi tạo khi state chưa tồn tại
  if (!(currentCursor in stateStore)) {
    stateStore[currentCursor] =
      typeof initialValue === "function"
        ? initialValue()
        : initialValue;
  }

  // Hàm cập nhật state
  const setState = (nextValue) => {
    const previousValue = stateStore[currentCursor];

    const resolvedValue =
      typeof nextValue === "function"
        ? nextValue(previousValue)
        : nextValue;

    // Chỉ render lại nếu giá trị thay đổi
    if (!Object.is(previousValue, resolvedValue)) {
      stateStore[currentCursor] = resolvedValue;
      triggerRender();
    }
  };

  // Chuyển sang vị trí state tiếp theo
  cursor++;

  return [stateStore[currentCursor], setState];
}


export function setupEventDelegation(rootContainer) {
  const supportedEvents = ["click", "input", "keydown"];

  supportedEvents.forEach(eventType => {
    rootContainer.addEventListener(eventType, event => {
      let target = event.target;

      const handlerName =
        "on" +
        eventType.charAt(0).toUpperCase() +
        eventType.slice(1);

      while (target && target !== rootContainer) {
        const handler = target.__vnode?.props?.[handlerName];

        if (typeof handler === "function") {
          handler(event);
          break;
        }

        target = target.parentElement;
      }
    });
  });
}


export function createTextElement(text) {
  return {
    type: "TEXT_ELEMENT",
    props: { nodeValue: String(text) },
    children: []
  };
}

export function createElement(type, props, ...children) {
  return {
    type,
    props: props ?? {},
    children: children
      .flat(Infinity)
      .filter(child =>
        child !== null &&
        child !== undefined &&
        typeof child !== "boolean"
      )
      .map(child =>
        typeof child === "object"
          ? child
          : createTextElement(child)
      )
  };
}

export function renderToDOM(vnode) {
  if (vnode.type === "TEXT_ELEMENT") {
    return document.createTextNode(vnode.props.nodeValue);
  }

  const dom = document.createElement(vnode.type);

  // Lưu VNode để Event Delegation sử dụng
  dom.__vnode = vnode;

  for (const [key, value] of Object.entries(vnode.props)) {
    if (key.startsWith("on") || key === "children") {
      continue;
    }

    if (key === "className") {
      dom.setAttribute("class", value);
    } else if (key === "value") {
      dom.value = value;
    } else if (key === "checked") {
      dom.checked = Boolean(value);
    } else if (value !== null && value !== undefined) {
      dom.setAttribute(key, String(value));
    }
  }

  for (const child of vnode.children) {
    dom.appendChild(renderToDOM(child));
  }

  return dom;
}


let rootContainer = null;
let rootComponent = null;
let delegationInitialized = false;

export function renderApp(component, container) {
  rootComponent = component;
  rootContainer = container;

  if (!delegationInitialized) {
    setupEventDelegation(rootContainer);
    delegationInitialized = true;
  }

  setRenderer(() => {
    resetCursor();

    const vnode = rootComponent();
    const dom = renderToDOM(vnode);

    
const activeElement = document.activeElement;
const wasInputFocused =
  activeElement?.tagName === "INPUT" &&
  rootContainer.contains(activeElement);

const selectionStart = wasInputFocused
  ? activeElement.selectionStart
  : null;

rootContainer.replaceChildren(dom);

if (wasInputFocused) {
  const input = rootContainer.querySelector("input");

  if (input) {
    input.focus();

    if (selectionStart !== null) {
      input.setSelectionRange(selectionStart, selectionStart);
    }
  }
}

  });

  triggerRender();
}
