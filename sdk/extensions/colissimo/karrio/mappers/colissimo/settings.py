"""Karrio Colissimo client settings."""

import attr
import karrio.providers.colissimo.utils as provider_utils


@attr.s(auto_attribs=True)
class Settings(provider_utils.Settings):
    """Colissimo connection settings."""

    # required carrier specific properties
    password: str
    contract_number: str
    laposte_api_key: str = None
    lang: str = "fr_FR"

    # generic properties
    id: str = None
    test_mode: bool = False
    carrier_id: str = "colissimo"
    account_country_code: str = "FR"
    metadata: dict = {}
