const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')
const inputs = document.querySelectorAll('.text_input')

const coordinates = {x: 115, y: 115}
let texts = [
  {x: canvas.width/2, y: 20, text: '', id: 'top_text', font_color: '#FFFFFF',
    outline_color: '#000000', size: 30, line: 2, shadow: false}, 
  {x: canvas.width/2, y: 350, text: '', id: 'bottom_text', font_color: '#FFFFFF', 
    outline_color: '#000000', size: 30, line: 2, shadow: false}
]
let drag, img, saveImg

for (let i = 0; i < inputs.length; i++) {
  inputs[i].firstElementChild.addEventListener('input', e => addText(e,img) )
  inputs[i].children[1].addEventListener('input', e => {
    texts.find(e => e.id === inputs[i].firstElementChild.id).font_color = e.target.value
    addText(e,img)
  })
  inputs[i].children[2].addEventListener('input', e => {
    texts.find(e => e.id === inputs[i].firstElementChild.id).outline_color = e.target.value
    addText(e,img)
  })
  inputs[i].children[3].addEventListener('click', e => {
    Array.from(document.querySelectorAll('.text_modal.active')).forEach(elem => {
      if (e.target.closest('.text_input').querySelector('.text_modal') !== elem) {
        elem.classList.remove('active')
      }
    })
    inputs[i].children[4].classList.toggle('active')
  })
  inputs[i].children[4].querySelector('.input_size').addEventListener('input', e => {
    if (isFinite(e.target.value)) {
      texts.find(e => e.id === inputs[i].firstElementChild.id).size = +e.target.value
      addText(e,img)
    } else  e.target.value = ''
  })
  inputs[i].children[4].querySelector('.input_width').addEventListener('input', e => {
    if (isFinite(e.target.value)) {
      texts.find(e => e.id === inputs[i].firstElementChild.id).line = e.target.value
      addText(e,img)
    } else  e.target.value = ''
  })
  inputs[i].children[4].querySelector('.input_shadow').addEventListener('input', e => {
    texts.find(e => e.id === inputs[i].firstElementChild.id).shadow = e.target.checked
    addText(e,img)
  })
  document.querySelector('.dnwld').href = img?.src
}
function addText(e, img) {
  ctx.clearRect(0, 0, 400, 400)

  if (img) ctx.drawImage(img, 0, 0, 400, 400)

  for (let i = 0; i < texts.length; i++) {
    texts[i].id === e.target.id ? texts[i].text = e.target.value : ''
    ctx.font = `${texts[i].size}px impact`;
    ctx.textBaseline = 'top'
    texts[i].width = ctx.measureText(texts[i].text).width

    if (texts[i].shadow === true) {
      ctx.shadowColor = texts[i].outline_color
      ctx.shadowBlur = texts[i].line
      ctx.lineWidth = 0
    } else {
      ctx.shadowColor = 0
      ctx.shadowBlur = 0
      ctx.lineWidth = texts[i].line
    }

    ctx.strokeStyle = texts[i].outline_color
    ctx.fillStyle = texts[i].font_color
    ctx.strokeText(texts[i].text, texts[i].x, texts[i].y)
    ctx.fillText(texts[i].text, texts[i].x, texts[i].y)
  }
  saveCanvas(saveImg)
} 
function onMouseMove(e) {
  drag.x = e.clientX - coordinates.x
  drag.y = e.clientY - coordinates.y
  addText(e,img)
}
canvas.addEventListener('mousedown', e => {
  for (let i = 0; i < texts.length; i++) {
    if (e.clientX > texts[i].x + coordinates.x && e.clientX < texts[i].x + coordinates.x + texts[i].width &&
      e.clientY > texts[i].y + coordinates.y && e.clientY < texts[i].y + coordinates.y + texts[i].size) {
        drag = texts[i]
        canvas.addEventListener('mousemove', onMouseMove)
      }
  }
})
canvas.addEventListener('mouseup', () => canvas.removeEventListener('mousemove', onMouseMove))

add_btn.addEventListener('click', () => {
  texts.push({x: canvas.width/2, y: canvas.height/2, text: '', id: `text_${texts.length+1}`,
              font_color: '#FFFFFF', outline_color: '#000000', size: 30, line: 2})
  document.querySelector('.text_inputs').insertAdjacentHTML('beforeend', `
  <div class="text_input">
    <input id="text_${texts.length}" placeholder="Text ${texts.length}">
    <input value="#FFFFFF" class="font_color" type="color">
    <input value="#000000" class="outline_color" type="color">
    <div class="text_settings">
      <img src="./assets/img/gear-option.png">
    </div>
    <div class="text_modal">
      <div class="font_shadow">
        <label>Font shadow:</label>
        <input class="input_shadow" type="checkbox">
      </div>
      <div class="font_size">
        <label>Font size:</label>
        <input class="input_size">
      </div>
      <div class="line_width">
        <label>Line width:</label>
        <input class="input_width">
      </div>
    </div>
  </div>
  `)
  document.getElementById(`text_${texts.length}`).addEventListener('input', (e) => {
    addText(e,img)
  })
  document.querySelectorAll('.text_input')[texts.length-1].children[1].addEventListener('input', e => {
    texts.find(e => e.id === document.getElementById(`text_${texts.length}`).id).font_color = e.target.value
    addText(e,img)
  })
  document.querySelectorAll('.text_input')[texts.length-1].children[2].addEventListener('input', e => {
    texts.find(e => e.id === document.getElementById(`text_${texts.length}`).id).outline_color = e.target.value
    addText(e,img)
  })
  document.querySelectorAll('.text_input')[texts.length-1].children[3].addEventListener('click', e => {
    Array.from(document.querySelectorAll('.text_modal.active')).forEach(elem => {
      if (e.target.closest('.text_input').querySelector('.text_modal') !== elem) {
        elem.classList.remove('active')
      }
    })
    e.target.closest('.text_input').querySelector('.text_modal').classList.toggle('active')
  })

  document.querySelectorAll('.text_input')[texts.length-1].children[4].querySelector('.input_size').addEventListener('input', e => {
    if (isFinite(e.target.value)) {
      texts.find(elem => elem.id === e.target.closest('.text_input').children[0].id).size = +e.target.value
      addText(e,img)
    } else  e.target.value = ''
  })
  document.querySelectorAll('.text_input')[texts.length-1].children[4].querySelector('.input_width').addEventListener('input', e => {
    if (isFinite(e.target.value)) {
      texts.find(elem => elem.id === e.target.closest('.text_input').children[0].id).line = e.target.value
      addText(e,img)
    } else  e.target.value = ''
  })
  document.querySelectorAll('.text_input')[texts.length-1].children[4].querySelector('.input_shadow').addEventListener('input', e => {
    texts.find(e => e.id === document.getElementById(`text_${texts.length}`).id).shadow = e.target.checked
    addText(e,img)
  })
})
document.querySelector('input[type=file').addEventListener('input', e => {
  const objectUrl = URL.createObjectURL(e.target.files[0])
  img = new Image()
  img.src = objectUrl
  img.addEventListener('load', () => addText(e,img), {once: true})
})
document.querySelector('.text_delete').addEventListener('click', (e) => {
  texts = []
  document.querySelector('.text_inputs').innerHTML = ''
  addText(e,img)
})
function saveCanvas(saveImg) {
  saveImg = new Image()
  saveImg.src = canvas.toDataURL()
  document.querySelector('.dnwld').href = saveImg.src
}