import Styles from './Todo.module.css'
import ModalEditTodo from '../ModalEditTodo/ModalEditTodo'


export default function Todo({todo, deleteTodo, toggleCompleated, toggleEditing, editTodo, setEditValue, editTime}) {
  return (
    <>
      <li className={`${Styles.Todo} ${todo?.deleting ? Styles.remove : ''}`}>
        <button onClick={() => {toggleCompleated(todo.id)}} className="material-symbols-outlined">{todo.compleated ? 'check_box' : 'check_box_outline_blank'}</button>
        <div>
          <div>
            <span>{new Date(todo.id).toLocaleDateString()}</span>
            <span>{new Date(todo.id).toLocaleTimeString()}</span>
          </div>
          <div>{todo.title}</div>
        </div>
        <div className={todo.compleated ? Styles.success : todo.fail ? Styles.fail : ''}>
          <div>To:</div>
          <div>
            <span>{new Date(todo.endTime).toLocaleDateString()}</span>
            <span>{new Date(todo.endTime).toLocaleTimeString()}</span>
          </div>
        </div>
        <div>
          <button onClick={() => toggleEditing(todo.id)} className="material-symbols-outlined">Edit</button>
          <button onClick={() => deleteTodo(todo.id)} className="material-symbols-outlined">Delete</button>
        </div>
      </li>
      {
        todo.editing !== 'none' &&
        <ModalEditTodo 
          todo={todo} 
          toggleEditing={toggleEditing}
          editTodo={editTodo}
          setEditValue={setEditValue}
          editTime={editTime}
        />
      }
    </>
  )
}
