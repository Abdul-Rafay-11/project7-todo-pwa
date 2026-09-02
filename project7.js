const form = document.querySelector("form");
const input = document.querySelector("input");
const pendingTasks = document.getElementById("pending-tasks");
const pendingCount = document.getElementById("pending-count");
const doneCount = document.getElementById("done-count");
const pendingSection = document.getElementById("pending-section");
const doneHeader = document.getElementById("done-header");
const modalOverlay = document.getElementById("modal-overlay");
const modalClose = document.getElementById("modal-close");
const modalBody = document.getElementById("modal-body");
const doneBadge = document.getElementById("done-badge");

let tasks = (JSON.parse(localStorage.getItem("tasks")) || []).map((item) =>
  typeof item === "string" ? { text: item, done: false } : item
);

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
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
    if (modalOverlay.classList.contains("active")) {
      renderModal();
    }
  });

  const deleteBtn = document.createElement("button");
  deleteBtn.className = "btn-delete";
  deleteBtn.textContent = "Delete";

  deleteBtn.addEventListener("click", () => {
    tasks = tasks.filter((t) => t !== taskObj);
    saveTasks();
    renderAll();
    if (modalOverlay.classList.contains("active")) {
      renderModal();
    }
  });

  actions.appendChild(doneBtn);
  actions.appendChild(deleteBtn);
  task.appendChild(text);
  task.appendChild(actions);

  return task;
}

function renderAll() {
  pendingTasks.innerHTML = "";

  const pending = tasks.filter((t) => !t.done);
  const done = tasks.filter((t) => t.done);

  if (pending.length === 0) {
    pendingTasks.innerHTML = '<div class="empty">No pending tasks</div>';
  }

  pending.forEach((t) => pendingTasks.appendChild(createTaskElement(t)));

  pendingCount.textContent = `${pending.length} pending`;
  doneCount.textContent = `${done.length} done`;
  doneBadge.textContent = done.length;
  pendingSection.style.display = pending.length === 0 ? "none" : "block";
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

function renderModal() {
  const done = tasks.filter((t) => t.done);
  modalBody.innerHTML = "";

  if (done.length === 0) {
    modalBody.innerHTML = '<div class="empty">No completed tasks yet</div>';
  } else {
    done.forEach((t) => modalBody.appendChild(createTaskElement(t)));
  }
}

renderAll();

doneHeader.addEventListener("click", () => {
  renderModal();
  modalOverlay.classList.add("active");
});

modalClose.addEventListener("click", () => {
  modalOverlay.classList.remove("active");
});

modalOverlay.addEventListener("click", (e) => {
  if (e.target === modalOverlay) {
    modalOverlay.classList.remove("active");
  }
});
