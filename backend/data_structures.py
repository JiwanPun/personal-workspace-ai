# Priority Queue for Personal Workspace AI


class PriorityQueue:

    def __init__(self):
        self.tasks = []


    # Add a task
    def enqueue(self, task):

        self.tasks.append(task)

        # Arrange tasks according to priority
        priority_value = {
            "High": 1,
            "Medium": 2,
            "Low": 3
        }

        self.tasks.sort(
            key=lambda x: priority_value[x["priority"]]
        )


    # Remove the highest priority task
    def dequeue(self):

        if len(self.tasks) == 0:
            return None

        return self.tasks.pop(0)


    # Get all tasks
    def get_tasks(self):

        return self.tasks



# =================================
# Linked List for Notes
# =================================


class NoteNode:

    def __init__(self, title, content):

        self.title = title
        self.content = content
        self.next = None



class NotesLinkedList:

    def __init__(self):

        self.head = None


    # Add a note
    def add_note(self, title, content):

        new_node = NoteNode(title, content)

        if self.head is None:

            self.head = new_node
            return

        current = self.head

        while current.next is not None:

            current = current.next

        current.next = new_node


    # Get all notes
    def get_notes(self):

        notes = []

        current = self.head

        while current is not None:

            notes.append({
                "title": current.title,
                "content": current.content
            })

            current = current.next

        return notes


    # Delete a note
    def delete_note(self, index):

        if self.head is None:

            return False


        # Delete first note
        if index == 0:

            self.head = self.head.next

            return True


        current = self.head

        for i in range(index - 1):

            if current.next is None:

                return False

            current = current.next


        if current.next is None:

            return False


        current.next = current.next.next

        return True


    # Edit a note
    def edit_note(self, index, title, content):

        current = self.head


        # Move to the required node
        for i in range(index):

            if current is None:

                return False

            current = current.next


        # Note not found
        if current is None:

            return False


        # Update note
        current.title = title
        current.content = content

        return True