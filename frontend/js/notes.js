// Load notes when page opens

window.onload = function () {
    loadNotes();
};


// Get notes from Flask

async function loadNotes() {

    try {

        const response = await fetch("http://127.0.0.1:5000/notes");

        const notes = await response.json();

        displayNotes(notes);

    } catch (error) {

        console.error(error);

        alert("Cannot connect to Flask backend.");

    }
}


// Add Note

async function addNote() {

    const title = document.getElementById("noteTitle").value;
    const content = document.getElementById("noteContent").value;

    if (title === "" || content === "") {

        alert("Please enter both title and content.");

        return;
    }


    try {

        const response = await fetch(
            "http://127.0.0.1:5000/add-note",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    title: title,
                    content: content
                })
            }
        );


        const result = await response.json();


        if (result.success) {

            alert("Note added successfully!");

            document.getElementById("noteTitle").value = "";
            document.getElementById("noteContent").value = "";

            displayNotes(result.notes);

        } else {

            alert(result.message);

        }

    } catch (error) {

        console.error(error);

        alert("Cannot connect to Flask backend.");

    }
}


// Display Notes

function displayNotes(notes) {

    window.currentNotes = notes;

    const notesList = document.getElementById("notesList");

    const noteCount = document.getElementById("noteCount");

    notesList.innerHTML = "";

    // Update note count
    noteCount.textContent =
        notes.length + (notes.length === 1 ? " Note" : " Notes");


    // No notes
    if (notes.length === 0) {

        notesList.innerHTML = `
            <div class="empty-notes">
                <p>No notes yet. Add your first note!</p>
            </div>
        `;

        return;
    }


    // Create note cards
    notes.forEach(function (note, index) {

        const noteCard = document.createElement("div");

        noteCard.className = "note-card";


        // Create short preview
        let preview = note.content;

        if (preview.length > 120) {
            preview = preview.substring(0, 120) + "...";
        }


        noteCard.innerHTML = `

            <h3>${note.title}</h3>

            <p class="note-preview">${preview}</p>

            <div class="note-buttons">

                <button
                    class="open-note-btn"
                    onclick="openNote(${index})"
                >
                    Open
                </button>

                <button
                    class="delete-note-btn"
                    onclick="deleteNote(${index})"
                >
                    Delete
                </button>

            </div>

        `;


        notesList.appendChild(noteCard);

    });
}
// =================================
// OPEN NOTE
// =================================

function openNote(index) {

    const noteCards =
        document.querySelectorAll(".note-card");

    const noteCard = noteCards[index];

    if (!noteCard) {
        return;
    }

    const title =
        noteCard.querySelector("h3").textContent;

    const notes = window.currentNotes;

    const content = notes[index].content;


    document.getElementById("modalTitle").textContent = title;

    document.getElementById("modalContent").textContent = content;

    document.getElementById("noteModal").style.display = "flex";
}

// Close Note

function closeNote() {

    document.getElementById("noteModal").style.display = "none";
}

// Delete Note

async function deleteNote(index) {

    if (!confirm("Are you sure you want to delete this note?")) {
        return;
    }


    try {

        const response = await fetch(
            `http://127.0.0.1:5000/delete-note/${index}`,
            {
                method: "DELETE"
            }
        );


        const result = await response.json();


        if (result.success) {

            displayNotes(result.notes);

        } else {

            alert(result.message);

        }

    } catch (error) {

        console.error(error);

        alert("Cannot connect to Flask backend.");

    }
}
// =================================
// SEARCH NOTES
// =================================

function searchNotes() {

    const searchText =
        document.getElementById("searchInput").value.toLowerCase();

    const noteCards =
        document.querySelectorAll(".note-card");

    noteCards.forEach(function (card) {

        const title =
            card.querySelector("h3").textContent.toLowerCase();

        const content =
            card.querySelector("p").textContent.toLowerCase();

        if (
            title.includes(searchText) ||
            content.includes(searchText)
        ) {

            card.style.display = "";

        } else {

            card.style.display = "none";

        }

    });
}