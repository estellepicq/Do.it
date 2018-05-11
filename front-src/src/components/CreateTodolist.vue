<template>
  <div class="container createtodolist">

    <h4>Create a todolist</h4>
    </br></br>
    <div class="input-field">
      <input class="validate" v-bind:class="{invalid: !valid}" id="newTodolistId" type="text" v-model="newTodolistId" v-on:keyup="checkExistingIds()">
      <label for="newTodolistId">Enter a code for your to-do list</label>
      <span class="helper-text" :data-error="helperMessage"></span>
    </div>
    <div v-if="newTodolistId&&valid">
      <router-link tag="button" class="waves-effect waves-light btn" :to="{ name: 'Todolist', params: { id: newTodolistId }}">Create todolist</router-link>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'createtodolist',
    data() {
      return {
        newTodolistId: '',
        helperMessage: '',
        valid: true
      }
    },
    methods: {
      checkExistingIds: function() {
        if(this.newTodolistId.length < 4) {
          this.helperMessage = 'Not long enough (4 caracters minimum)';
          this.valid = false;
        } else {
          this.$http.get('http://localhost:4000/todos/todolistids')
            .then(function(response) {
              if(response.data.data.includes(this.newTodolistId)) {
                this.helperMessage = 'Already existing code';
                this.valid = false;
              } else {
                this.helperMessage = '';
                this.valid = true;
              }
            });
        }
      }
    }
  }
</script>

<style scoped>

</style>
