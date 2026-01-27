const audio = document.getElementById("audio");
const titleEl = document.getElementById("title");
const artistEl = document.getElementById("artist");
const playBtn = document.getElementById("play");
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");
const progress = document.getElementById("progress");
const currentEl = document.getElementById("current");
const durationEl = document.getElementById("duration");

let songs = [];
let index = 0;
let isPlaying = false;

/* iOS UNLOCK AUDIO */
document.body.addEventListener("touchstart", () => {
  audio.play().then(() => audio.pause()).catch(()=>{});
}, { once: true });

/* LOAD SONGS */
fetch("songs.json")
  .then(res => res.json())
  .then(data => {
    songs = data;
    loadSong();
  });

function loadSong() {
  const song = songs[index];
  audio.src = song.src;
  titleEl.textContent = song.title;
  artistEl.textContent = song.artist;
}

function playSong() {
  audio.play();
  isPlaying = true;
  playBtn.textContent = "⏸";
}

function pauseSong() {
  audio.pause();
  isPlaying = false;
  playBtn.textContent = "▶️";
}

playBtn.onclick = () => isPlaying ? pauseSong() : playSong();

prevBtn.onclick = () => {
  index = (index - 1 + songs.length) % songs.length;
  loadSong();
  playSong();
};

nextBtn.onclick = () => {
  index = (index + 1) % songs.length;
  loadSong();
  playSong();
};

audio.addEventListener("loadedmetadata", () => {
  durationEl.textContent = formatTime(audio.duration);
});

audio.addEventListener("timeupdate", () => {
  currentEl.textContent = formatTime(audio.currentTime);
  progress.value = (audio.currentTime / audio.duration) * 100 || 0;
});

progress.oninput = () => {
  audio.currentTime = (progress.value / 100) * audio.duration;
};

function formatTime(t) {
  if (!t) return "0:00";
  const m = Math.floor(t / 60);
  const s = Math.floor(t % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}