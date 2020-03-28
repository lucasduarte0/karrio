from typing import List
from pyups.error_1_1 import CodeType
from purplship.core.models import Message
from purplship.core.utils.xml import Element
from .utils import Settings


def parse_error_response(response: Element, settings: Settings) -> List[Message]:
    notifications = response.xpath(
        ".//*[local-name() = $name]", name="PrimaryErrorCode"
    )
    return [_extract_error(node, settings) for node in notifications]


def _extract_error(error_node: Element, settings: Settings) -> Message:
    error = CodeType()
    error.build(error_node)
    return Message(
        code=error.Code,
        message=error.Description,
        carrier=settings.carrier_name
    )
