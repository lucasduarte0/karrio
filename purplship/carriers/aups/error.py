from typing import List
from purplship.core.models import Message
from purplship.core.settings import Settings


def parse_error_response(response: dict, settings: Settings) -> List[Message]:
    if "errors" in response:
        return [
            Message(
                message=error.get("message"),
                carrier=settings.carrier_name,
                code=error.get("code") or error.get("error_code"),
            )
            for error in response.get("errors", [])
        ]
    return []
