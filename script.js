// script.js
const taskInput = document.getElementById("task-input");
const addButton = document.getElementById("add-button");
const filterSelect = document.getElementById("filter-select");
const prioritySelect = document.getElementById("priority-select");
const dueDateInput = document.getElementById("due-date");
const taskList = document.getElementById("task-list");
const taskCount = document.getElementById("task-count");

const PRIORITY_COLORS = {
  low: "#4caf50",
  medium: "#ffc107",
  high: "#f44336",
};

const STORAGE_KEY = "todo_app_data";
let tasks = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
let completedTasks = tasks.filter((task) => task.completed);

function saveToLocalStorage() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

function renderTasks(taskArray = tasks) {
  taskList.innerHTML = "";
  taskCount.textContent = taskArray.length;

  taskArray.forEach((task, index) => {
    const taskElement = document.createElement("div");
    taskElement.className = `task ${task.completed ? "completed" : ""}`;
    taskElement.innerHTML = `
      <span class="task-text" style="color: ${
        PRIORITY_COLORS[task.priority]
      }">${task.text} (${task.dueDate || "No due date"})</span>
      <div>
        <input type="checkbox" class="task-checkbox" id="task-${index}" ${
      task.completed ? "checked" : ""
    }>
        <label for="task-${index}" class="task-label">Done</label>
        <button class="edit-button" data-index="${index}">Edit</button>
        <button class="delete-button" data-index="${index}">Delete</button>
      </div>
      <form class="edit-task-form">
        <input type="text" class="edit-input">
        <button type="submit" class="edit-submit-button">Save</button>
      </form>
    `;
    taskList.appendChild(taskElement);
  });
  saveToLocalStorage();
}

function filterTasks() {
  const filterValue = filterSelect.value;
  let filteredTasks = [];
  if (filterValue === "active") {
    filteredTasks = tasks.filter((task) => !completedTasks.includes(task));
  } else if (filterValue === "completed") {
    filteredTasks = completedTasks;
  } else {
    filteredTasks = tasks;
  }
  renderTasks(filteredTasks);
}

addButton.addEventListener("click", () => {
  const taskText = taskInput.value.trim();
  if (taskText !== "") {
    const priority = prioritySelect.value;
    const dueDate = dueDateInput.value || null;
    tasks.push({ text: taskText, priority, dueDate, completed: false });
    taskInput.value = "";
    dueDateInput.value = "";
    renderTasks();
  }
});

taskList.addEventListener("click", (event) => {
  if (event.target.classList.contains("delete-button")) {
    const index = event.target.getAttribute("data-index");
    tasks.splice(index, 1);
    completedTasks = tasks.filter((task) => task.completed);
    renderTasks();
  } else if (event.target.classList.contains("task-checkbox")) {
    const index = event.target.getAttribute("id").replace("task-", "");
    tasks[index].completed = !tasks[index].completed;
    completedTasks = tasks.filter((task) => task.completed);
    renderTasks();
  } else if (event.target.classList.contains("edit-button")) {
    const index = event.target.getAttribute("data-index");
    toggleEditForm(index);
  }
});

taskList.addEventListener("submit", (event) => {
  event.preventDefault();
  if (event.target.classList.contains("edit-task-form")) {
    const index = event.target.parentElement
      .querySelector(".edit-button")
      .getAttribute("data-index");
    const editedText = event.target.querySelector(".edit-input").value.trim();
    if (editedText !== "") {
      tasks[index].text = editedText;
      toggleEditForm(index);
      renderTasks();
    }
  }
});

function toggleEditForm(index) {
  const taskElement = taskList.children[index];
  const editForm = taskElement.querySelector(".edit-task-form");
  const taskText = taskElement.querySelector(".task-text").textContent;

  editForm.querySelector(".edit-input").value = taskText;

  if (editForm.classList.contains("active")) {
    editForm.classList.remove("active");
  } else {
    const otherEditForms = document.querySelectorAll(".edit-task-form.active");
    otherEditForms.forEach((form) => form.classList.remove("active"));
    editForm.classList.add("active");
  }
}

filterSelect.addEventListener("change", filterTasks);

renderTasks();
