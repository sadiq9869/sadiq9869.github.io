
const chatBox = document.getElementById("chat-box");
const userInput = document.getElementById("user-input");
const debugOutput = document.getElementById("debug-output");

async function sendMessage() {
  const msg = userInput.value.trim();
  if (!msg) return;
  addMessage("You", msg, "user");
  userInput.value = "";

  if (msg.toLowerCase().includes("create image")) {
    const prompt = msg.replace(/create image/gi, "").trim();
    addMessage("Supreme AI", "🖼️ Generating image, please wait...", "ai");
    const imageUrl = await generateImage(prompt);
    addMessage("Supreme AI", `<img src="${imageUrl}" alt="AI Generated Image" width="100%">`, "ai");
    return;
  }

  const reply = await fetchAIReply(msg);
  typeWriterEffect(reply);
}

function addMessage(sender, message, cls = "") {
  const div = document.createElement("div");
  div.className = `msg ${cls}`;
  div.innerHTML = `<b>${sender}:</b> ${message}`;
  chatBox.appendChild(div);
  chatBox.scrollTop = chatBox.scrollHeight;
}

async function typeWriterEffect(text) {
  return new Promise(resolve => {
    let i = 0;
    const msgDiv = document.createElement("div");
    msgDiv.className = "msg ai";
    msgDiv.innerHTML = `<b>Supreme AI:</b> <span id="typingText"></span><span class="cursor">|</span>`;
    chatBox.appendChild(msgDiv);
    const span = msgDiv.querySelector("#typingText");
    const cursor = msgDiv.querySelector(".cursor");

    const delay = getTypingDelay(text);
    function typeChar() {
      if (i < text.length) {
        span.textContent += text[i++];
        chatBox.scrollTop = chatBox.scrollHeight;
        setTimeout(typeChar, delay);
      } else {
        cursor.remove();
        resolve();
      }
    }
    typeChar();
  });
}

function getTypingDelay(text) {
  if (text.includes("I don't know") || text.includes("I'm not sure")) return 70;
  if (text.length < 40) return 25;
  if (text.length < 200) return 35;
  return 50;
}

async function generateImage(prompt) {
  const response = await fetch("https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-2", {
    method: "POST",
    headers: {
      Authorization: "Bearer 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",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ inputs: prompt })
  });
  const blob = await response.blob();
  return URL.createObjectURL(blob);
}

async function fetchAIReply(msg) {
  try {
    const res = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=AIzaSyDAm_zAas5YQdQTCI2WoxYDEOXZfwpXUDc", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: msg }] }]
      })
    });
    const json = await res.json();
    debugOutput.textContent = JSON.stringify(json, null, 2);
    const reply = json?.candidates?.[0]?.content?.parts?.[0]?.text;
    return reply || "⚠️ Gemini responded, but I couldn't understand it.";
  } catch (e) {
    return "⚠️ An error occurred while contacting AI.";
  }
}

function startListening() {
  const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
  recognition.lang = "en-US";
  recognition.start();
  recognition.onresult = function (event) {
    userInput.value = event.results[0][0].transcript;
    sendMessage();
  };
}
