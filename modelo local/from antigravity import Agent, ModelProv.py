from antigravity import Agent, ModelProvider

# Configurar el modelo local usando el endpoint compatible con OpenAI
local_model = ModelProvider.OpenAI(
    model_name="qwen2.5:7b",
    base_url="http://localhost:11434/v1",
    api_key="ollama",  # Requerido por la interfaz pero ignorado por Ollama
)

# Crear un agente con el modelo local
agent = Agent(provider=local_model)

# Ejecutar una consulta
response = agent.run("Explica brevemente qué es el principio de flotación.")
print(response)