<template>
  <div class="container todolist">

    <h4>To-do list <small>{{todolistId}}</small></h4>

    <form v-on:submit="addTodo">
      <div class="input-field">
        <input id="newtodo" type="text" v-model="newTodo.item">
        <label for="newtodo">To do</label>
      </div>
      <button class="btn waves-effect waves-light" type="submit">Add
        <i class="material-icons right">add</i>
      </button>
    </form>
    <br>
    <ul class="collection left-align" v-if="todos.length > 0">
      <li v-for="todo in todos" class="collection-item">
        <label>
          <input type="checkbox" v-model="todo.done" v-on:change="updateTodo(todo)">
          <span :class="{done: todo.done}">
            {{todo.item}}
          </span>
          <a href="#!" v-on:click="deleteTodo(todo)" class="secondary-content"><i class="material-icons">delete</i></a>
        </label>
      </li>
    </ul>

  </div>
</template>

<script>
  export default {
    name: 'todolist',
    data() {
      return {
        todolistId: this.$route.params.id, //we get the id specified in the url
        newTodo: {},
        todos: []
      }
    },
    methods: {
      addTodo: function(e) {
        this.$http.post('http://localhost:4000/todos/add', {newtodo: this.newTodo.item, todolistId: this.todolistId}, {headers: {'Content-Type': 'application/json'}})
          .then(function(response) {
            this.todos.push({
              item: response.data.data.item,
              done: false,
              _id: response.data.data.id,
              todolistId: this.todolistId
            });
            console.log('added');
          })
          .catch(function(error) {
            console.log(error);
          });
        this.newTodo.item = '';
        e.preventDefault();
      },
      updateTodo: function(todo) {
        this.$http.put('http://localhost:4000/todos/update/' + todo._id)
          .then(function(response) {
            console.log('updated');
          })
          .catch(function(error) {
            console.log(error);
          });
      },
      deleteTodo: function(todo) {
        this.$http.delete('http://localhost:4000/todos/delete/' + todo._id)
          .then(function(response) {
            this.todos.splice(this.todos.indexOf(todo), 1);
            console.log('deleted');
          })
          .catch(function(error) {
            console.log(error);
          });
        }
    },
    created: function() {
      this.$http.get('http://localhost:4000/todos/all/' + this.todolistId)
        .then(function(response) {
          if(response.data.success) {
            this.todos = response.data.data;
          }
        });
    }
  }
</script>

<style scoped>
 .done {
    text-decoration: line-through;
  }
</style>
