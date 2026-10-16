
import {
  createElement as h,
  useState,
  renderApp
} from "../exercise-2/reactive-engine.js";

// Dữ liệu mẫu để mô phỏng API
const sampleItems = [
  { id: 1, title: "React Architecture" },
  { id: 2, title: "State Management" },
  { id: 3, title: "Async Data Fetching" }
];

// Mô phỏng một request bất đồng bộ
function fetchFeed(shouldFail = false) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (shouldFail) {
        reject(new Error("Connection failed"));
      } else {
        resolve(sampleItems);
      }
    }, 1500);
  });
}

// Mỗi lần request tăng một số thứ tự
let requestId = 0;

function DataFeed() {
  const [state, setState] = useState({
    status: "IDLE"
  });

  async function loadData(shouldFail = false) {
    // Đánh dấu request hiện tại
    const currentRequest = ++requestId;

    setState({ status: "LOADING" });

    try {
      const items = await fetchFeed(shouldFail);

      // Bỏ qua kết quả request đã lỗi thời
      if (currentRequest !== requestId) return;

      setState({
        status: "SUCCESS",
        data: items
      });
    } catch (error) {
      if (currentRequest !== requestId) return;

      setState({
        status: "ERROR",
        error: error.message
      });
    }
  }

  function renderContent() {
    switch (state.status) {
      case "IDLE":
        return h(
          "section",
          { className: "status-panel" },
          h("p", null, "No data loaded yet."),
          h(
            "button",
            { onClick: () => loadData() },
            "Load Data"
          )
        );

      case "LOADING":
        return h(
          "section",
          {
            className: "skeleton-list",
            "aria-busy": "true",
            "aria-label": "Loading data"
          },
          ...[1, 2, 3].map(() =>
            h(
              "article",
              { className: "skeleton-card" },
              h("span", {
                className: "skeleton-line"
              }),
              h("span", {
                className: "skeleton-line short"
              })
            )
          )
        );

      case "SUCCESS":
        return h(
          "section",
          { className: "data-list" },

          h("h2", null, "Loaded Items"),

          ...state.data.map(item =>
            h(
              "article",
              { className: "data-card" },
              h("h3", null, item.title)
            )
          ),

          h(
            "button",
            { onClick: () => loadData() },
            "Reload Data"
          )
        );

      case "ERROR":
        return h(
          "section",
          { className: "error-panel", role: "alert" },

          h("h2", null, "Failed to load data"),

          h("p", null, state.error),

          h(
            "button",
            { onClick: () => loadData() },
            "Retry Connection"
          )
        );

      default:
        throw new Error("Unknown state");
    }
  }

  return h(
    "main",
    { className: "container" },

    h("h1", null, "Data Feed Dashboard"),

    h(
      "p",
      { className: "state-label" },
      `Current state: ${state.status}`
    ),

    renderContent(),

    h(
      "section",
      { className: "test-controls" },

      h("h2", null, "Test Controls"),

      h(
        "button",
        { onClick: () => loadData(false) },
        "Simulate Success"
      ),

      h(
        "button",
        { onClick: () => loadData(true) },
        "Simulate Error"
      )
    )
  );
}

renderApp(DataFeed, document.getElementById("app"));
