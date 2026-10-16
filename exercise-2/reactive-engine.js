
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
