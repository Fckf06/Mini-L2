import React from 'react'
import './App.css'
import TodoProgress from './components/TodoProgress/TodoProgress'
import TodoForm from './components/TodoForm/TodoForm'
import TodoList from './components/TodoList/TodoList'
import Login from './components/Login/Login'
import authContext from './context'
import Signup from './components/Signup/Signup'

export default function App() {

  const [value, setValue] = React.useState({title: '', date: '', time: '', sort: '⇡'})
  const [editValue, setEditValue] = React.useState({title: '', date: '', time: ''})
  const [todos, setTodos] = React.useState(JSON.parse(localStorage.getItem('todos')) || [])
  const [sortTodos, setSortTodos] = React.useState(todos)
  const [auth, setAuth] = React.useState(JSON.parse(localStorage.getItem('login')) || 
  {auth: false, signup: false, password: '', login: '', value: '', db: {password: '', login: '', value: '', end: ''}})

  function addTodo(e) {
    e.preventDefault()
    checkToken() 
    const newTodo = {
      id: Date.now(),
      title: value.title,
      compleated: false,
      deleting: false,
      fail: false,
      editing: 'none',
      sort: '⇡',
      date: value.date,
      time: value.time,
      endTime: +new Date(`${value.date}T${value.time}`),
    }

    if (value.title && value.time && value.date && +new Date(`${value.date}T${value.time}`) > Date.now()) {
      setTodos(prev => {
        localStorage.setItem('todos' , JSON.stringify([...prev, newTodo]))
        return [...prev, newTodo]
      })
      setValue(() => ({date: '', time: '', title: '', sort: '⇡'}))
    }

  }
  function addTime(e) {
    checkToken() 
    if (e.target.type === 'date') {
      setValue(prev => ({...prev, date: e.target.value}))
    } else {
      setValue(prev => ({...prev, time: e.target.value}))
    }
  }
  function editTime(e) {
    checkToken() 
    if (e.target.type === 'date') {
      setEditValue(prev => ({...prev, date: e.target.value}))
    } else {
      setEditValue(prev => ({...prev, time: e.target.value}))
    }
  }
  function deleteTodo(id) {
    checkToken() 
    setTodos(prev => prev.map(e => {
      return e.id === id ? {...e, deleting: true} : e
    }))
    setTimeout(() => {
      setTodos(prev => {
        localStorage.setItem('todos' , JSON.stringify(prev.filter(e => e.id !== id)))
        return prev.filter(e => e.id !== id)})
      }, 500)
  }
  function toggleEditing(id) {
    checkToken() 
    setTodos(prev => {
     prev = prev.map(e => e.id === id ? {...e, editing: e.editing === 'none' ? 'editing' : 'edited'} : e)
     localStorage.setItem('todos', JSON.stringify(prev))
     return prev
  })
  }
  function editTodo(id, edited) {
    checkToken() 
    if (edited) {
      setTimeout(() => {
        setTodos(prev => {
         prev =  prev.map(e => {
            return e.id === id ? {
              ...e, editing: 'none', 
              title: editValue.title, 
              date: editValue.date || value.date, 
              time: editValue.time || value.time, 
              fail: +new Date(`${editValue.date}T${editValue.time}`) <= Date.now(),
              endTime: +new Date(`${editValue.date}T${editValue.time}`)
            } : e
         })
         localStorage.setItem('todos', JSON.stringify(prev.map(e => ({...e, editing: 'none'}))))
         return prev
        })
      }, 500)

    } else {

      setTimeout(() => {
        setTodos(prev => {
          prev = prev.map(e => ({...e, editing: 'none'}))
          localStorage.setItem('todos', JSON.stringify(prev))
          return prev
      })
      }, 500)  

    } 
  }
  function toggleCompleated(id) {
    checkToken() 
    setTodos(prev => {
      prev = prev.map(e => e.id === id ? {...e, compleated: !e.compleated} : e)
      localStorage.setItem('todos' , JSON.stringify(prev))
      return prev
    })
  }
  function setFail(id) {
    checkToken() 
    if (id) {
      setTodos(prev => prev.map((e,i) => i === id ? {...e, fail: true} : e))
    } else {
      setTodos(prev => prev.map((e,i) => e.endTime <= Date.now() && !e.compleated ? {...e, fail: true} : e))
    }
  }
  function setSort(type) {
    checkToken() 
    if (type && value.sort === '⇡') {
      setSortTodos(prev => prev.sort((a, b) => b.endTime - a.endTime))
      setValue(prev => ({...prev, sort: '⇣'}))
    } else if (type && value.sort === '⇣') {
      setSortTodos(prev => prev.sort((a, b) => a.endTime - b.endTime))
      setValue(prev => ({...prev, sort: '⇡'}))
      
    } else if (!type && value.sort === '⇣') {
      setSortTodos(prev => prev.sort((a, b) => a.id - b.id))
      setValue(prev => ({...prev, sort: '⇡'}))

    } else if (!type && value.sort === '⇡') {
      setSortTodos(prev => prev.sort((a, b) => b.id - a.id))
      setValue(prev => ({...prev, sort: '⇣'}))
    }
  }
  function doneTodos() {
    checkToken() 
    setTodos(prev => {
      prev = prev.map(e => ({...e, compleated: true}))
      localStorage.setItem('todos', JSON.stringify(prev))
      return prev
    })
  }
  function clearTodos() {
    checkToken() 
    setTodos(prev => {
      prev = []
      localStorage.setItem('todos', JSON.stringify(prev))
      return prev
    })
  }
  function checkToken() {
    if (auth.db.value === auth.value && auth.db.end <= Date.now()) {
      setAuth(prev => ({...prev, auth: false, value: '', db: {...prev.db, value: '', end: ''}}))
    }
  }
React.useEffect(() => setFail(), [])
React.useEffect(() => {
  let fails = []
  let notices = []
  checkToken()
  setSortTodos(() => todos)
  todos.forEach((e,i) => {
    if (e.endTime - Date.now() > 0 && !e.compleated) {
    fails[i] = setTimeout(() => {
        alert(`Срок выполнения "${e.title}" истек`)
        setFail(i)
      }, e.endTime - Date.now())
    }
    if (e.endTime - Date.now() >= 3600000 && !e.compleated) {
      notices[i] = setTimeout(() => {
        alert(`Срок выполнения "${e.title}" истекает через час`)
      }, e.endTime - Date.now() - 3600000)
    }
  });
  return () => todos.forEach((_,i) => {
    clearTimeout(fails[i])
    clearTimeout(notices[i])
  })
}, [todos])

  return (
    <authContext.Provider value={{auth, setAuth}}>
    {
      auth.signup && !auth.auth ? <Signup/> : !auth.signup && !auth.auth ? <Login/> : ''
    }

    <main className="App">
      <h1>Todo List</h1>
      <TodoForm
        value={value}
        setValue={setValue}
        addTime={addTime}
        addTodo={addTodo}
        checkToken={checkToken}
      />
      <TodoList
        sortTodos={sortTodos}
        deleteTodo={deleteTodo}
        toggleCompleated={toggleCompleated}
        toggleEditing={toggleEditing}
        editTodo={editTodo}
        setEditValue={setEditValue}
        editTime={editTime}
      />
      {
        sortTodos.length !== 0
        && 
        <TodoProgress
          todos={todos}
          value={value}
          setSort={setSort}
          doneTodos={doneTodos}
          clearTodos={clearTodos}
          setTodos={setTodos}
          compleated={todos.filter(e => e.compleated)?.length}
        />
      }
    </main>
    </authContext.Provider>
  )
}