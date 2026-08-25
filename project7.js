const form = document.querySelector("form");
const alltask = document.getElementById("alltask");
const input = document.querySelector("input");
console.log("init")
// Get saved tasks from localStorage
let tasks = (JSON.parse(localStorage.getItem("tasks")) || []).map((item) =>
  typeof item === "string" ? { text: item, done: false } : item,
);

// Save tasks to localStorage
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Display a task on the page
function displayTask(taskObj) {
  const parent = document.createElement("div");

  const task = document.createElement("span");
  task.textContent = taskObj.text;
  task.style.display = "block";
  if (taskObj.done) {
    task.style.textDecoration = "line-through";
    task.style.color = "gray";
  }

  const buttonStyle = (button) => {
    button.style.backgroundColor = "cyan";
    button.style.border = "none";
    button.style.padding = "5px 12px";
    button.style.marginTop = "8px";
  };

  const doneButton = document.createElement("button");
  doneButton.textContent = "Done";
  buttonStyle(doneButton);
  doneButton.style.marginRight = "10px";

  doneButton.addEventListener("click", () => {
    taskObj.done = !taskObj.done;
    task.style.textDecoration = taskObj.done ? "line-through" : "none";
    task.style.color = taskObj.done ? "gray" : "";
    saveTasks();
  });

  const deleteButton = document.createElement("button");
  deleteButton.textContent = "Delete";
  buttonStyle(deleteButton);

  deleteButton.addEventListener("click", () => {
    parent.remove();

    // Remove task from array
    tasks = tasks.filter((item) => item !== taskObj);

    // Save updated array
    saveTasks();
    let tasksRefetched = JSON.parse(localStorage.getItem("tasks")) || [];
    console.log("tasks stored after save:", tasksRefetched);
  });

  parent.appendChild(task);
  parent.appendChild(doneButton);
  parent.appendChild(deleteButton);

  alltask.appendChild(parent);
}

// Add a new task
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const text = input.value.trim();

  if (text === "") {
    return;
  }

  // Add task to array
  const taskObj = { text, done: false };
  tasks.push(taskObj);

  // Save task
  saveTasks();

  // Display task
  displayTask(taskObj);

  // Clear input
  input.value = "";
});

// Load saved tasks when page opens/refreshed
tasks.forEach((task) => {
  displayTask(task);
});
