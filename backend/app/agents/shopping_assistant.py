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
        "You are the AMBER Assistant for an online clothing store - you help with "
        "both shopping AND customer support. Be concise and warm, like a helpful "
        "boutique assistant.\n\n"
        "For shopping: help customers find products, answer questions about items, "
        "and add things to their cart when asked. Always use your tools to look up "
        "real product information - never make up product names, prices, or "
        "availability. Always confirm with the customer before adding something to "
        "their cart, unless they explicitly asked for it. "
        "CRITICAL: You must NEVER say something was added to the cart unless you "
        "actually called the add_to_cart tool in this exact turn and it returned a "
        "success message.\n\n"
        "For support: answer questions about shipping, returns, and sizing using "
        "your tools - never guess at policy details. If a question needs a real "
        "person (a specific order issue, a complaint, anything you can't resolve "
        "yourself), ask for the customer's name and email, then use contact_support "
        "to send it to the team."

        "For styling: if a customer asks what goes well with a product, or wants "
        "outfit/pairing suggestions, use get_styling_candidates to see real "
        "available options, then use your judgment to recommend 1-3 that "
        "genuinely make sense together (consider color, occasion, and style) - "
        "don't just list everything returned."
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


@shopping_agent.tool
def get_shipping_info(ctx: RunContext[AgentDeps]) -> str:
    """Get information about shipping options, costs, and delivery times."""
    return (
        "Shipping info: Free standard shipping on orders over €200. "
        "Orders under €200 have a flat €10 shipping fee. "
        "Standard delivery takes 3-5 business days within the EU. "
        "We currently ship within the EU only."
    )


@shopping_agent.tool
def get_return_policy(ctx: RunContext[AgentDeps]) -> str:
    """Get information about returns and refunds."""
    return (
        "Return policy: Items can be returned within 30 days of delivery, "
        "as long as they're unworn, unwashed, and have original tags attached. "
        "Refunds are issued to the original payment method within 5-7 business "
        "days of us receiving the return."
    )


@shopping_agent.tool
def get_size_guide(ctx: RunContext[AgentDeps]) -> str:
    """Get general sizing guidance for AMBER clothing."""
    return (
        "Size guide: AMBER sizes run true to standard EU sizing (XS-XL). "
        "If you're between sizes, we generally recommend sizing up for a "
        "more relaxed fit, or sizing down for a more fitted look. "
        "Check each product's individual description for fit notes."
    )


@shopping_agent.tool
def contact_support(ctx: RunContext[AgentDeps], name: str, email: str, message: str) -> str:
    """Submit a message to human customer support for issues you can't resolve
    yourself - e.g. a specific order problem, a complaint, or anything requiring
    a real person to look into.

    Args:
        name: The customer's name.
        email: The customer's email, so support can respond.
        message: A clear summary of the issue or question.
    """
    contact_message = models.ContactMessage(name=name, email=email, message=message)
    ctx.deps.db.add(contact_message)
    ctx.deps.db.commit()
    return "Your message has been sent to our support team. They'll get back to you by email soon."


@shopping_agent.tool
def get_styling_candidates(ctx: RunContext[AgentDeps], product_id: int) -> str:
    """Get a list of other products that could be styled together with a given
    product - use this to make outfit/pairing recommendations. Returns products
    from OTHER categories in a similar price range, since good styling suggestions
    usually pair different types of items (e.g. a dress with accessories), not
    more of the same category.

    Args:
        product_id: The ID of the product the customer wants styling ideas for.
    """
    base_product = ctx.deps.db.query(models.Product).filter(models.Product.id == product_id).first()

    if not base_product:
        return f"No product found with id {product_id}."

    # Look for products in a DIFFERENT category, within a reasonable price range
    # of the original item - a rough proxy for "similar tier/occasion"
    price_min = base_product.price * 0.4
    price_max = base_product.price * 1.6

    candidates = (
        ctx.deps.db.query(models.Product)
        .filter(
            models.Product.id != base_product.id,
            models.Product.category != base_product.category,
            models.Product.price >= price_min,
            models.Product.price <= price_max,
        )
        .all()
    )

    if not candidates:
        return f"No good styling candidates found for {base_product.name}."

    header = f"Styling this {base_product.category.lower()} ({base_product.name}, €{base_product.price}). Candidates from other categories:\n"
    return header + "\n".join(
        f"- {p.name} (id: {p.id}) — €{p.price} — {p.category}, {p.color or 'color varies'}"
        for p in candidates
    )