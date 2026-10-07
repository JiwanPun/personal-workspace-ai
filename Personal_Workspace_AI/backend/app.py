from flask import Flask, request, jsonify
from flask_cors import CORS
from data_structures import PriorityQueue
from notes import load_notes, add_note, delete_note, edit_note
import json
import os

app = Flask(__name__)
CORS(app)

# Load saved notes into Linked List
load_notes()

# Create Priority Queue
task_queue = PriorityQueue()

# Data file
DATA_FILE = "data.json"


# Load saved tasks
def load_tasks():

    if os.path.exists(DATA_FILE):

        with open(DATA_FILE, "r") as file:
            tasks = json.load(file)

        for task in tasks:
            task_queue.enqueue(task)


# Save tasks
def save_tasks():

    with open(DATA_FILE, "w") as file:
        json.dump(task_queue.get_tasks(), file, indent=4)


# Load tasks when Flask starts
load_tasks()


# Home route
@app.route("/")
def home():

    return "Personal Workspace AI Backend is Running!"


# Add Task
@app.route("/add-task", methods=["POST"])
def add_task():

    data = request.json

    task = {
        "name": data["name"],
        "priority": data["priority"],
        "deadline": data.get("deadline", ""),
        "completed": False
    }

    task_queue.enqueue(task)

    save_tasks()

    return jsonify({
        "success": True,
        "message": "Task added successfully",
        "tasks": task_queue.get_tasks()
    })


# Get Tasks
@app.route("/tasks", methods=["GET"])
def get_tasks():

    return jsonify(task_queue.get_tasks())


# Complete Task
@app.route("/complete-task/<int:index>", methods=["PUT"])
def complete_task(index):

    tasks = task_queue.get_tasks()

    if index < 0 or index >= len(tasks):

        return jsonify({
            "success": False,
            "message": "Task not found"
        }), 404

    # Mark task as completed
    tasks[index]["completed"] = True

    save_tasks()

    return jsonify({
        "success": True,
        "message": "Task completed successfully",
        "tasks": tasks
    })


# Delete Task
@app.route("/delete-task/<int:index>", methods=["DELETE"])
def delete_task(index):

    tasks = task_queue.get_tasks()

    if index < 0 or index >= len(tasks):

        return jsonify({
            "success": False,
            "message": "Task not found"
        }), 404

    tasks.pop(index)

    save_tasks()

    return jsonify({
        "success": True,
        "message": "Task deleted successfully",
        "tasks": tasks
    })

# Get Notes
@app.route("/notes", methods=["GET"])
def get_notes():

    return jsonify(load_notes())


# Add Note
@app.route("/add-note", methods=["POST"])
def create_note():

    data = request.json

    title = data.get("title", "")
    content = data.get("content", "")

    if title == "" or content == "":
        return jsonify({
            "success": False,
            "message": "Title and content are required"
        }), 400

    notes = add_note(title, content)

    return jsonify({
        "success": True,
        "message": "Note added successfully",
        "notes": notes
    })


# Delete Note
@app.route("/delete-note/<int:index>", methods=["DELETE"])
def remove_note(index):

    notes = delete_note(index)

    if notes is None:
        return jsonify({
            "success": False,
            "message": "Note not found"
        }), 404

    return jsonify({
        "success": True,
        "message": "Note deleted successfully",
        "notes": notes
    })

# Edit Note
@app.route("/edit-note/<int:index>", methods=["PUT"])
def update_note(index):

    data = request.json

    title = data.get("title", "")
    content = data.get("content", "")

    if title == "" or content == "":
        return jsonify({
            "success": False,
            "message": "Title and content are required"
        }), 400

    notes = edit_note(
        index,
        title,
        content
    )

    if notes is None:
        return jsonify({
            "success": False,
            "message": "Note not found"
        }), 404

    return jsonify({
        "success": True,
        "message": "Note updated successfully",
        "notes": notes
    })

if __name__ == "__main__":
    app.run(debug=False)