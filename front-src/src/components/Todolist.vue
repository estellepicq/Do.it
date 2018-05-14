<template>
  <div class="container todolist">

    <h4>To-do list <small>[{{todolistId}}]</small></h4>

    <form v-on:submit="addTodo">
      <div class="input-field">
        <input id="newtodo" type="text" v-model="newTodo.item">
        <label for="newtodo">To do</label>
      </div>
      <div class="row">
        <div class="left-align col s6">
          <router-link class="waves-effect waves-light btn grey lighten-1" to="/">Go home</router-link>
        </div>
        <div class="right-align col s6">
          <button class="btn waves-effect waves-light" type="submit">Add
            <i class="material-icons right">add</i>
          </button>
        </div>
      </div>
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

  var socket = io.connect('http://localhost:4000/'); //Replace by 'http://yourdomain.com:4000' once online

  export default {
    name: 'todolist',

    data() {
      return {
        todolistId: this.$route.params.id, // We get the id specified in the url
        newTodo: {},
        todos: []
      }
    },

    methods: {
      addTodo: function(e) {
        if(this.newTodo.item !== '' && this.newTodo.item !== undefined) {
          this.$http.post('/todos/add', {newtodo: this.newTodo.item, todolistId: this.todolistId}, {headers: {'Content-Type': 'application/json'}})
          .then(function(response) {
            var addedTodo = {
              item: response.data.data.item,
              done: false,
              _id: response.data.data.id,
              todolistId: this.todolistId
            };
            socket.emit('addTodoServer', addedTodo); //We send the addedTodo to the server via socket.io
          })
          .catch(function(error) {
            console.log(error);
          });
          this.newTodo.item = '';
        }
        e.preventDefault();
      },
      updateTodo: function(todo) {
        this.$http.put('/todos/update/' + todo._id)
          .then(function(response) {
            socket.emit('updateTodoServer', todo); //We send the todo to update to the server via socket.io
          })
          .catch(function(error) {
            console.log(error);
          });
      },
      deleteTodo: function(todo) {
        this.$http.delete('/todos/delete/' + todo._id)
          .then(function(response) {
            socket.emit('deleteTodoServer', todo); //We send the todo to delete to the server via socket.io
          })
          .catch(function(error) {
            console.log(error);
          });
        }
    },

    created: function() {
      // this.$http.get('/todos/todolistids')
      //   .then(function(response) {
      //     if(response.data.data.includes(this.todolistId)) { //to add : OR if we come from create-todolist
            this.$http.get('/todos/all/' + this.todolistId)
              .then(function(response) {
                if(response.data.success) {
                  this.todos = response.data.data;
                }
              });
        //   } else {
        //     this.$router.push('/');
        //   }
        // });
    },

    mounted: function() {
      /* --addTodoClient-- event
        We add the new addedTodo into todos table
        -> as the socket.io event from server is a global emit, all connected clients will see the modification */
      socket.on('addTodoClient', function(data) {
        this.todos.push(data);
      }.bind(this));

      /* --deleteTodoClient-- event
        We delete the todo from todos table
        -> as the socket.io event from server is a global emit, all connected clients will see the modification */
      socket.on('deleteTodoClient', function(data) {
        for(var i = 0; i < this.todos.length; i++) {
          if(this.todos[i]._id === data._id) {
            this.todos.splice(i, 1);
          }
        }
      }.bind(this));

      /* --updateTodoClient-- event
        We update the todo in todos table
        -> as the socket.io event from server is a broadcast emit, all other connected clients will see the modification */
      socket.on('updateTodoClient', function(data) {
        for(var i = 0; i < this.todos.length; i++) {
          if(this.todos[i]._id === data._id) {
            this.todos[i].done = data.done;
          }
        }
      }.bind(this));
    }

  }

</script>

<style scoped>
 .done {
    text-decoration: line-through;
  }
</style>
