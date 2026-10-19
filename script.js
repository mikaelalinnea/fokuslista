const taskForm = document.getElementById("taskForm");
const taskNameInput = document.getElementById("taskName");
const taskCategoryInput = document.getElementById("taskCategory");
const taskList = document.getElementById("taskList");
const taskCount = document.getElementById("taskCount");
const filterButtons = document.querySelectorAll("#task-controls button");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

renderTasks();
updateCount();

function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function updateCount() {
    let active = 0;

    for (let i = 0; i < tasks.length; i++) {
        if (!tasks[i].done) {
            active++;
        }
    }

    taskCount.textContent = "Aktiivisia tehtäviä: " + active;
}

taskForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const name = taskNameInput.value.trim();
    const category = taskCategoryInput.value;

    if (name === "") {
        document.getElementById("nameError").textContent = "Kirjoita tehtävä!";
        return;
    }

    document.getElementById("nameError").textContent = "";

    const newTask = {
        id: Date.now(),
        name: name,
        category: category,
        done: false
    };

    tasks.push(newTask);
    saveTasks();
    renderTasks();
    updateCount();

    taskNameInput.value = "";
});

for (let i = 0; i < filterButtons.length; i++) {
    filterButtons[i].addEventListener("click", function () {
        const text = this.textContent.toLowerCase();

        if (text.includes("aktiiviset")) {
            renderTasks("active");
        } else if (text.includes("tehdyt")) {
            renderTasks("done");
        } else {
            renderTasks("all");
        }
    });
}

function renderTasks(filter) {
    taskList.innerHTML = "";

    for (let i = 0; i < tasks.length; i++) {
        const task = tasks[i];

        if (filter === "active" && task.done) continue;
        if (filter === "done" && !task.done) continue;

        const li = document.createElement("li");

        if (task.done) {
            li.classList.add("done");
        }

        li.innerHTML =
            '<input type="checkbox" class="toggle"> ' +
            '<span>' + task.name + ' (' + task.category + ')</span> ' +
            '<button class="delete">X</button>';

        const checkbox = li.querySelector(".toggle");
        checkbox.checked = task.done;

        checkbox.addEventListener("change", function () {
            task.done = !task.done;
            saveTasks();
            renderTasks(filter);
            updateCount();
        });

        const deleteBtn = li.querySelector(".delete");
        deleteBtn.addEventListener("click", function () {

            let updated = [];

            for (let j = 0; j < tasks.length; j++) {
                if (tasks[j].id !== task.id) {
                    updated.push(tasks[j]);
                }
            }

            tasks = updated;
            saveTasks();
            renderTasks(filter);
            updateCount();
        });

        taskList.appendChild(li);
    }
}