
import Styles from './ModalEditTodo.module.css';


export default function ModalEditTodo({todo, toggleEditing, editTodo, setEditValue, editTime}) {
  return (
    <div onClick={e => {
      e.stopPropagation()
      toggleEditing(todo.id)
      editTodo(todo.id, false)
      setEditValue({title: '', date: '', time: ''})
      }} 
      className={todo.editing === 'edited' ? `${Styles.ModalEditTodo} ${Styles.disappear}` : Styles.ModalEditTodo}
    >
      <div onClick={e => e.stopPropagation()} className={todo.editing === 'edited' ? Styles.remove : Styles.appear}>
        <h1>Edit Todo</h1>
        <form>
          <input 
            onChange={e => setEditValue(prev => ({...prev, title: e.target.value}))} 
            placeholder= {'Enter the todo'}
          />
          <div>
            <input type='date' onChange={ e => editTime(e)}/>  
            <input type='time' onChange={e => editTime(e)}  
            />
          </div>
          <button onClick={e => {e.preventDefault(), toggleEditing(todo.id), editTodo(todo.id, true)}}>Edit</button>
        </form>
      </div>
    </div>
  )
}
