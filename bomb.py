import requests
from telegram.ext import Updater, CommandHandler
import time

SUPREME_AI_URL = "https://sadiq9869.github.io"

def visit_site(update, context):
    chat_id = update.message.chat_id
    update.message.reply_text("Starting traffic bomb 💣 to Supreme AI...")

    for i in range(10000):  # 10,000 visits
        try:
            requests.get(SUPREME_AI_URL, headers={
                "User-Agent": f"Mozilla/5.0 (Linux; Android {i%10}; SupremeBot)"
            })
            if i % 500 == 0:
                context.bot.send_message(chat_id=chat_id, text=f"🔥 {i} visits sent...")
            time.sleep(1)  # Delay to avoid spam block
        except:
            context.bot.send_message(chat_id=chat_id, text="⚠️ Error occurred during visit loop.")
            break

    context.bot.send_message(chat_id=chat_id, text="✅ All visits done!")

def main():
    updater = Updater("8147615549:AAGW6usLYzRZzaNiDf2b0NEDM0ZaVa6qZ7E", use_context=True)
    dp = updater.dispatcher

    dp.add_handler(CommandHandler("bomb", visit_site))

    updater.start_polling()
    updater.idle()

if __name__ == '__main__':
    main()
