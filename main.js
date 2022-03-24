const EventBus = new Vue();

const NoteCountComponent = {
    template:  `
        <div>Anzahl der Notizen: <strong> {{ noteCount }}</strong></div>
    `,
    data() {
        return {
            noteCount: 0
        }   
    },
    created() {
        EventBus.$on('new-note', event => this.noteCount++ );
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
            data ()   {
                return {
                    note: ''
                }
            }, 
            methods: {
                submitNote() {
                    EventBus.$emit("new-note", {
                        note: this.note,
                        timeStamp: new Date().toLocaleString()
                    });
                    this.note = '';
                }
            }
};

new Vue({
    el: '#app',
    components: {
        "input-component": InputComponent,
        "note-count-compnent": NoteCountComponent
    },
    data: {
        notes: [],
        timeStamps: [],
        placeholder: 'Gibt hir deine neu Notiz ein . . . '
    },
    methods: {
        storeNote(event) {
            this.notes.push(event.note);
            this.timeStamps.push(event.timeStamp)
        }
    },
    created() {
        EventBus.$on('new-note', event => this.storeNote(event))
    }
});