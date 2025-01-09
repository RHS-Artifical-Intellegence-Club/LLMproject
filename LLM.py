from transformers import pipeline

generator = pipeline("text-generation", model="EleutherAI/gpt-neo-2.7B")

prompt = "Rate chicken 1 to 10"

res = generator(prompt, max_length=100, do_sample=True,temperature=0.9)

print(res)
