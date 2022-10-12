// Note Class: Represent a Note
class Note {
    constructor(note_id, note_title, note_colour, note_content) {
        this.note_id = note_id;
        this.note_title = note_title;
        this.note_colour = note_colour;
        this.note_content = note_content;
    }
}

// Interface Class: Handle all Interface Tasks for the note
class Interface {
    static displayNotes() {
        const notes = Store.getNotes();
        notes.forEach((note) => Interface.addNoteToList(note));

        const editForm = document.querySelector('#edit-note');
        editForm.classList.add('hide-form');
    }

    static getSpecificNote(note_id) {
        const notes = Store.getNotes();
        notes.forEach((note) => {
            if(note.note_id === note_id) {
                const editForm = document.querySelector('#edit-note');
                editForm.classList.add('show-form');
                editForm.classList.remove('hide-form');

                const createForm = document.querySelector('#create-note');
                createForm.classList.remove('show-form');
                createForm.classList.add('hide-form');

                document.querySelector('#update_note_title').value = note.note_title;
                document.querySelector('#update_note_colour').value = note.note_colour;
                document.querySelector('#update_note_content').value = note.note_content;
                document.querySelector('#note_id').value = note.note_id;
            }
        });
    }

    static closeUpdateForm() {

            const editForm = document.querySelector('#edit-note');
            editForm.classList.add('hide-form');
            editForm.classList.remove('show-form');

            const createForm = document.querySelector('#create-note');
            createForm.classList.remove('hide-form');
            createForm.classList.add('show-form');

    }

    static addNoteToList(note) {

        const list = document.querySelector('#note-listing');

        const note_holder = document.createElement('li'); 
        note_holder.classList.add('card', 'note', 'rounded-0');
        note_holder.style.backgroundColor = `${note.note_colour}`;
        note_holder.innerHTML = `
            <div class="mb16">
                <strong>${note.note_title}</strong>
            </div>
            <p class="mb16">
                ${note.note_content}
            </p>
            <div class="mt32">
                <button class="btn btn-info rounded-0 edit" onClick="Interface.getSpecificNote(${note.note_id})">
                    <i class="fa fa-pencil"></i> Edit
                </button>
                <button class="btn btn-danger rounded-0 delete" onClick="Store.removeNote(${note.note_id})">
                    <i class="fa fa-trash"></i> Delete
                </button>
            </div>
        `;

        list.appendChild(note_holder);

    }

    static showAlert(message, className) {
        const div = document.createElement('div');
        div.className = `alert alert-${className}`;
        div.appendChild(document.createTextNode(message));

        const container = document.querySelector('#create-note');
        const formHeader = document.querySelector('#form-header');
        container.insertBefore(div, formHeader);

        // Remove notification in 5 seconds
        setTimeout(() => document.querySelector('.alert').remove(), 3000);
    }

    static clearFields() {
        document.querySelector('#note_title').value = '';
        document.querySelector('#note_colour').value = '';
        document.querySelector('#note_content').value = '';
    }

    static deleteNote(selectedElement) {
        if( selectedElement.classList.contains('delete')) {
            selectedElement.parentElement.parentElement.remove();

            // Notify user of the deletion of a note
            Interface.showAlert('You just deleted a note', 'danger');
        }
    }
}

// Storage Class: Handle everything relating to storage of notes
class Store {
    static getNotes() {
        let notes;

        if(localStorage.getItem('notes') === null) {
            notes = [];
        } else {
            notes = JSON.parse(localStorage.getItem('notes'));
        }

        return notes;
    }

    static addNote(note) {
        const notes = Store.getNotes();
        notes.push(note);

        localStorage.setItem('notes', JSON.stringify(notes));
    }

    static removeNote(note_id) {
        const notes = Store.getNotes();
        notes.forEach((note, index) => {
            if(note.note_id === note_id) {
                notes.splice(index, 1);
            }
        });

        localStorage.setItem('notes', JSON.stringify(notes));
    }

}

// Event: Display the Notes
document.addEventListener('DOMContentLoaded', Interface.displayNotes);

// Event: Add a new Note
document.querySelector('#note-taker')
    .addEventListener('submit', (createNoteEvent) => {
        // Prevent Default Submit Action
        createNoteEvent.preventDefault();

        // Get Form Data
        const note_title = document.querySelector('#note_title').value;
        const note_colour = document.querySelector('#note_colour').value;
        const note_content = document.querySelector('#note_content').value;
        const note_id = Math.floor(Math.random() * 10000) * 35000;

        // Validate Form
        if(note_title === '' || note_colour === '' || note_content === '' ) {

            Interface.showAlert('Please fill all the fields', 'danger');

        } else {

            // Instantiate a new Note
            const note = new Note(note_id, note_title, note_colour, note_content);

            // Add new note to the Interface
            Interface.addNoteToList(note);

            // Persist note data to localStorage
            Store.addNote(note);

            
            // Notify user of the successful creation of a note
            Interface.showAlert('Your note has been saved', 'info');

            // Clear form fields
            Interface.clearFields();

        }
    });

// Event: Update an Existing Note
document.querySelector('#update-note-taker')
    .addEventListener('submit', (updateNoteEvent) => {
        // Prevent Default Submit Action
        updateNoteEvent.preventDefault();

        // Get Form Data
        const update_note_title = document.querySelector('#update_note_title').value;
        const update_note_colour = document.querySelector('#update_note_colour').value;
        const update_note_content = document.querySelector('#update_note_content').value;
        const note_id = Number(document.querySelector('#note_id').value)

        // Validate Form
        if (note_title === '' || note_colour === '' || note_content === '') {

            Interface.showAlert('Please fill all the fields', 'danger');

        } else {
            
            // Remove existing note
            Store.removeNote(note_id);
            
            // Instantiate a new Note with new data
            const note = new Note(note_id, update_note_title, update_note_colour, update_note_content);

            // Add new note to the Interface
            Interface.addNoteToList(note);

            // Persist note data to localStorage
            Store.addNote(note);

            // Notify user of the successful creation of a note
            Interface.showAlert('Your note was updated', 'info');

            // Close Edit Form
            Interface.closeUpdateForm();

            // Refresh Page
            setTimeout(() => document.location.reload(true), 500)

        }
    });



// Event: Remove a specific Note
document.querySelector('#note-listing')
    .addEventListener('click', (clickEvent) => {

        // Remove note from UI
        Interface.deleteNote(clickEvent.target);

    });