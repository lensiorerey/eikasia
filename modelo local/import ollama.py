import ollama

response = ollama.chat(
    model="qwen2.5:7b",
    messages=[{"role": "user", "content": "Hola, ¿puedes presentarte?"}],
)

print(response["message"]["content"])