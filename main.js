const state = {
    notes: [
        {
            note: 'Das ist eine Notiz.',
            timestamp: new Date().toLocaleString()
        }
    ]
}

const getters = {
    getNotes () {
        return state.notes;
    },
    getNoteCount () {
        return state.notes.length;
    }
}

const mutations = {
    STORE_NOTE (state, payload) {
        state.notes.push(payload);
    },
    REMOVE_NOTE (state, index) {
        state.notes.splice(index, 1);
    },
    UPDATE_NOTE (state, payload) {
        state.notes[payload.index] = payload.payload;
    }
}

const actions = {
    storeNote (context, payload) {
        context.commit('STORE_NOTE', payload);
    },
    removeNote (context, timestamp) {
        const index = context.state.notes.findIndex( note => note.timestamp === timestamp );
        context.commit('REMOVE_NOTE', index);
    },
    updateNote (context, payload) {
        const index = context.state.notes.findIndex( note => note.timestamp === payload.timestamp );
        payload.timestamp = new Date().toLocaleString();
        context.commit('UPDATE_NOTE', { index, payload });
    }
}

const store = new Vuex.Store({
    state,
    getters,
    mutations,
    actions
});

const NoteCountComponent = {
    template: `
        <div>Anzahl der Notizen: <strong>{{ noteCount }}</strong></div>
    `,
    computed: {
        noteCount() {
            return this.$store.getters.getNoteCount;
        }
    }
}

const InputComponent = {
    template: `
        <input 
            type="text"
            class="form-control"
            :placeholder="placeholder"
            v-model="note"
            @keyup.enter="submitNote"
        >
    `,
    props: ['placeholder'],
    data () {
        return {
            note: ''
        }
    },
    methods: {
        submitNote() {
            const newNote = {
                note: this.note,
                timestamp: new Date().toLocaleString()
            }
            this.$store.dispatch('storeNote', newNote);
            this.note = '';
        }
    }
}

new Vue({
    el: '#app',
    store,
    components: {
        'input-component': InputComponent,
        'note-count-component': NoteCountComponent
    },
    data: {
        placeholder: 'Gib hier deine neu Notiz ein...',
        activeEditNote: null,
        activeEditNoteContent: ''
    },
    computed: {
        notes() {
            return this.$store.getters.getNotes;
        }
    },
    methods: {
        storeNote(event) {
            this.notes.push(event.note);
            this.timestamps.push(event.timestamp);
        },
        deleteNote(noteTimestamp) {
            this.$store.dispatch('removeNote', noteTimestamp);
        },
        editNote(note) {
            this.activeEditNote = note;
            this.activeEditNoteContent = this.activeEditNote.note;
        },
        updateNote() {       
            const newNote = {
                note: this.activeEditNoteContent,
                timestamp: this.activeEditNote.timestamp
            };
            this.$store.dispatch('updateNote', newNote);
            this.activeEditNote = null;
        }
    }
});