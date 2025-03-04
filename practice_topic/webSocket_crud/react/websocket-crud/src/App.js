import "./App.css";
import { useState, useRef, useEffect } from "react";

function App() {
  const [newItem, setNewItem] = useState("");
  const [items, setItems] = useState([]);
  const ws = useRef(null);

  useEffect(() => {
    ws.current = new WebSocket("ws://localhost:8080");

    ws.current.onopen = () => {
      console.log("WebSocket connected");
    };

    ws.current.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.type === "read") {
        setItems(message.data);
      }
    };

    ws.current.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    ws.current.onclose = () => {
      console.warn("WebSocket closed. Reconnecting...");
      setTimeout(() => {
        ws.current = new WebSocket("ws://localhost:8080");
      }, 3000); // Retry connection after 3s
    };

    return () => {
      if (ws.current) ws.current.close();
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newItem.trim()) return;

    const newItemData = { id: Date.now(), name: newItem };

    ws.current.send(
      JSON.stringify({
        type: "create",
        data: newItemData,
      })
    );
    setItems((prevItems) => [...prevItems, newItemData]);

    setNewItem(""); // Corrected
  };

  const handleEdit = (item) => {
    const newName = prompt("Enter new Name : ", item.name);
    if (newName !== null && newName.trim() !== "") {
      let newItemData = { id: item.id, name: newName };
      ws.current.send(
        JSON.stringify({
          type: "update",
          data: newItemData,
        })
      );
      setItems((prevItems) =>
        prevItems.map((i) => (i.id === item.id ? newItemData : i))
      );
    }
  };

  const handleDelete = (id) => {
    if (window.confirm("are you sure do you want to delete this item")) {
      ws.current.send(
        JSON.stringify({
          type: "delete",
          data: { id },
        })
      );
      setItems((prevItems) => prevItems.filter((item) => item.id !== id));
    }
  };

  return (
    <div className="App">
      <h1>Websocket CRUD</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          placeholder="new item name"
        />
      </form>
      <button type="submit">Add Item</button>
      <ul>
        {items.map((item) => (
          <li key={item.id}>
            <span>{item.name}</span>
            <button onClick={() => handleEdit(item)}>Edit</button>
            <button onClick={() => handleDelete(item.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
