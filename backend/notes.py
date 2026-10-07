import json
import os

from data_structures import NotesLinkedList


NOTES_FILE = "notes.json"

# Create Linked List
notes_list = NotesLinkedList()


# Load saved notes
def load_notes():

    # Clear existing Linked List
    notes_list.head = None

    if os.path.exists(NOTES_FILE):

        with open(NOTES_FILE, "r") as file:
            notes = json.load(file)

        # Add saved notes to Linked List
        for note in notes:
            notes_list.add_note(
                note["title"],
                note["content"]
            )

    return notes_list.get_notes()


# Save notes
def save_notes():

    notes = notes_list.get_notes()

    with open(NOTES_FILE, "w") as file:
        json.dump(notes, file, indent=4)


# Add a new note
def add_note(title, content):

    notes_list.add_note(title, content)

    save_notes()

    return notes_list.get_notes()


# Delete a note
def delete_note(index):

    success = notes_list.delete_note(index)

    if not success:
        return None

    save_notes()

    return notes_list.get_notes()

# Edit a note
def edit_note(index, title, content):

    success = notes_list.edit_note(
        index,
        title,
        content
    )

    if not success:
        return None

    save_notes()

    return notes_list.get_notes()