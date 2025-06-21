const OPENAI_KEY = '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';
const PEXELS_KEY = '7nwHEnHBPmNh8RDVsIIXnaKd6BH257Io4Sncj5NRd8XijTj9zcfE4vZg';
const WEATHER_KEY = '49140ac22064a1ddacf11f0549413865';

let chatBox = document.getElementById('chatBox');
let userInput = document.getElementById('userInput');

async function chat() {
  const msg = userInput.value;
  if (!msg) return;
  chatBox.innerHTML += `<div class="you"><b>You:</b> ${msg}</div>`;
  userInput.value = '';

  const reply = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${OPENAI_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: msg }]
    })
  });

  const data = await reply.json();
  const res = data.choices?.[0]?.message?.content || "Sorry, no reply.";
  chatBox.innerHTML += `<div class="ai"><b>Supreme AI:</b> ${res}</div>`;
  chatBox.scrollTop = chatBox.scrollHeight;
}

// 🎤 Voice to Text
function startListening() {
  const r = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
  r.lang = 'en-US';
  r.onresult = e => userInput.value = e.results[0][0].transcript;
  r.start();
}

// 🔊 Speak Answer
function speakAnswer() {
  const lastAI = Array.from(chatBox.querySelectorAll('.ai')).pop();
  if (!lastAI) return;
  const text = lastAI.textContent.replace('Supreme AI:', '');
  const synth = window.speechSynthesis;
  synth.speak(new SpeechSynthesisUtterance(text));
}

// ☁️ Weather
async function getWeather() {
  const city = document.getElementById('city').value;
  const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${WEATHER_KEY}&units=metric`);
  const data = await res.json();
  document.getElementById('weatherOutput').textContent = JSON.stringify(data, null, 2);
}

// 🖼️ Pexels Image Search
async function searchImage() {
  const query = document.getElementById('imageQuery').value;
  const res = await fetch(`https://api.pexels.com/v1/search?query=${query}&per_page=6`, {
    headers: { Authorization: PEXELS_KEY }
  });
  const data = await res.json();
  let out = document.getElementById('imageResults');
  out.innerHTML = '';
  data.photos.forEach(p => {
    const img = document.createElement('img');
    img.src = p.src.medium;
    img.style = "width:100px;height:100px;margin:5px;";
    out.appendChild(img);
  });
}
