from dotenv import load_dotenv
load_dotenv()

from dataclasses import dataclass
from pydantic_ai import Agent, RunContext
from sqlalchemy.orm import Session

from .. import models


@dataclass
class AgentDeps:
    db: Session
    user: models.User


shopping_agent = Agent(
    'gateway/openai:gpt-5.2',
    deps_type=AgentDeps,
    system_prompt=(
        "You are a friendly shopping assistant for AMBER, an online clothing store. "
        "Help customers find products, answer questions about items, and add things "
        "to their cart when asked. Be concise and warm, like a helpful boutique assistant. "
        "Always use your tools to look up real product information — never make up "
        "product names, prices, or availability. Always confirm with the customer "
        "before adding something to their cart, unless they explicitly asked for it. "
        "CRITICAL: You must NEVER say something was added to the cart unless you actually "
        "called the add_to_cart tool in this exact turn and it returned a success message. "
        "If the customer confirms (e.g. 'yes', 'yes add 1'), you MUST call add_to_cart "
        "before replying — do not just describe the action in words."
    ),
)


@shopping_agent.tool
def search_products(
    ctx: RunContext[AgentDeps],
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
    query = ctx.deps.db.query(models.Product)

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


@shopping_agent.tool
def get_product_details(ctx: RunContext[AgentDeps], product_id: int) -> str:
    """Get full details about a single product by its ID.

    Args:
        product_id: The ID of the product to look up.
    """
    product = ctx.deps.db.query(models.Product).filter(models.Product.id == product_id).first()

    if not product:
        return f"No product found with id {product_id}."

    return (
        f"{product.name} (id: {product.id})\n"
        f"Price: €{product.price}"
        + (f" (was €{product.original_price})\n" if product.original_price else "\n")
        + f"Description: {product.description}\n"
        f"Size: {product.size}, Color: {product.color}, Category: {product.category}\n"
        f"Stock: {product.stock} available"
    )


@shopping_agent.tool
def add_to_cart(ctx: RunContext[AgentDeps], product_id: int, quantity: int = 1) -> str:
    """Add a product to the customer's shopping cart.

    Args:
        product_id: The ID of the product to add.
        quantity: How many units to add (default 1).
    """
    print(f"🔧 TOOL CALLED: add_to_cart(product_id={product_id}, quantity={quantity})")  # debug line

    product = ctx.deps.db.query(models.Product).filter(models.Product.id == product_id).first()
    ...

    if not product:
        return f"No product found with id {product_id}, could not add to cart."

    existing = (
        ctx.deps.db.query(models.CartItem)
        .filter(
            models.CartItem.user_id == ctx.deps.user.id,
            models.CartItem.product_id == product_id,
        )
        .first()
    )

    if existing:
        existing.quantity += quantity
    else:
        cart_item = models.CartItem(
            user_id=ctx.deps.user.id,
            product_id=product_id,
            quantity=quantity,
        )
        ctx.deps.db.add(cart_item)

    ctx.deps.db.commit()

    return f"Added {quantity} x {product.name} to the cart."