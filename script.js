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

  try {
    const res = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=" + GEMINI_KEY, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: msg }] }]
      })
    });
    const result = await res.json();
    const reply = result?.candidates?.[0]?.content?.parts?.[0]?.text || "Gemini gave no reply.";
    addMessage("ai", reply);
  } catch (err) {
    addMessage("ai", "❌ Error: Cannot connect to Gemini.");
  }
}

function startListening() {
  const r = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
  r.lang = "en-US";
  r.onresult = e => document.getElementById("userInput").value = e.results[0][0].transcript;
  r.start();
}

function speakCustom() {
  const text = document.getElementById("speakText").value;
  if (text) {
    const utterance = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utterance);
  }
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
  const out = document.getElementById("imageResults");
  out.innerHTML = "";
  data.photos.forEach(p => {
    const img = document.createElement("img");
    img.src = p.src.medium;
    out.appendChild(img);
  });
}

