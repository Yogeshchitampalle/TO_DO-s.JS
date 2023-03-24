const addForm = document.querySelector(".add");
const tasks = document.querySelector(".tasks");
const clearAll = document.querySelector(".clear");
const msgSpan = document.querySelector(".message span");
const searchForm = document.querySelector(".search");

let isEditing = false;
const dateHeading = document.getElementById('dateHeading');
const today = new Date();
const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
const dateString = today.toLocaleDateString('en-US', options);
dateHeading.textContent = `Today's date is ${dateString}.`;

function saveTasks() {
    const taskItems = tasks.querySelectorAll("li");
    const taskList = [];
  
    taskItems.forEach((item) => {
      const taskText = item.querySelector("span").textContent;
      taskList.push(taskText);
    });
  
    localStorage.setItem("tasks", JSON.stringify(taskList));
}
  
function loadTasks() {
    const taskList = JSON.parse(localStorage.getItem("tasks"));
    if (taskList) {
        taskList.forEach((task) => {
            tasks.innerHTML += `<li><span>${task}</span>
                <i class="bi bi-trash-fill delete"></i>
                <i class="bi bi-pencil-square edit"></i>
            </li>`;
        });
    }
}

function updateMsg() {
    const txtLength = tasks.children.length;
    msgSpan.textContent = `You have ${txtLength} pending Works..!`;
}
updateMsg();

addForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const value = addForm.task.value.trim();

    if (value.length) {
        if (!isEditing) {
            tasks.innerHTML += `<li><span>${value}</span>
                <i class="bi bi-trash-fill delete"></i>
                <i class="bi bi-pencil-square edit"></i>
            </li>`;
            addForm.reset();
            updateMsg();
            saveTasks();
        } else {
            const editedTask = tasks.querySelector(".editing");
            editedTask.querySelector("span").textContent = value;
            editedTask.classList.remove("editing");
            addForm.querySelector("input[type='submit']").value = "Add";
            addForm.reset();
            isEditing = false;
            saveTasks();
        }
    }
});

tasks.addEventListener("click", (event) => {
    if (event.target.classList.contains("delete")) {
        event.target.parentElement.remove();
        updateMsg();
        saveTasks();
    } else if (event.target.classList.contains("edit")) {
        const li = event.target.parentElement;
        const span = li.querySelector("span");
        addForm.task.value = span.textContent;
        addForm.querySelector("input[type='submit']").value = "Save";
        isEditing = true;
        li.classList.add("editing");
    }
});

clearAll.addEventListener("click", (event) => {
    const taskItems = tasks.querySelectorAll("li");
    taskItems.forEach((item) => {
        item.remove();
        saveTasks();
    });
    updateMsg();
});

function filterTask(term) {
    Array.from(tasks.children)
        .filter((task) => {
            return !task.textContent.toLowerCase().includes(term.toLowerCase());
        })
        .forEach((task) => {
            task.classList.add("hide");
        });
    Array.from(tasks.children)
        .filter((task) => {
            return task.textContent.toLowerCase().includes(term.toLowerCase());
        })
        .forEach((task) => {
            task.classList.remove("hide");
        });
}

searchForm.addEventListener("keyup", (event) => {
    const term = searchForm.task.value.trim().toLowerCase();
    filterTask(term);
});

searchForm.addEventListener("click", (event) => {
    if (event.target.classList.contains("reset")) {
        searchForm.reset();
        const term = searchForm.task.value.trim();
        filterTask(term);
    }
});

window.addEventListener("load", () => {
    loadTasks();
});
