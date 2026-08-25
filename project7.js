const form = document.querySelector("form");
const input = document.querySelector("input");
const pendingTasks = document.getElementById("pending-tasks");
const doneTasks = document.getElementById("done-tasks");
const pendingCount = document.getElementById("pending-count");
const doneCount = document.getElementById("done-count");
const pendingSection = document.getElementById("pending-section");
const doneSection = document.getElementById("done-section");

let tasks = (JSON.parse(localStorage.getItem("tasks")) || []).map((item) =>
  typeof item === "string" ? { text: item, done: false } : item
);

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function updateCounts() {
  const pending = tasks.filter((t) => !t.done).length;
  const done = tasks.filter((t) => t.done).length;
  pendingCount.textContent = `${pending} pending`;
  doneCount.textContent = `${done} done`;
  pendingSection.style.display = pending === 0 ? "none" : "block";
  doneSection.style.display = done === 0 ? "none" : "block";
}

function createTaskElement(taskObj) {
  const task = document.createElement("div");
  task.className = `task${taskObj.done ? " done" : ""}`;

  const text = document.createElement("span");
  text.className = "task-text";
  text.textContent = taskObj.text;

  const actions = document.createElement("div");
  actions.className = "task-actions";

  const doneBtn = document.createElement("button");
  doneBtn.className = taskObj.done ? "btn-undo" : "btn-done";
  doneBtn.textContent = taskObj.done ? "Undo" : "Done";

  doneBtn.addEventListener("click", () => {
    taskObj.done = !taskObj.done;
    saveTasks();
    renderAll();
  });

  const deleteBtn = document.createElement("button");
  deleteBtn.className = "btn-delete";
  deleteBtn.textContent = "Delete";

  deleteBtn.addEventListener("click", () => {
    tasks = tasks.filter((t) => t !== taskObj);
    saveTasks();
    renderAll();
  });

  actions.appendChild(doneBtn);
  actions.appendChild(deleteBtn);
  task.appendChild(text);
  task.appendChild(actions);

  return task;
}

function renderAll() {
  pendingTasks.innerHTML = "";
  doneTasks.innerHTML = "";

  const pending = tasks.filter((t) => !t.done);
  const done = tasks.filter((t) => t.done);

  if (pending.length === 0) {
    pendingTasks.innerHTML = '<div class="empty">No pending tasks</div>';
  }

  if (done.length === 0) {
    doneTasks.innerHTML = '<div class="empty">No completed tasks</div>';
  }

  pending.forEach((t) => pendingTasks.appendChild(createTaskElement(t)));
  done.forEach((t) => doneTasks.appendChild(createTaskElement(t)));

  updateCounts();
}

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const text = input.value.trim();
  if (text === "") return;

  tasks.push({ text, done: false });
  saveTasks();
  renderAll();
  input.value = "";
  input.focus();
});

renderAll();
