async function sendMessage() {
  const input = document.getElementById("userInput");
  const message = input.value.trim();
  if (!message) return;

  appendMessage("You", message, "user");
  input.value = "";

  const typingEl = document.createElement("div");
  typingEl.className = "message typing";
  typingEl.innerText = "Supreme AI is typing...";
  document.getElementById("chat").appendChild(typingEl);
  document.getElementById("chat").scrollTop = chat.scrollHeight;

  let reply = "";

  try {
    // Smart model selection
    let model = "gpt-4o";
    if (message.length < 10) model = "o3-mini";
    else if (message.includes("who") || message.includes("owner")) model = "gpt-4.1";

    const response = await puter.ai.chat(message, {
      stream: true,
      model
    });

    for await (const part of response) {
      if (part?.text) {
        reply += part.text;
        typingEl.innerText = reply;
        document.getElementById("chat").scrollTop = chat.scrollHeight;
      }
    }

    // Gemini Backup if puter fails
    if (!reply.trim()) {
      const gemini = await fetch(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=AIzaSyDAm_zAas5YQdQTCI2WoxYDEOXZfwpXUDc",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            contents: [{ parts: [{ text: message }] }]
          })
        }
      );

      const geminiRes = await gemini.json();
      reply =
        geminiRes?.candidates?.[0]?.content?.parts?.[0]?.text ||
        "❌ Gemini did not reply.";
      typingEl.innerText = reply;
    }

    document.getElementById("debug").innerText =
      "Debug Response: " + reply.slice(0, 1000);
  } catch (err) {
    typingEl.innerText = "⚠️ Error: " + err.message;
    document.getElementById("debug").innerText =
      "Debug Error: " + err.stack;
  }

  typingEl.className = "message ai";
}

function appendMessage(sender, text, className) {
  const el = document.createElement("div");
  el.className = "message " + className;
  el.innerText = `${sender}: ${text}`;
  document.getElementById("chat").appendChild(el);
  document.getElementById("chat").scrollTop = chat.scrollHeight;
}
