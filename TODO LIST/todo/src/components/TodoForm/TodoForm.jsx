import Styles from './TodoForm.module.css'

export default function TodoForm({setValue, value, addTodo, addTime, checkToken}){
  return (
    <form className={Styles.TodoForm} onSubmit={addTodo}>
      <input
        value={value.title}  
        onChange={e => {checkToken(), setValue(prev => prev = {...prev, title: e.target.value})}} 
        placeholder= {'Enter the todo'}
      />
      <input 
        type='date'
        value={value.date} 
        onChange={addTime} 
        placeholder= {'Enter the todo'}
      />
      <input 
        type='time'
        value={value.time} 
        onChange={addTime}  
        placeholder= {'Enter the todo'}
      />
      <button className="material-symbols-outlined">Add</button>
    </form>
  )
}