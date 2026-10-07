// Load tasks when page opens
window.onload = function () {
    loadTasks();
};


// Add Task
async function addTask() {

    const name = document.getElementById("taskInput").value;
    const priority = document.getElementById("priorityInput").value;
    const deadline = document.getElementById("deadlineInput").value;

    if (name === "") {
        alert("Please enter a task.");
        return;
    }

    try {

        const response = await fetch("http://127.0.0.1:5000/add-task", {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                name: name,
                priority: priority,
                deadline: deadline
            })
        });

        const result = await response.json();

        if (result.success) {

            document.getElementById("taskInput").value = "";
            document.getElementById("deadlineInput").value = "";

            displayTasks(result.tasks);

        } else {

            alert("Failed to add task.");

        }

    } catch (error) {

        console.error(error);

        alert("Cannot connect to Flask backend.");

    }
}


// Load Tasks
async function loadTasks() {

    try {

        const response = await fetch("http://127.0.0.1:5000/tasks");

        const tasks = await response.json();

        displayTasks(tasks);

    } catch (error) {

        console.error(error);

        alert("Cannot connect to Flask backend.");

    }
}


// Display Tasks
function displayTasks(tasks) {

    const taskList = document.getElementById("taskList");

    taskList.innerHTML = "";

    if (tasks.length === 0) {

        taskList.innerHTML = `
            <p class="no-tasks">
                No tasks yet. Add your first task!
            </p>
        `;

        return;
    }


    tasks.forEach(function(task, index) {

        const taskCard = document.createElement("div");

        taskCard.className = "task-item";

        if (task.completed) {
            taskCard.classList.add("completed");
        }


        taskCard.innerHTML = `

            <div class="task-info">

                <h3>${task.name}</h3>

                <span class="task-priority">
                    ${task.priority} Priority
                </span>

                <p>
                    <strong>Deadline:</strong>
                    ${task.deadline || "No deadline"}
                </p>

            </div>


            <div class="task-actions">

                ${
                    task.completed
                    ?
                    `<button class="completed-btn" disabled>
                        ✓ Completed
                    </button>`
                    :
                    `<button class="complete-btn"
                        onclick="completeTask(${index})">
                        Complete
                    </button>`
                }

                <button class="delete-btn"
                    onclick="deleteTask(${index})">
                    Delete
                </button>

            </div>

        `;

        taskList.appendChild(taskCard);

    });
}


// Complete Task
async function completeTask(index) {

    try {

        const response = await fetch(
            `http://127.0.0.1:5000/complete-task/${index}`,
            {
                method: "PUT"
            }
        );

        const result = await response.json();

        if (result.success) {

            displayTasks(result.tasks);

        } else {

            alert("Could not complete task.");

        }

    } catch (error) {

        console.error(error);

        alert("Cannot connect to Flask backend.");

    }
}


// Delete Task
async function deleteTask(index) {

    const confirmDelete = confirm(
        "Are you sure you want to delete this task?"
    );

    if (!confirmDelete) {
        return;
    }

    try {

        const response = await fetch(
            `http://127.0.0.1:5000/delete-task/${index}`,
            {
                method: "DELETE"
            }
        );

        const result = await response.json();

        if (result.success) {

            displayTasks(result.tasks);

        } else {

            alert("Could not delete task.");

        }

    } catch (error) {

        console.error(error);

        alert("Cannot connect to Flask backend.");

    }
}