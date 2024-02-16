import React, { useState, useEffect } from "react";
import { FaArrowDown } from "react-icons/fa";
import "./style.css";

//Conjunto de opções de filtragem de dados da aplicação.
enum FilterOptions {
  All = "all",
  Active = "active",
  Completed = "completed",
}

export default function App() {
  const [items, setItems] = useState<{ text: string; completed: boolean }[]>([]); // Define um estado 'items' que é uma array de objetos com propriedades 'text' (string) e 'completed' (boolean),
  const [inputValue, setInputValue] = useState<string>("");
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null); // Novo estado para controlar o índice do item sobre o qual o mouse está
  const [remainingTasks, setRemainingTasks] = useState<number>(0); // Estado para armazenar o número de tarefas restantes
  const [filter, setFilter] = useState<FilterOptions>(FilterOptions.All); // Estado para controlar o filtro atual


  useEffect(() => {
    const countRemainingTasks = () => {
      const remaining = items.filter((item) => !item.completed).length;
      setRemainingTasks(remaining);
    };

    countRemainingTasks();
  }, [items]);

  //Filtro para exibir os itens concluídos e os ainda ativos
  const filteredItems = items.filter((item) => {
    if (filter === FilterOptions.Active) {
      return !item.completed;
    } else if (filter === FilterOptions.Completed) {
      return item.completed;
    }
    return true;
  });

  //Adição de tarefa
  const addItem = () => {
    if (inputValue.trim() !== "") {
      setItems([...items, { text: inputValue.trim(), completed: false }]);
      setInputValue("");
    }
  };

  //Remoção de tarefa
  const removeItem = (index: number) => {
    const updatedItems = [...items];
    updatedItems.splice(index, 1);
    setItems(updatedItems);
  };

  //Função que permite a entrada de novos itens à lista com a tecla Enter
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      addItem();
    }
  };

  //Mudança dos itens de Active para Completed
  const toggleComplete = (index: number) => {
    const updatedItems = [...items];
    updatedItems[index].completed = !updatedItems[index].completed;
    setItems(updatedItems);
  };

  //Permitir a edição da tarefa a partir do double click
  const handleDoubleClick = (index: number) => {
    setEditIndex(index);
  };

  const handleEdit = (index: number, newText: string) => {
    const updatedItems = [...items];
    updatedItems[index].text = newText;
    setItems(updatedItems);
  };
  //
  
  //Desativar o modo de edição quando o item perde o foco
  const handleEditBlur = () => {
    setEditIndex(null);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Enter") {
      setEditIndex(null);
    }
  };
  //

  const removeCompletedTasks = () => {
    const updatedItems = items.filter((item) => !item.completed);
    setItems(updatedItems);
  };

  const markAllTasksCompleted = () => {
    const updatedItems = items.map(item => ({ ...item, completed: true }));
    setItems(updatedItems);
  };

  return (
    <section className="app">
      <h1 className="title">Todos</h1>
      <div className="add-item">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="What needs to be done?"
          className="input"
        />
        <button onClick={addItem} className="add-button">Add task</button>
      </div>
      <ul className="task-list">
        {filteredItems.map((item, index) => (
          <li
            key={index}
            onMouseEnter={() => setHoverIndex(index)}
            onMouseLeave={() => setHoverIndex(null)}
            onDoubleClick={() => handleDoubleClick(index)}
            className={`task ${item.completed ? "completed" : ""} ${editIndex === index ? "editing" : ""}`}
          >
            {editIndex === index ? (
              <input
                type="text"
                value={item.text}
                onChange={(e) => handleEdit(index, e.target.value)}
                onBlur={handleEditBlur}
                onKeyPress={(e) => handleKeyPress(e, index)}
                className="edit-input"
              />
            ) : (
              <>
                <input
                  type="checkbox"
                  checked={item.completed}
                  onChange={() => toggleComplete(index)}
                  className="checkbox"
                />
                <span className="text">{item.text}</span>
                {hoverIndex === index && (
                  <button onClick={() => removeItem(index)} className="remove-button">X</button>
                )}
              </>
            )}
          </li>
        ))}
      </ul>
      <div className="task-list">
        {items.length > 0 && (
          <div className="filter-buttons">
            <button onClick={markAllTasksCompleted}>
              <FaArrowDown /> Mark all
            </button>
            <button onClick={() => setFilter(FilterOptions.All)}>All</button>
            <button onClick={() => setFilter(FilterOptions.Active)}>Active</button>
            <button onClick={() => setFilter(FilterOptions.Completed)}>Completed</button>
            <button onClick={removeCompletedTasks} className="remove-completed">Clear completed</button>
          </div>
        )}
        {items.length > 0 && <div className="remaining-tasks">{remainingTasks} Remaining tasks!</div>}
        <div className="creator-content">
          <p>Double click to edit a todo</p>
          <p>Base implementation by TodoMVC Team</p>
          <p>Reimplemented by Felipe Gutierrez</p>
        </div>
      </div>
    </section>
  );
}