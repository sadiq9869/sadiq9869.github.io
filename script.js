const GEMINI_KEY = "AIzaSyDAm_zAas5YQdQTCI2WoxYDEOXZfwpXUDc";
const WEATHER_KEY = "49140ac22064a1ddacf11f0549413865";
const PEXELS_KEY = "7nwHEnHBPmNh8RDVsIIXnaKd6BH257Io4Sncj5NRd8XijTj9zcfE4vZg";

const chatBox = document.getElementById("chatBox");

const offlineAnswers = {
  "hi": "Hey there! 👋 I’m Supreme AI.",
  "who is your owner": "Sadiq Siddiqui is my master 👑.",
  "how are you": "I'm always ready to help!",
  "bye": "Goodbye, come back soon!",
  "hello": "Hello, friend!",
  "i love you": "I love you too 💖",
  "you are smart": "Thank you, all credits to Sadiq Siddiqui.",
  "tell me a joke": "Why did the developer go broke? Because he used up all his cache! 😄",
  "who made you": "Sadiq Siddiqui 👑 made me.",
  "what is ai": "AI stands for Artificial Intelligence — like me!"
};

function addMessage(role, text) {
  const div = document.createElement("div");
  div.className = "msg " + role;
  div.innerHTML = `<b>${role === "ai" ? "Supreme AI" : "You"}:</b> ${text}`;
  chatBox.appendChild(div);
  chatBox.scrollTop = chatBox.scrollHeight;
}

function showDebug(text) {
  const el = document.getElementById("debugOutput");
  if (el) el.textContent = text;
}

function extractGeminiReply(data) {
  try {
    const parts = data?.candidates?.[0]?.content?.parts;
    if (parts && parts[0]?.text) return parts[0].text;
  } catch {}
  return null;
}

async function chat() {
  const input = document.getElementById("userInput");
  const msg = input.value.trim().toLowerCase();
  if (!msg) return;
  addMessage("you", msg);
  input.value = "";

  const key = Object.keys(offlineAnswers).find(k => msg.includes(k));
  if (key) {
    addMessage("ai", offlineAnswers[key]);
    return;
  }

  try {
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: msg
              }
            ]
          }
        ]
      })
    });

    const data = await res.json();
    showDebug(JSON.stringify(data, null, 2));

    const reply = extractGeminiReply(data);
    if (reply) {
      addMessage("ai", reply);
    } else {
      addMessage("ai", "⚠️ Gemini responded, but gave no usable reply.");
    }

  } catch (err) {
    showDebug("❌ Error: " + err.message);
    addMessage("ai", "❌ Gemini failed. See debug.");
  }
}

function startListening() {
  try {
    const rec = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    rec.lang = "en-US";
    rec.onresult = e => {
      document.getElementById("voiceBox").value = e.results[0][0].transcript;
    };
    rec.onerror = () => alert("🎤 Voice error.");
    rec.start();
  } catch {
    alert("Speech Recognition not supported.");
  }
}

function speakCustom() {
  const text = document.getElementById("speakText").value;
  if ('speechSynthesis' in window) {
    const utter = new SpeechSynthesisUtterance(text);
    speechSynthesis.speak(utter);
  } else {
    alert("Speech not supported.");
  }
}

async function getWeather() {
  const city = document.getElementById("city").value;
  if (!city) return;
  const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${WEATHER_KEY}&units=metric`);
  const data = await res.json();
  document.getElementById("weatherOutput").textContent = JSON.stringify(data, null, 2);
}

async function searchImage() {
  const query = document.getElementById("imageQuery").value;
  if (!query) return;
  const res = await fetch(`https://api.pexels.com/v1/search?query=${query}&per_page=6`, {
    headers: { Authorization: PEXELS_KEY }
  });
  const data = await res.json();
  const out = document.getElementById("imageResults");
  out.innerHTML = "";
  data.photos.forEach(photo => {
    const img = document.createElement("img");
    img.src = photo.src.medium;
    out.appendChild(img);
  });
}
