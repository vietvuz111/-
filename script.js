const KEY = "study_task_mini_v1";

const input = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const listEl = document.getElementById("list");
const statTotal = document.getElementById("statTotal");
const statDone = document.getElementById("statDone");
const clearDoneBtn = document.getElementById("clearDoneBtn");
const themeBtn = document.getElementById("themeBtn");

let tasks = load();
let filter = "all";

function save() {
  localStorage.setItem(KEY, JSON.stringify(tasks));
}
function load() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

function addTask(text) {
  const t = text.trim();
  if (!t) return;
  tasks.unshift({ id: crypto.randomUUID(), text: t, done: false, createdAt: Date.now() });
  save();
  render();
}

function toggleTask(id) {
  tasks = tasks.map(t => t.id === id ? { ...t, done: !t.done } : t);
  save();
  render();
}

function deleteTask(id) {
  tasks = tasks.filter(t => t.id !== id);
  save();
  render();
}

function clearDone() {
  tasks = tasks.filter(t => !t.done);
  save();
  render();
}

function getFiltered() {
  if (filter === "active") return tasks.filter(t => !t.done);
  if (filter === "done") return tasks.filter(t => t.done);
  return tasks;
}

function render() {
  const shown = getFiltered();
  listEl.innerHTML = "";

  shown.forEach(t => {
    const li = document.createElement("li");
    li.className = "item";

    const left = document.createElement("div");
    left.className = "left";

    const cb = document.createElement("input");
    cb.type = "checkbox";
    cb.checked = t.done;
    cb.addEventListener("change", () => toggleTask(t.id));

    const span = document.createElement("span");
    span.className = "text" + (t.done ? " done" : "");
    span.textContent = t.text;

    left.appendChild(cb);
    left.appendChild(span);

    const del = document.createElement("button");
    del.className = "del";
    del.type = "button";
    del.textContent = "削除";
    del.addEventListener("click", () => deleteTask(t.id));

    li.appendChild(left);
    li.appendChild(del);

    listEl.appendChild(li);
  });

  const total = tasks.length;
  const done = tasks.filter(t => t.done).length;
  statTotal.textContent = `Total: ${total}`;
  statDone.textContent = `Done: ${done}`;
}

addBtn.addEventListener("click", () => addTask(input.value));
input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") addTask(input.value);
});

document.querySelectorAll("[data-filter]").forEach(btn => {
  btn.addEventListener("click", () => {
    filter = btn.dataset.filter;
    render();
  });
});

clearDoneBtn.addEventListener("click", clearDone);

themeBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  const isDark = document.body.classList.contains("dark");
  themeBtn.textContent = isDark ? "☀️" : "🌙";
});

render();
