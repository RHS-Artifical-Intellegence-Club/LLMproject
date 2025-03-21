import os
from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()

api_key1 = os.environ.get("API_KEY")


client = OpenAI(
  base_url="https://openrouter.ai/api/v1",
  api_key=api_key1,
)

completion = client.chat.completions.create(
  extra_headers={
    "HTTP-Referer": "<YOUR_SITE_URL>", 
    "X-Title": "<YOUR_SITE_NAME>",
  },
  model="deepseek/deepseek-r1:free",
  messages=[
    {
      "role": "user",
      "content": " "
    }
  ]
)
print(completion.choices[0].message.content)