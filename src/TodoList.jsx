import React, { useState, useEffect } from "react";
import "./App.css";

const TodoApp = () => {
  const stored = JSON.parse(localStorage.getItem("todos")) || [];
  const [todos, setTodos] = useState(stored);
  const [newTodo, setNewTodo] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState("");
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem("todos");
    if (stored) setTodos(JSON.parse(stored));
  }, []);

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  const addTodo = () => {
    if (!newTodo.trim()) return;
    const updatedTodos = [
      ...todos,
      {
        id: Date.now(),
        text: newTodo.trim(),
        completed: false,
      },
    ];
    setTodos(updatedTodos);
    setNewTodo("");
    localStorage.setItem("todos", JSON.stringify(updatedTodos));
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const toggleComplete = (id) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const startEditing = (id, text) => {
    setEditingId(id);
    setEditingText(text);
  };

  const saveEdit = (id) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, text: editingText } : todo
      )
    );
    setEditingId(null);
    setEditingText("");
  };

  const filteredTodos = todos.filter((todo) => {
    const matchFilter =
      filter === "all" ||
      (filter === "completed" && todo.completed) ||
      (filter === "incomplete" && !todo.completed);

    const matchSearch = todo.text.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  return (
    <div style={{ maxWidth: 600, margin: "auto", padding: 20 }}>
      <h1>📝 Todo List</h1>

      <div style={{ marginBottom: 10 }}>
        <input
          type="text"
          placeholder="Nhập công việc..."
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
        />
        <button
          className="btn-them"
          onClick={addTodo}
          style={{ marginLeft: 5 }}
        >
          Thêm
        </button>
      </div>

      <div style={{ marginBottom: 10 }}>
        <input
          type="text"
          placeholder="Tìm kiếm..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div style={{ marginBottom: 10 }}>
        <button
          className={`btn ${filter === "all" ? "active" : ""}`}
          onClick={() => setFilter("all")}
        >
          Tất cả
        </button>
        <button
          className={`btn ${filter === "completed" ? "active" : ""}`}
          onClick={() => setFilter("completed")}
          style={{ marginLeft: 5 }}
        >
          Hoàn thành
        </button>
        <button
          className={`btn ${filter === "incomplete" ? "active" : ""}`}
          onClick={() => setFilter("incomplete")}
          style={{ marginLeft: 5 }}
        >
          Chưa hoàn thành
        </button>
      </div>

      <ul style={{ listStyle: "none", padding: 0 }}>
        {filteredTodos.map((todo) => (
          <li
            key={todo.id}
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              marginBottom: 5,
              textDecoration: todo.completed ? "line-through" : "none",
              padding: "10px",
              backgroundColor: "#fff",
              borderRadius: "8px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              wordBreak: "break-word",
              maxWidth: "100%",
            }}
          >
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => toggleComplete(todo.id)}
            />

            {editingId === todo.id ? (
              <>
                <input
                  value={editingText}
                  onChange={(e) => setEditingText(e.target.value)}
                  style={{ marginLeft: 10 }}
                />
                <button className="btn" onClick={() => saveEdit(todo.id)}>
                  Lưu
                </button>
              </>
            ) : (
              <>
                <span
                  style={{
                    marginLeft: 10,
                    flexGrow: 1,
                    wordBreak: "break-word",
                    whiteSpace: "pre-wrap",
                    overflowWrap: "break-word",
                    maxWidth: "404px",
                  }}
                >
                  {todo.text}
                </span>
                <button
                  className="btnsua"
                  onClick={() => startEditing(todo.id, todo.text)}
                >
                  Sửa
                </button>
              </>
            )}
            <button
              className="btnxoa"
              onClick={() => deleteTodo(todo.id)}
              style={{ marginLeft: 5 }}
            >
              🗑
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodoApp;
