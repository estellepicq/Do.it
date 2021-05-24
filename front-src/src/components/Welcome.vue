<template>
  <div class="container welcome">

    <h4>Welcome on Do.it</h4>
    <br><br>
    <router-link to="/create-todolist" tag="button" class="waves-effect waves-light btn">Create a todolist</router-link>
    <br><br>
    <div>
      <h6>OR</h6>
    </div>
    <div class="input-field">
      <input class="validate" v-bind:class="{invalid: !existingId}" id="todolistId" type="text" v-model="todolistId" v-on:keyup="checkFreeId()">
      <label for="todolistId">Enter your code here</label>
      <span class="helper-text" :data-error="helperMessage"></span>
    </div>
    <div v-if="todolistId && existingId">
      <router-link tag="button" class="waves-effect waves-light btn" :to="{ name: 'Todolist', params: { id: todolistId }}">Connect to todolist</router-link>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'welcome',
    data() {
      return {
        todolistId: undefined,
        helperMessage: '',
        existingId: true
      }
    },
    methods: {
      checkFreeId: function() {
        this.$http.get('/todos/todolistids')
          .then(function(response) {
            if(response.data.data.includes(this.todolistId)) {
              this.helperMessage = '';
              this.existingId = true;
            } else {
              this.helperMessage = 'This code does not exist';
              this.existingId = false;
            }
          });
      }
    }
  }
</script>

<style scoped>

</style>
