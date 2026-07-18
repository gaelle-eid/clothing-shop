from dotenv import load_dotenv
load_dotenv()

from pydantic_ai import Agent, RunContext
from sqlalchemy.orm import Session

from .. import models

shopping_agent = Agent(
    'gateway/openai:gpt-5.2',
    deps_type=Session, # this tells the agent "whoever runs me will provide a database session as a dependency." This is how the tool gets access to your real database
    system_prompt=(
        "You are a friendly shopping assistant for AMBER, an online clothing store. "
        "Help customers find products, answer questions about items, and add things "
        "to their cart when asked. Be concise and warm, like a helpful boutique assistant. "
        "Always use your tools to look up real product information — never make up "
        "product names, prices, or availability."
    ),
)


@shopping_agent.tool #this decorator is what turns a normal Python function into something the AI model can choose to call. The function's docstring (the """...""" text) is critically important — the AI literally reads that description to understand what the tool does and when to use it
def search_products(
    ctx: RunContext[Session],
    search: str | None = None,
    category: str | None = None,
    on_sale: bool | None = None,
) -> str:
    """Search the product catalog by name, category, or sale status.

    Args:
        search: A keyword to search product names for (e.g. "dress").
        category: Filter by category (e.g. "Dresses", "Outerwear", "Accessories").
        on_sale: If true, only return items currently on sale.
    """
    query = ctx.deps.query(models.Product)

    if search:
        query = query.filter(models.Product.name.ilike(f"%{search}%"))
    if category:
        query = query.filter(models.Product.category == category)
    if on_sale is not None:
        query = query.filter(models.Product.on_sale == on_sale)

    products = query.all()

    if not products:
        return "No products found matching that search."

    return "\n".join(
        f"- {p.name} (id: {p.id}) — €{p.price}"
        + (f" (was €{p.original_price})" if p.original_price else "")
        + f" — {p.category}, {p.stock} in stock"
        for p in products
    )