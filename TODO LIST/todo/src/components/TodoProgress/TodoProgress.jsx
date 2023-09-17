import Styles from './TodoProgress.module.css'

export default function TodoProgress({todos, value, compleated, setSort, doneTodos, clearTodos}) {
  return (
    <>
      <div className={Styles.TodoProgress}>
        <h4>Compleated: {compleated}/{todos.length}</h4>
        <div>
          <progress value={compleated} max={todos.length}></progress>
          <div>
            <button onClick={ () => doneTodos()}>Done</button>
            <button onClick={ () => clearTodos()}>Clear</button>
            <button onClick={ () => setSort()}>
              {value.sort === '⇡' ? 'Sort From⇡' : value.sort === '⇣' ? 'Sort From⇣' : 'Sort From⇡'} 
            </button>
            <button onClick={ () => setSort(true)}>
              {value.sort === '⇡' ? 'Sort To⇡' : value.sort === '⇣' ? 'Sort To⇣' : 'Sort To⇡'}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
