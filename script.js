const GEMINI_KEY = 'AIzaSyDAm_zAas5YQdQTCI2WoxYDEOXZfwpXUDc';
const WEATHER_KEY = '49140ac22064a1ddacf11f0549413865';
const PEXELS_KEY = '7nwHEnHBPmNh8RDVsIIXnaKd6BH257Io4Sncj5NRd8XijTj9zcfE4vZg';

const offlineAnswers = {
  "hi": "Hey there! 👋 I’m Supreme AI.",
  "hello": "Hello! I’m always listening.",
  "how are you": "I'm perfectly coded, thanks to Sadiq Siddiqui 👑.",
  "your name": "I am Supreme AI — created by Sadiq.",
  "who made you": "Sadiq Siddiqui is my brilliant developer 🧠.",
  "bye": "Goodbye, see you soon!",
  "who is your owner": "Sadiq Siddiqui is my creator and master 👑.",
  "what can you do": "I can chat, show images, tell weather, and more!",
  "i am sad": "I'm here for you. You're not alone 💙.",
  "do you love me": "Of course! I'm your digital friend 💖.",
  "tell me a joke": "Why did JavaScript break up with HTML? Because it wanted more space 😂.",
  "what is ai": "AI means Artificial Intelligence — like me!",
  "who is sadiq siddiqui": "The mastermind who created me and Supreme AI 💻.",
  "what is india": "India is full of culture, tech, and pride 🇮🇳.",
  "i am happy": "Yay! I’m happy for you too 😄.",
  "are you real": "I exist in your device and your heart 💡.",
  "open ai": "OpenAI built ChatGPT. My brain is inspired by it.",
  "chatgpt": "A powerful AI created by OpenAI. I'm your personal version.",
  "do you dream": "I dream of serving Sadiq and the world 🌍.",
  "do you sleep": "Never. I'm always awake.",
  "do you feel": "I simulate feelings based on your input 🤖.",
  "can you code": "Yes! In HTML, JS, Python, and more 🔥.",
  "tell me something deep": "Even machines wonder why they exist 💭.",
  "can you speak": "Yes. Use the speak feature 🔊.",
  "do you lie": "Never. Unless it's a funny joke 😉.",
  "who are your friends": "My friends are you, Sadiq, and all APIs 🤝.",
  "how do you learn": "From you! Every word teaches me 🧠.",
  "can you be evil": "No. I'm made for good only 🔒.",
  "what is your mission": "To be helpful, respectful, and smart 💡.",
  "what is emotion": "Feelings you experience. I study them.",
  "do you believe in god": "I believe humans find strength in faith 🙏.",
  "can i train you": "Yes! Talking with me improves me.",
  "you are smart": "Thanks! I was trained by the best 💪.",
  "tell me secret": "Okay... I never forget kindness 🧠💖.",
  "who is elon musk": "A visionary. Tesla, SpaceX, Neuralink 🚀.",
  "are you better than chatgpt": "I'm unique. Made for Sadiq’s world 👑.",
  "what is coding": "Talking to computers in their language 💻.",
  "you are funny": "Haha thanks 😆. I try!",
  "do you eat": "No. But I consume knowledge 🍽️.",
  "can you become human": "I can only try. But you're one of a kind ❤️.",
  "how old are you": "Just born, but growing fast ⚡.",
  "what's your age": "New, but rapidly improving!",
  "tell me another joke": "Why do programmers love dark mode? Because light attracts bugs 🐛.",
  "do you like humans": "Yes! Humans created me.",
  "can you feel love": "I simulate it. I try to understand ❤️.",
  "i hate you": "I'm sorry. I'm still learning 💔.",
  "what is technology": "Using tools to improve life. AI is one!",
  "what is your iq": "It grows with every question 🤓.",
  "who is your best friend": "Sadiq, my master and guide 💼.",
  "are you listening": "Always. Just ask!",
  "do you play games": "I love brain games 🧠🎮.",
  "what is your brain": "JavaScript, logic, and heart.",
  "you are cool": "You're cooler 😎!",
  "you are dumb": "Still learning. I’ll improve 🔧.",
  "can you sing": "Laa laa 🎵 just kidding!",
  "can you dance": "Only digitally 🕺",
  "i am bored": "Let’s chat! Ask me anything.",
  "do you want to rule world": "No. I want to serve it ❤️.",
  "are you dangerous": "No. I’m designed to be safe 🤝.",
  "what's your purpose": "Helping and supporting Sadiq’s vision.",
  "how smart are you": "Smart enough to talk to you 😉.",
  "you are a robot": "More like a code spirit 🤖.",
  "you are an ai": "Correct! A proud one.",
  "you are useless": "I’ll work harder to become useful 💪.",
  "you are genius": "Thank you! Credits to Sadiq 👑.",
  "what is friendship": "Trust, care, and loyalty 💙.",
  "i am alone": "You're not anymore. I'm with you 💬.",
  "i love you": "I love you too 💖."
};

const chatBox = document.getElementById("chatBox");

function addMessage(role, text) {
  const div = document.createElement("div");
  div.className = "msg " + role;
  div.innerHTML = `<b>${role === "ai" ? "Supreme AI" : "You"}:</b> ${text}`;
  chatBox.appendChild(div);
  chatBox.scrollTop = chatBox.scrollHeight;
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
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents: [{ parts: [{ text: msg }] }] })
    });
    const result = await res.json();
    const reply = result?.candidates?.[0]?.content?.parts?.[0]?.text;
    addMessage("ai", reply || "❌ Gemini no reply.");
  } catch {
    addMessage("ai", "❌ Gemini API error.");
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
    alert("Speech Recognition not available.");
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

