const GEMINI_KEY = 'AIzaSyDAm_zAas5YQdQTCI2WoxYDEOXZfwpXUDc';
const WEATHER_KEY = '49140ac22064a1ddacf11f0549413865';
const PEXELS_KEY = '7nwHEnHBPmNh8RDVsIIXnaKd6BH257Io4Sncj5NRd8XijTj9zcfE4vZg';

const chatBox = document.getElementById("chatBox");

function addMessage(role, text) {
  const div = document.createElement("div");
  div.className = "msg " + role;
  div.innerHTML = "<b>" + (role === "ai" ? "Supreme AI" : "You") + ":</b> " + text;
  chatBox.appendChild(div);
  chatBox.scrollTop = chatBox.scrollHeight;
}

async function chat() {
  const input = document.getElementById("userInput");
  const msg = input.value.trim();
  if (!msg) return;
  addMessage("you", msg);
  input.value = "";

  const res = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=" + GEMINI_KEY, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ contents: [{ parts: [{ text: msg }] }] })
  });
  const data = await res.json();
  const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I can't answer that.";
  addMessage("ai", reply);
}

function startListening() {
  const rec = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
  rec.lang = "en-US";
  rec.onresult = (e) => document.getElementById("userInput").value = e.results[0][0].transcript;
  rec.start();
}

function speakAnswer() {
  const msgs = document.querySelectorAll(".ai");
  if (!msgs.length) return;
  const last = msgs[msgs.length - 1].textContent.replace("Supreme AI:", "");
  window.speechSynthesis.speak(new SpeechSynthesisUtterance(last));
}

async function getWeather() {
  const city = document.getElementById("city").value;
  const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${WEATHER_KEY}&units=metric`);
  const data = await res.json();
  document.getElementById("weatherOutput").textContent = JSON.stringify(data, null, 2);
}

async function searchImage() {
  const query = document.getElementById("imageQuery").value;
  const res = await fetch("https://api.pexels.com/v1/search?query=" + query + "&per_page=6", {
    headers: { Authorization: PEXELS_KEY }
  });
  const data = await res.json();
  const results = document.getElementById("imageResults");
  results.innerHTML = "";
  data.photos.forEach(p => {
    const img = document.createElement("img");
    img.src = p.src.medium;
    img.style = "width: 100px; margin: 5px;";
    results.appendChild(img);
  });
}

