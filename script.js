const OPENAI_API_KEY = "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";
const PEXELS_API_KEY = "7nwHEnHBPmNh8RDVsIIXnaKd6BH257Io4Sncj5NRd8XijTj9zcfE4vZg";
const WEATHER_API_KEY = "49140ac22064a1ddacf11f0549413865";

// ChatGPT
document.getElementById("chatForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const input = document.getElementById("chatInput").value;
  addMessage("You", input);
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + OPENAI_API_KEY,
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: input }],
    }),
  });
  const data = await res.json();
  const reply = data.choices?.[0]?.message?.content || "No reply";
  addMessage("Supreme AI", reply);
  document.getElementById("chatInput").value = "";
});

function addMessage(sender, text) {
  const box = document.getElementById("chatBox");
  const div = document.createElement("div");
  div.className = "msg";
  div.innerHTML = `<strong class="${sender === 'Supreme AI' ? 'ai' : ''}">${sender}:</strong> ${text}`;
  box.appendChild(div);
  box.scrollTop = box.scrollHeight;
}

// Voice Input
function startVoiceInput() {
  const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
  recognition.lang = "en-US";
  recognition.onresult = (event) => {
    document.getElementById("voiceOutput").value = event.results[0][0].transcript;
  };
  recognition.start();
}

// Speak
function speak() {
  const msg = new SpeechSynthesisUtterance(document.getElementById("speakText").value);
  window.speechSynthesis.speak(msg);
}

// Weather
async function getWeather() {
  const city = document.getElementById("weatherCity").value;
  const res = await fetch(\`https://api.openweathermap.org/data/2.5/weather?q=\${city}&appid=\${WEATHER_API_KEY}&units=metric\`);
  const data = await res.json();
  document.getElementById("weatherResult").textContent = JSON.stringify(data, null, 2);
}

// Image Search
async function searchImage() {
  const query = document.getElementById("imageQuery").value;
  const res = await fetch("https://api.pexels.com/v1/search?query=" + query, {
    headers: { Authorization: PEXELS_API_KEY },
  });
  const data = await res.json();
  const results = document.getElementById("imageResults");
  results.innerHTML = "";
  data.photos.forEach(photo => {
    const img = document.createElement("img");
    img.src = photo.src.medium;
    img.style.width = "100px";
    img.style.margin = "5px";
    results.appendChild(img);
  });
}