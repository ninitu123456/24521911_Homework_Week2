
import {
  createElement as h,
  useState,
  renderApp
} from "./reactive-engine.js";

let nextTaskId = 3;

function TaskApp() {
  const [tasks, setTasks] = useState([
    { id: 1, title: "Review PR", done: false },
    { id: 2, title: "Verify AST", done: true }
  ]);

  const [filter, setFilter] = useState("ALL");

  const [input, setInput] = useState("");

  function addTask() {
    const title = input.trim();
    if (!title) return;

    setTasks(previous => [
      ...previous,
      {
        id: nextTaskId++,
        title,
        done: false
      }
    ]);

    setInput("");
  }

  function toggleTask(id) {
    setTasks(previous =>
      previous.map(task =>
        task.id === id
          ? { ...task, done: !task.done }
          : task
      )
    );
  }

  function deleteTask(id) {
    setTasks(previous =>
      previous.filter(task => task.id !== id)
    );
  }

  const visibleTasks = tasks.filter(task => {
    if (filter === "ACTIVE") return !task.done;
    if (filter === "COMPLETED") return task.done;
    return true;
  });

  return h(
    "main",
    { className: "container" },

    h("h1", null, "Mini React Task Manager"),

    h(
      "p",
      null,
      `Total tasks: ${tasks.length}`
    ),

    h(
      "section",
      { className: "task-input" },

      h("input", {
        type: "text",
        placeholder: "Enter new task...",
        value: input,
        onInput: event => setInput(event.target.value)
      }),

      h("button", {
        onClick: addTask
      }, "Add Task")
    ),

    h(
      "nav",
      { className: "filters", "aria-label": "Task filters" },

      ...["ALL", "ACTIVE", "COMPLETED"].map(status =>
        h("button", {
          className: filter === status ? "active" : "",
          onClick: () => setFilter(status)
        }, status)
      )
    ),

    h(
      "section",
      { className: "task-list" },

      h("h2", null, "Your Tasks"),

      ...visibleTasks.map(task =>
        h(
          "article",
          { className: "task-item" },

          h("span", {
            className: task.done ? "completed" : ""
          }, task.title),

          h("button", {
            onClick: () => toggleTask(task.id)
          }, task.done ? "Undo" : "Done"),

          h("button", {
            onClick: () => deleteTask(task.id)
          }, "Delete")
        )
      )
    )
  );
}

renderApp(TaskApp, document.getElementById("app"));
