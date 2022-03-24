const InputComponent = {
        template: `
                <input 
                    type="text" 
                    class="form-control" 
                >`   
};

new Vue({
    el: '#app',
    components: {
        "input-component": InputComponent
    }
});