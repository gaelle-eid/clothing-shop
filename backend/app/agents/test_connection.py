from dotenv import load_dotenv
load_dotenv()

from pydantic_ai import Agent

agent = Agent('gateway/openai:gpt-5.2')

result = agent.run_sync('Say hello in one short sentence.')
print(result.output)