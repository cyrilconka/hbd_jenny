const revealItems = document.querySelectorAll(".reveal");
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
revealItems.forEach((item) => observer.observe(item));

const envelope = document.getElementById("envelope");
const letterFull = document.getElementById("letter-full");
const closeLetter = document.getElementById("close-letter");
const letterInstruction = document.querySelector(".letter-instruction");

envelope.addEventListener("click", () => {
  const isOpen = envelope.classList.toggle("open");
  envelope.setAttribute("aria-expanded", String(isOpen));
  letterFull.hidden = !isOpen;
  letterInstruction.textContent = isOpen ? "Your letter is below. Scroll down to read." : "A little letter, sealed with love. Tap the envelope.";
});
closeLetter.addEventListener("click", () => {
  envelope.classList.remove("open");
  envelope.setAttribute("aria-expanded", "false");
  letterFull.hidden = true;
  letterInstruction.textContent = "A little letter, sealed with love. Tap the envelope.";
});

const audio = document.getElementById("prayer-audio");
const playButton = document.getElementById("play-button");
const audioTime = document.getElementById("audio-time");
const audioProgress = document.getElementById("audio-progress");
const prayerEnd = document.getElementById("prayer-end");

function formatTime(seconds) {
  if (!Number.isFinite(seconds)) return "00:00";
  const mins = Math.floor(seconds / 60).toString().padStart(2, "0");
  const secs = Math.floor(seconds % 60).toString().padStart(2, "0");
  return `${mins}:${secs}`;
}
function updateAudio() {
  const duration = audio.duration || 0;
  const current = audio.currentTime || 0;
  audioTime.textContent = `${formatTime(current)} / ${formatTime(duration)}`;
  audioProgress.style.width = duration ? `${(current / duration) * 100}%` : "0%";
}
playButton.addEventListener("click", async () => {
  if (!audio.getAttribute("src")) return;
  if (audio.paused) {
    try {
      await audio.play();
      playButton.textContent = "Ⅱ";
      playButton.setAttribute("aria-label", "Pause prayer");
    } catch {
      audioTime.textContent = "Add your prayer recording first";
    }
  } else {
    audio.pause();
  }
});
audio.addEventListener("loadedmetadata", updateAudio);
audio.addEventListener("timeupdate", updateAudio);
audio.addEventListener("pause", () => {
  playButton.textContent = "▶";
  playButton.setAttribute("aria-label", "Play prayer");
});
audio.addEventListener("play", () => {
  playButton.textContent = "Ⅱ";
  playButton.setAttribute("aria-label", "Pause prayer");
});
audio.addEventListener("ended", () => {
  playButton.textContent = "▶";
  prayerEnd.hidden = false;
  updateAudio();
});

