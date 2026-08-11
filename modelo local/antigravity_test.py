from openai import OpenAI

# Conectar al servidor local de Ollama (compatible con API OpenAI)
client = OpenAI(
    base_url="http://localhost:11434/v1",
    api_key="ollama",  # Requerido por la interfaz
)

response = client.chat.completions.create(
    model="qwen2.5:7b",
    messages=[
        {"role": "user", "content": "Explica brevemente qué es la gravedad."}
    ],
)

print(response.choices[0].message.content)