
import {
  createElement,
  renderToDOM
} from "./mini-react.js";

// Tạo Virtual DOM
const vApp = createElement(
  "main",
  { id: "root-view", role: "main" },

  createElement(
    "header",
    { className: "hero" },

    createElement(
      "h1",
      null,
      "Mini React Engine"
    ),

    createElement(
      "p",
      null,
      "<script>alert(1)</script>"
    )
  ),

  createElement(
    "section",
    null,

    createElement(
      "button",
      {
        onClick: () => console.log("Ping")
      },
      "Click Me"
    )
  )
);

// Lấy phần tử gốc
const root = document.getElementById("app");

// Mount Virtual DOM thành Real DOM
root.replaceChildren(renderToDOM(vApp));

// Kiểm tra
console.assert(
  root.querySelector("button") !== null,
  "Mount Failed"
);

console.assert(
  root.querySelector("script") === null,
  "XSS Test Failed"
);

console.assert(
  root.querySelector("main") !== null,
  "Semantic HTML Failed"
);

console.log("Exercise 1 mounted successfully!");
