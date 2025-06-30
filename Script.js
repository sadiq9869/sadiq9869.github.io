function handleSend() {
  const input = document.getElementById("userInput");
  const chatBox = document.getElementById("chatBox");
  const text = input.value.trim();

  if (!text) return;

  // User message
  const userMsg = document.createElement("div");
  userMsg.className = "message user";
  userMsg.textContent = "You: " + text;
  chatBox.appendChild(userMsg);

  // Bot fake response
  const botMsg = document.createElement("div");
  botMsg.className = "message bot";
  botMsg.textContent = `Supreme AI: This is a sample response to "${text}".`;
  chatBox.appendChild(botMsg);

  // Scroll down + clear input
  input.value = "";
  chatBox.scrollTop = chatBox.scrollHeight;
}
