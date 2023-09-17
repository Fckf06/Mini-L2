import WaveSurfer from 'https://unpkg.com/wavesurfer.js@7/dist/wavesurfer.esm.js'

const song_name = document.querySelector('.song_name')
const play = document.querySelector('.play')
const next = document.querySelector('.next')
const prev = document.querySelector('.prev')
const range = document.querySelector('input[type=range]')
const audio = document.querySelector('audio')
const volume = document.querySelector('.volume_img')
const repeat = document.querySelector('.repeat')
const shuffle = document.querySelector('.shuffle')
const list = document.querySelector('.list_wrapper')

let arr = ['MACAN, Jakone, A.V.G - Че Как.mp3', 
'Miyagi & Andy Panda - Патрон.mp3',
'Niletto, Олег Майами, Леша Свик - Не вспоминай.mp3',
'Jakone, SCIRENA - Там Там.mp3',
'WHITE GALLOWS, SCIRENA - Ferrari.mp3',]

localStorage.getItem('songs') ? '' : localStorage.setItem('songs', JSON.stringify(arr))
let songs = JSON.parse(localStorage.getItem('songs'))

let wavesurfer
const control = {
  current: 0,
  volume: 0.5,
  play: false,
  repeat: false,
  shuffle: false
}

song_name.innerText = songs[control.current]
createWave()

play.addEventListener('click', () => {
  if (control.play) {
    play.firstElementChild.src = './assets/img/play.png'
    wavesurfer.pause()
    control.play = false
  } else {
    play.firstElementChild.src = './assets/img/pause.png'
    wavesurfer.play()
    control.play = true
  }
})

next.addEventListener('click', () => {
  getNextSong(control, songs, '+')
  createWave()
})
prev.addEventListener('click', () => {
  getNextSong(control, songs, '-')
  createWave()
})
range.addEventListener('input', () => {
  control.volume = range.value/100
  audio.volume = control.volume
  if (!audio.volume) {
    volume.src = './assets/img/mute.png'
  } else {
    volume.src = './assets/img/volume.png'
  }
})
volume.addEventListener('click', () => {
  console.log('asdas');
  if (audio.volume) {
    volume.src = './assets/img/mute.png'
    range.value = '0'
    audio.volume = '0'
    console.log(range.value);
  } else {
    volume.src = './assets/img/volume.png'
    range.value = control.volume*100
    audio.volume = control.volume ? control.volume : control.volume + 0.1
  }
})
repeat.addEventListener('click', () => {

  if(!control.repeat) {
    repeat.firstElementChild.style.opacity = 0.5
    shuffle.firstElementChild.style.opacity = 1
    control.shuffle = false
  } else {
    repeat.firstElementChild.style.opacity = 1
  }
  control.repeat = !control.repeat
})
shuffle.addEventListener('click', () => {
  if(!control.shuffle) {
    shuffle.firstElementChild.style.opacity = 0.5
    repeat.firstElementChild.style.opacity = 1
    control.repeat = false
  } else {
    shuffle.firstElementChild.style.opacity = 1
  }

  control.shuffle = !control.shuffle
})


list.addEventListener('click', e => {
  if (e.target.closest('.item_play')) {
    let name = e.target.closest('.list_item').querySelector('.item_name').innerText
    songs.forEach((e,i) => e === name ? control.current = i : '')
    createWave()
  }
})

function createWave() {
  song_name.innerText = songs[control.current]
  if (!control.play) {
    play.firstElementChild.src = './assets/img/play.png'
  } else {
    play.firstElementChild.src = './assets/img/pause.png'
  }

  waveform.innerHTML = ''
  wavesurfer = WaveSurfer.create({
    container: '#waveform',
    waveColor: 'rgba(255, 255, 255, 1)',
    progressColor: 'rgba(214, 61, 125, 1)',
    media: audio,
    url: `./assets/audio/${songs[control.current]}`,
    barWidth: 2,
    barGap: 1,
    barRadius: 1,
    height: 25
  })

  wavesurfer.on('timeupdate',  (t) => {
    const [seconds, minutes] = convertTime(t)
    document.querySelector('.current_time').innerText = `${minutes}:${seconds}`
  })

  wavesurfer.on('ready', d => {
    const [seconds, minutes] = convertTime(d)
    document.querySelector('.full_time').innerText = `${minutes}:${seconds}`
    if (control.play) wavesurfer.play()
  })

  list.innerHTML = ''
  songs.map((e,i) => {
    list.insertAdjacentHTML('beforeend', `
    <div class="list_item ${control.current === i ? 'active' : ''}">
      <div class="item_img">
        <img src="./assets/img/audio.png">
      </div>
      <div class="item_name">${e}</div>
      <div class="item_img item_play">
      <img src="./assets/img/play2.png">
    </div>
    </div>
    `)
  })
}

wavesurfer.on('finish', () => {
  if (control.current !== songs.length-1 && !control.shuffle && !control.repeat) {
    getNextSong(control, songs, '+')
    createWave()
  } else {
    play.firstElementChild.src = './assets/img/play.png'
  }
})
let wave = new Wave(audio, animation_wave)
wave.addAnimation(new wave.animations.Lines({
  lineWidth: 4,
  lineColor: "rgba(209, 60, 122, 1)",
  fillColor: 'red',
  rounded: true,
  count: 20
}));
function convertTime(t) {
  const seconds  = Math.floor(t)%60 < 10 ? `0${Math.floor(t)%60}` : Math.floor(t)%60
  const minutes = Math.floor(t/60) < 10 ? `0${Math.floor(t/60)}` : Math.floor(t/60)
  return [seconds, minutes]
}
function getNextSong(control, songs, type) {
  if (!control.repeat && !control.shuffle) {
    if (type === '+') {
      control.current + 1 > songs.length-1 ? control.current : control.current += 1
    } else {
      control.current - 1 < 0 ? control.current : control.current -= 1
    }
  } else if (control.shuffle) {
    let rndm = +(Math.random()*(songs.length-1)).toFixed(0)
    while (rndm === control.current) rndm = +(Math.random()*(songs.length-1)).toFixed(0)
    control.current = rndm
  }
}
