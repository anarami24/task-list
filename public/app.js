const tasksContainer = document.getElementById("tasksContainer");
const taskForm = document.getElementById("taskForm");


function renderCards(tasks) {
tasksContainer.innerHTML = "";

tasks.forEach(task => {
const col = document.createElement("div");
col.className = "col-md-6 col-lg-4";


col.innerHTML = `
 <div class="card shadow-sm h-100">
        <div class="card-body">
          <div class="d-flex justify-content-between align-items-start">
            <div class="form-check">
              <input class="form-check-input" type="checkbox"
                ${task.completed ? "checked" : ""}
                onchange="toggleTask(${task.id})">
            </div>
            <button class="btn btn-sm text-danger" onclick="deleteTask(${task.id})">
              <i class="bi bi-trash"></i>
            </button>

          </div>
          <h5 class="mt-2 ${task.completed ? "text-decoration-line-through text-muted" : ""}">
            ${task.title}
          </h5>
          ${task.completed ? `<span class="badge bg-success mb-2">Completed</span>` : ""}
          <p class="card-text">${task.description || ""}</p>
          <p class="small text-muted">
            Due: ${task.due_date ? task.due_date.split("T")[0] : "No date"}
          </p>

        </div>
      </div>
    `;

tasksContainer.appendChild(col);
 });
}

async function loadTasks() {
  const response = await fetch("/api/tasks");
  const tasks = await response.json();

  renderCards(tasks);
}

async function toggleTask(id) {
  await fetch(`/api/tasks/${id}/toggle`, {
    method: "PUT"
  });

  loadTasks();
}

async function deleteTask(id) {
await fetch(`/api/tasks/${id}`, {
 method: "DELETE"
 });

loadTasks();
}

taskForm.addEventListener("submit", async (event) => {
event.preventDefault();

const payload = {
 title: document.getElementById("task").value,
 description: document.getElementById("description").value,
 due_date: document.getElementById("dueDate").value
 };

await fetch("/api/tasks", {
 method: "POST",
 headers: {
"Content-Type": "application/json"
 },
 body: JSON.stringify(payload)
 });

taskForm.reset();
bootstrap.Modal.getInstance(document.getElementById("addTaskModal")).hide();
loadTasks();
});


loadTasks();