import Styles from './TodoList.module.css'
import Todo from '../Todo/Todo'

export default function TodoList({sortTodos, deleteTodo, toggleCompleated, toggleEditing, editTodo, setEditValue, editTime}) {
  return (
    <ul className={Styles.TodoList}>
    {
      sortTodos.length ? 
      sortTodos.map((todo) => 

      <Todo 
        key={todo.id}
        todo={todo}
        deleteTodo={deleteTodo}
        toggleCompleated={toggleCompleated}
        toggleEditing={toggleEditing}
        editTodo={editTodo}
        setEditValue={setEditValue}
        editTime={editTime}
      />

        ) : 
      <h2>It's empty...</h2>
    }
    </ul>
  )
}
