import React from "react";
import "./App.css";
import { useState, useEffect } from "react";
import { FaTrashAlt } from "react-icons/fa";

const App = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");

  const API_URL = "http://localhost:3500/items";

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch(API_URL);
        const data = await response.json();
        setTasks(data);
      } catch (err) {}
    };
    fetchTasks();
  }, []);

  function setSave(newItem) {
    setTasks(newItem);
  }

  async function handleAddTask(task) {
    const id = tasks.length ? tasks[tasks.length - 1].id + 1 : 1;
    const newItem = { id, checked: false, task };
    const listItems = [...tasks, newItem];
    setSave(listItems);

    fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newItem),
    });
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!newTask) return;
    setNewTask("");
    handleAddTask(newTask);
  }

  function handleCheck(id) {
    const list = tasks.map((task) =>
      task.id === id ? { ...task, checked: !task.checked } : task
    );
    setTasks(list);

    const myItem = list.filter((item) => item.id === id);

    const REQ_URL = `${API_URL}/${id}`;
    fetch(REQ_URL, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ checked: myItem[0].checked }),
    });
  }

  function handleDelete(id) {
    const list = tasks.filter((task) => task.id !== id);
    setTasks(list);

    const REQ_URL = `${API_URL}/${id}`;
    fetch(REQ_URL, {
      method: "DELETE",
    });
  }

  const listTasks = tasks.map((task) => {
    return (
      <li
        className="list"
        key={task.id}>
        <div className="checkbox-task">
          <input
            type="checkbox"
            className="checkbox"
            checked={task.checked}
            onChange={() => handleCheck(task.id)}
          />
          <p className="task">{task.task}</p>
        </div>
        <FaTrashAlt
          className="delete"
          tabIndex="0"
          role="button"
          onClick={() => handleDelete(task.id)}
        />
      </li>
    );
  });

  return (
    <>
      <header className="header">
        <p>To Do List</p>
        <p>
          NO OF {tasks.length === 1 ? "TASK" : "TASKS"} : {tasks.length}{" "}
        </p>
      </header>
      <main>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            className="addText"
            placeholder="Add Task..."
            onChange={(e) => setNewTask(e.target.value)}
            value={newTask}
          />
          <button
            className="btn"
            type="submit">
            +
          </button>
        </form>

        {tasks.length ? (
          <ul className="list-container">{listTasks}</ul>
        ) : (
          <p style={{ fontSize: "2rem", margin: "8rem" }}>
            Your Tasks List Is Empty!
          </p>
        )}
      </main>
    </>
  );
};

export default App;
