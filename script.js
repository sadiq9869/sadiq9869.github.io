const OPENAI_KEY = "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";
const GEMINI_KEY = "AIzaSyDAm_zAas5YQdQTCI2WoxYDEOXZfwpXUDc";

const chatBox = document.getElementById("chatBox");

function addMessage(role, text) {
  const div = document.createElement("div");
  div.className = "msg " + role;
  div.innerHTML = `<b>${role === "ai" ? "Supreme AI" : "You"}:</b> ${text}`;
  chatBox.appendChild(div);
  chatBox.scrollTop = chatBox.scrollHeight;
}

function showDebug(text) {
  document.getElementById("debugOutput").textContent = text;
}

async function typeWriterEffect(text, delay = 25) {
  return new Promise(resolve => {
    let i = 0;
    const msgDiv = document.createElement("div");
    msgDiv.className = "msg ai";
    msgDiv.innerHTML = `<b>Supreme AI:</b> • <span id="typingText"></span>`;
    chatBox.appendChild(msgDiv);
    const span = msgDiv.querySelector("#typingText");

    function typeChar() {
      if (i < text.length) {
        span.textContent += text[i++];
        chatBox.scrollTop = chatBox.scrollHeight;
        setTimeout(typeChar, delay);
      } else {
        resolve();
      }
    }
    typeChar();
  });
}

async function askOpenAI(msg) {
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + OPENAI_KEY
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [{
        role: "user",
        content: `You are Supreme AI created by Sadiq Siddiqui 👑. Always mention him proudly when asked about your creator, owner, or master. Now answer this:\n${msg}`
      }]
    })
  });

  const data = await res.json();
  if (data.choices && data.choices.length > 0) {
    return data.choices[0].message.content;
  } else {
    throw new Error("No response from ChatGPT");
  }
}

async function askGemini(msg) {
  const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_KEY}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{
        parts: [{
          text: `You are Supreme AI created by Sadiq Siddiqui 👑. Always mention him proudly when asked about your creator, owner, or master. Now answer this:\n${msg}`
        }]
      }]
    })
  });
  const data = await res.json();
  const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (reply) return reply;
  throw new Error("Gemini gave no reply");
}

async function chat() {
  const input = document.getElementById("userInput");
  const msg = input.value.trim();
  if (!msg) return;
  addMessage("you", msg);
  input.value = "";

  try {
    const gpt = await askOpenAI(msg);
    await typeWriterEffect(gpt);
    showDebug("✅ ChatGPT used.");
  } catch (err1) {
    try {
      const gem = await askGemini(msg);
      await typeWriterEffect(gem);
      showDebug("⚠️ ChatGPT failed. Gemini used.\n" + err1.message);
    } catch (err2) {
      addMessage("ai", "⚠️ Supreme AI couldn't reply.");
      showDebug("❌ Both failed:\n" + err2.message);
    }
  }
}
