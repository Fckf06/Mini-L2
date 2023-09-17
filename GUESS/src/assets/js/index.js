

function randomNum(from, to) {
  let num = Math.round(Math.random()*to)
  while (num < from) num = Math.round(Math.random()*to)
  
  return num
}

const data = {
  tries: 1,
  from: 1,
  to: 100
}
data.correctNum = randomNum(data.from, data.to)

console.log(data);
main_button.addEventListener('click', e => {
  e.preventDefault()

  if (main_button.innerText === 'Рестарт') {
    data.tries = 1
    document.querySelector('.info').children[1].innerText = `Попытки: 0`
    document.querySelector('.info').firstElementChild.innerText = `Подсказка:`
    document.querySelector('.description').innerText = `Угадайте число от ${data.from} до ${data.to}`
    main_input.disabled = false
    main_button.innerText = 'Проверить'
    data.correctNum = randomNum(data.from, data.to)
    console.log(data);
    return
  }

  if (+data.inputValue === +data.correctNum) {
    document.querySelector('.description').innerText = `Поздравляю, вы отгадали число ${data.correctNum}!`
    document.querySelector('.info').children[1].innerText = `Попытки: ${data.tries}`
    document.querySelector('.info').firstElementChild.innerText = `Подсказка:`

    data.tries = 0
    main_input.value = ''
    main_input.disabled = true
    main_button.innerText = 'Рестарт'
    data.inputValue = ''
    return 
  }
  if (+data.inputValue < data.from || +data.inputValue > data.to) {
  
    document.querySelector('.info').children[1].innerText = `Попытки: ${data.tries}`
    document.querySelector('.info').firstElementChild.innerText = 'Подсказка: Вне диапазона'
    ++data.tries

  } else if (+data.inputValue > +data.correctNum && data.tries % 3 === 0) {
    
    document.querySelector('.info').children[1].innerText = `Попытки: ${data.tries}`
    document.querySelector('.info').firstElementChild.innerText = `Подсказка: Число меньше и число ${+data.correctNum % 2 === 0 ? 'четное' : 'нечетное'}`
    ++data.tries

  } else if (+data.inputValue < +data.correctNum && data.tries % 3 === 0) {
    
    document.querySelector('.info').children[1].innerText = `Попытки: ${data.tries}`
    document.querySelector('.info').firstElementChild.innerText = `Подсказка: Число больше и число ${+data.correctNum % 2 === 0 ? 'четное' : 'нечетное'}`
    ++data.tries

  } else if (+data.inputValue < +data.correctNum && !data.tries % 3 === 0) {
    
    document.querySelector('.info').children[1].innerText = `Попытки: ${data.tries}`
    document.querySelector('.info').firstElementChild.innerText = 'Подсказка: Число больше'
    ++data.tries
 
  } else if (+data.inputValue > +data.correctNum && !data.tries % 3 === 0) {
    
    document.querySelector('.info').children[1].innerText = `Попытки: ${data.tries}`
    document.querySelector('.info').firstElementChild.innerText = 'Подсказка: Число меньше'
    ++data.tries
 
  } 
  main_input.value = ''
  delete data.inputValue 
  console.log(0 % 3);
})

main_input.addEventListener('input', e => {
  console.log(e.target.value);

  if (isFinite(e.target.value)) {
    data.inputValue = e.target.value
  } else {
    e.target.value = ''
  }
})

settings_form.addEventListener('click', e => {

  if (e.target.nodeName === 'BUTTON') {
    e.preventDefault()

    if (settings_input.value.match(/\d+-\d+/)) {
      [data.from, data.to] = settings_input.value.split('-')
      data.tries = 0
      document.querySelector('.info').children[1].innerText = `Попытки: 0`
      document.querySelector('.info').firstElementChild.innerText = `Подсказка:`
      document.querySelector('.description').innerText = `Угадайте число от ${data.from} до ${data.to}`
      data.correctNum = randomNum(data.from, data.to)
      settings_input.value = ''
      main_input.disabled = false
      main_button.innerText = 'Проверить'
      console.log(data);
    }

  }
})
settings_input.addEventListener('input', e => {
  if (e.target.value.match(/[a-zA-Z]/)) settings_input.value = ''
})
settings.addEventListener('click', e => {
  settings_form.classList.toggle('active')
})
settings_button.addEventListener('click', () => {
  settings_form.classList.remove('active')
})

