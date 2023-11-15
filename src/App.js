import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";

function uuid() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

//ls to get todo
const getTodo = (key) => {
  const storedData = localStorage.getItem(key);
  return storedData ? JSON.parse(storedData) : [];
};

//ls to save todo
const saveTodo = (key, data) => {
  localStorage.setItem(key, JSON.stringify(data));
};

const App = () => {
  const [todoList, setTodoList] = useState([]);
  const [todoInputValue, setTodoInputValue] = useState("");
  const [isEditing, setEditing] = useState(false);
  const [editingTodoId, setEditingTodoId] = useState(null);

  const displayNewTodo = () => {
    const todos = getTodo("todoList");
    setTodoList(todos);
  };

  useEffect(() => {
    displayNewTodo();
  }, []);

  const createTodo = () => {
    if (!todoInputValue) {
      return;
    }

    // ls to get todo
    const todoDatabase = getTodo("todoList");
    const newTodo = {
      todoName: todoInputValue,
      id: uuid(),
      createdAt: Date.now(),
    };

    saveTodo("todoList", [...todoDatabase, newTodo]);
    setTodoInputValue("");
    displayNewTodo();
  };

  const updateTodo = () => {
    if (!todoInputValue || !editingTodoId) {
      //
      return;
    }

    const updatedTodos = todoList.map((todo) => {
      if (todo.id === editingTodoId) {
        return { ...todo, todoName: todoInputValue };
      }
      return todo;
    });

    saveTodo("todoList", updatedTodos);
    setEditing(false);
    setEditingTodoId(null);
    setTodoInputValue("");
    displayNewTodo();
  };

  //delete todo
  const deleteTodo = (todoId) => {
    Swal.fire({
      title: "Delete Todo",
      text: "Are you sure you want to delete task?",
      icon: "warning",
      showCancelButton: true,
    }).then((res) => {
      if (res.isConfirmed) {
        const updatedTodos = todoList.filter((todo) => todo.id !== todoId);
        saveTodo("todoList", updatedTodos);
        displayNewTodo();
      }
    });
  };

  const handleEditMode = (todoId, todoValue) => {
    setEditing(true);
    setEditingTodoId(todoId);
    setTodoInputValue(todoValue);
  };


  return (
    <div className="flex justify-center items-center h-screen">
      <div className="max-w-md w-full bg-white p-8 rounded-md shadow-lg">
        <header className="flex flex-row justify-center gap-10 px-5 py-4 border-b border-slate-400 max-w-lg mx-auto">
          <h1 className="text-2xl text-center font-bold text-slate-800">
            Todo-yy
          </h1>
        </header>

        <main className="px-5 mt-10 max-w-lg mx-auto">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (isEditing) {
                updateTodo();
              } else {
                createTodo();
              }
            }}
            className="flex flex-col items-center sm:flex-row gap-2"
          >
            <input
              placeholder="Put in your plans for today"
              value={todoInputValue}
              onChange={(e) => setTodoInputValue(e.target.value)}
              className="flex-1 p-2 rounded-l focus:outline-none"
              id="todo-input"
            />
            <button
              type="submit"
              className="bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-700"
            >
              {isEditing ? "Update todo" : "Add todo"}
            </button>
          </form>

          <div className="mt-5" id="todos">
            {todoList.map((todo) => (
              <section key={todo.id} className="group">
                <div className="group mb-3 flex flex-row justify-between px-3 py-2 group-hover:bg-gray-200 rounded-lg">
                  <button
                    onClick={() =>(todo.id, todo.todoName)}
                  >
                    {todo.todoName}
                  </button>
                  <div className="invisible group-hover:visible">
                    <button
                      onClick={() => handleEditMode(todo.id, todo.todoName)}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        stroke="currentColor"
                        className="w-6 h-6"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                        />
                      </svg>
                    </button>
                    <button onClick={() => deleteTodo(todo.id)}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        stroke="Red"
                        className="w-6 h-6"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </section>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
