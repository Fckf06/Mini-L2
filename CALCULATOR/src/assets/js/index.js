const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')
const diagram_items = document.querySelector('.diagram_items')
const list = document.querySelector('.list_wrapper')
const add_form = document.querySelector('.add_form')
const filter_form = document.querySelector('.filter_form')
const total_form = document.querySelector('.total_form')

let curValues = JSON.parse(localStorage.getItem('values')) || []
let sortedValue = []
let totalValue = JSON.parse(localStorage.getItem('totalValue')) || {value: 0, color: 'white'}
let total = curValues.reduce((p, c) => p + c.value, 0)
let diagramPieces = [totalValue, ...curValues]

curValues.forEach(e => {
  if(!e.color) generateColor(e)
})

if (!curValues.length) {
  createEmptyDiagram()
  document.querySelector('.list_wrapper').insertAdjacentHTML('beforeend', `
  <div class="list_empty">Список продуктов пуст...</div>
  `)
} else {
  setTotalValue()
  addProduct(curValues)
  createDiagram(diagramPieces)
}

function generateColor(e) {
  e.color = `rgb(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)})`
}
function createEmptyDiagram() {
  ctx.beginPath()
  ctx.arc(canvas.width / 2, canvas.height / 2, canvas.height / 2 - 2, 0,  Math.PI * 2 )
  ctx.lineWidth = 2
  ctx.fillStyle = 'white'
  ctx.stroke()
  ctx.fill()
}
function createDiagram(values) {
  let angle = Math.PI/2
  const total = values.reduce((p, c) => p + c.value, 0)

  for (let i = 0; i < values.length; i++) {
    ctx.beginPath()
    ctx.fillStyle = values[i].color
    ctx.moveTo(canvas.width / 2, canvas.height / 2)
    ctx.arc(canvas.width / 2, canvas.height / 2, canvas.height / 2 - 2, angle, angle + Math.PI * 2 * (values[i].value / total))
    ctx.lineTo(canvas.width / 2, canvas.height / 2)
    ctx.lineWidth = 2
    ctx.closePath();
    ctx.stroke()
    ctx.fill()
    angle += Math.PI * 2 * (values[i].value / total)
  }
}
function addProduct(values) {
  document.querySelector('.diagram_items').innerHTML = ''
  document.querySelector('.list_wrapper').innerHTML = ''

  filter.value ? values = sortedValue : sortedValue = []
  
  values.forEach(e => {
    if(!e.color) generateColor(e)
  })

  for (let i = 0; i < values.length; i++) {
    document.querySelector('.diagram_items').insertAdjacentHTML('beforeend', `
    <div>
      <div>№${i+1} ${values[i].value}кл</div>
      <div style ='background: ${values[i].color}'> </div>
    </div>
    `)
    document.querySelector('.list_wrapper').insertAdjacentHTML('beforeend', `
    <div class="list_item">
      <div class="item_wrapper">
        <div class="item_name">${i+1}. ${values[i].name}</div>
        <div class="item_value">${values[i].value} кл</div>
      </div>
      <button class="item_delete"><img src="../src/assets/img/delete.png"></button>
    </div>
    `)
    document.querySelectorAll('.item_delete')[document.querySelectorAll('.item_delete').length-1].addEventListener('click', e => {

      [...document.querySelectorAll('.list_item')].forEach((el,i) => {
        if (e.target.closest('.list_item') === el) {
          sortedValue = sortedValue.filter((el) => el !== values[i])
          curValues = curValues.filter((el) => el !== values[i])
          diagramPieces = diagramPieces.filter((el) => el !== values[i])
        }
      })
      e.target.closest('.list_item').remove()
      localStorage.setItem('values', JSON.stringify(curValues))
      setTotalValue()
      addProduct(curValues)
      curValues.length ? createDiagram(diagramPieces) : createEmptyDiagram()
    })
  }

  total = values.reduce((p, c) => p + c.value, 0)

  if (total > totalValue.total && totalValue.total > 0) {
    document.querySelector('.total_sum').innerHTML = `
    <div> Всего: ${total}${totalValue.total ? ' / ' + totalValue.total : ''} ккал </div>
    <div> Превышение лимита на ${total - totalValue.total} ккал! </div>
    `
  } else if (values.length) {
    document.querySelector('.total_sum').innerHTML = `Всего: ${total}${totalValue.total ? ' / ' + totalValue.total : ''} ккал`
  } else{
    document.querySelector('.total_sum').innerHTML = ''
    document.querySelector('.list_wrapper').insertAdjacentHTML('beforeend', `
    <div class="list_empty">Список продуктов пуст...</div>
    `)
  }
}
function filterValues(values, filter) {
  sortedValue = values.filter(e => {
   const regex = new RegExp(filter, 'gi')
   return e.name.match(regex)
  })
}
function sortValues(values, toggle) {
  if (toggle) {
    curValues = values.sort((a,b) => a.value - b.value)
  } else {
    curValues = values.sort((a,b) => b.value - a.value)
  }
  if (totalValue.value > 0) {
    diagramPieces = [totalValue, ...curValues]
  } else {
    diagramPieces = [...curValues]
  }
  addProduct(values)
  createDiagram(diagramPieces)
}
function setTotalValue() {

  totalValue.value = totalValue.total - curValues.reduce((p, c) => p + c.value, 0)

  if (totalValue.value > 0) {
    diagramPieces = [totalValue, ...curValues]
  } else {
    diagramPieces = [...curValues]
  }
}
add_form.addEventListener('submit', e => {
  e.preventDefault()

  if (isFinite(+add_form.children[1].value) && add_form.children[1].value) {
    ctx.clearRect(0, 0, 200, 200)
    curValues.push({name: add_form.children[0].value ,value: +add_form.children[1].value})

    setTotalValue()

    generateColor(curValues[curValues.length-1])
    localStorage.setItem('values', JSON.stringify(curValues))
    addProduct(curValues)
    createDiagram(diagramPieces)
    add_form.children[0].value = ''
    add_form.children[1].value = ''
  }

})
total_form.addEventListener('submit', e => {
  e.preventDefault()
  if (isFinite(+total_form.querySelector('input').value)) {
    totalValue.total = +total_form.querySelector('input').value
    localStorage.setItem('totalValue', JSON.stringify(totalValue))
    total_form.querySelector('input').value = ''

    setTotalValue()
    createDiagram(diagramPieces)
    addProduct(curValues)
  }
})
filter.addEventListener('input', e => {
  filterValues(curValues, e.target.value)
  addProduct(curValues)
})
reset.addEventListener('click', e => {
  e.preventDefault()
  curValues = []
  diagramPieces = []
  totalValue.total = 0
  localStorage.setItem('values', JSON.stringify(curValues))
  localStorage.setItem('totalValue', JSON.stringify(''))
  createEmptyDiagram()
  document.querySelector('.diagram_items').innerHTML = ''
  document.querySelector('.list_wrapper').innerHTML = ''
  document.querySelector('.total_sum').innerHTML = ''
  document.querySelector('.list_wrapper').insertAdjacentHTML('beforeend', `
  <div class="list_empty">Список продуктов пуст...</div>
  `)
})
sort.addEventListener('click', e => {
  e.preventDefault()
  let toggle
  if (e.target.src.includes('down')) {
    e.target.src = "../src/assets/img/sort-up.png"
    toggle = false
  } else {
    e.target.src = "../src/assets/img/sort-down.png"
    toggle = true
  }
  sortValues(curValues, toggle)
})