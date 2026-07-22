from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session
from pydantic_ai.messages import ModelMessagesTypeAdapter  # converts plain JSON history back into pydantic-ai's real message objects

from .. import models
from ..database import get_db
from ..auth import get_current_user
from ..agents.shopping_assistant import shopping_agent, AgentDeps

router = APIRouter(prefix="/agent", tags=["agent"])  # every route here is prefixed with /agent


class ChatRequest(BaseModel):
    message: str  # the new message the user just typed
    history: list = []  # the conversation so far, sent back to us by the frontend; empty on the very first message


class ChatResponse(BaseModel):
    reply: str  # the agent's natural-language reply to show in the chat
    history: list  # the UPDATED conversation (old + this exchange), for the frontend to store and resend next time
    product_cards: list = []  # products the agent looked up this turn, for the frontend to show as clickable image cards


@router.post("/chat", response_model=ChatResponse)
async def chat(  # async because shopping_agent.run() is async
    request: ChatRequest,  # FastAPI validates incoming JSON against ChatRequest automatically
    db: Session = Depends(get_db),  # database session, same pattern as every other route
    current_user: models.User = Depends(get_current_user),  # requires login - only real users can chat
):
    # Bundle up what the agent's tools need: db access, who's logged in (for
    # add_to_cart/remove_from_cart), and an empty list the tools will fill
    # with product info whenever they look something up
    deps = AgentDeps(db=db, user=current_user)

    # request.history arrives as plain JSON (list of dicts) since that's all HTTP/JSON supports.
    # pydantic-ai needs its own internal message objects, not plain dicts, so we convert here.
    # If there's no history yet (first message ever), just use an empty list.
    message_history = (
        ModelMessagesTypeAdapter.validate_python(request.history)
        if request.history
        else []
    )

    # Run the agent: send the new message, but ALSO give it the prior conversation,
    # so it has context (e.g. knows what "it" or "yes, add 1" refers to)
    result = await shopping_agent.run(
        request.message,
        deps=deps,
        message_history=message_history,
    )

    # Get the FULL conversation back from the agent, including this latest exchange
    new_history = result.all_messages()

    # Send back the agent's reply, the updated history, and any product cards
    # the tools collected along the way (e.g. from search_products or get_product_details)
    return ChatResponse(
        reply=result.output,
        history=ModelMessagesTypeAdapter.dump_python(new_history, mode="json"),
        product_cards=deps.product_cards,
    )