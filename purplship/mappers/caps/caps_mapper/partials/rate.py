from pycaps.rating import *
from datetime import datetime
from .interface import reduce, Tuple, List, E, CanadaPostMapperBase


class CanadaPostMapperPartial(CanadaPostMapperBase):
    
    def parse_price_quotes(self, response: 'XMLElement') -> Tuple[List[E.QuoteDetails], List[E.Error]]:
        price_quotes = response.xpath('.//*[local-name() = $name]', name="price-quote")
        quotes = reduce(self._extract_quote, price_quotes, [])
        return (quotes, self.parse_error_response(response))

    def _extract_quote(self, quotes: List[E.QuoteDetails], price_quoteNode: 'XMLElement') -> List[E.QuoteDetails]: 
        price_quote = price_quoteType()
        price_quote.build(price_quoteNode)
        discounts = [E.ChargeDetails(name=d.adjustment_name, currency="CAD", amount=float(d.adjustment_cost or 0)) for d in price_quote.price_details.adjustments.adjustment]
        return quotes + [
            E.QuoteDetails(
                carrier=self.client.carrier_name,
                currency="CAD",
                delivery_date=str(price_quote.service_standard.expected_delivery_date),
                service_name=price_quote.service_name,
                service_type=price_quote.service_code,
                base_charge=float(price_quote.price_details.base or 0),
                total_charge=float(price_quote.price_details.due or 0),
                discount=reduce(lambda sum, d: sum + d.amount, discounts, 0),
                duties_and_taxes=float(price_quote.price_details.taxes.gst.valueOf_ or 0) + 
                    float(price_quote.price_details.taxes.pst.valueOf_ or 0) + 
                    float(price_quote.price_details.taxes.hst.valueOf_ or 0),
                extra_charges=list(map(lambda a: E.ChargeDetails(
                    name=a.adjustment_name, currency="CAD", amount=float(a.adjustment_cost or 0)), price_quote.price_details.adjustments.adjustment)
                )
            )
        ]


    def create_mailing_scenario(self, payload: E.shipment_request) -> mailing_scenario:
        package = payload.shipment.items[0]
        requested_services = payload.shipment.extra_services + [payload.shipment.service_type]
        
        if len(requested_services) > 0:
            services = servicesType()
            for code in requested_services:
                services.add_service_code(code)

        if 'options' in payload.shipment.extra:
            options = optionsType()
            for option in payload.shipment.extra.get('options'):
                options.add_option(optionType(
                    option_amount=option.get('option-amount'),
                    option_code=option.get('option-code')
                ))

        return mailing_scenario(
            customer_number=payload.shipper.account_number or payload.shipment.payment_account_number or self.client.customer_number,
            contract_id=payload.shipment.extra.get('contract-id'),
            promo_code=payload.shipment.extra.get('promo-code'),
            quote_type=payload.shipment.extra.get('quote-type'),
            expected_mailing_date=payload.shipment.extra.get('expected-mailing-date'),
            options=options if ('options' in payload.shipment.extra) else None,
            parcel_characteristics=parcel_characteristicsType(
                weight=payload.shipment.total_weight or package.weight,
                dimensions=dimensionsType(
                    length=package.length,
                    width=package.width,
                    height=package.height
                ),
                unpackaged=payload.shipment.extra.get('unpackaged'),
                mailing_tube=payload.shipment.extra.get('mailing-tube'),
                oversized=payload.shipment.extra.get('oversized')
            ),
            services=services if (len(requested_services) > 0) else None,
            origin_postal_code=payload.shipper.postal_code,
            destination=destinationType(
                domestic=domesticType(
                    postal_code=payload.recipient.postal_code
                ) if (payload.recipient.country_code == 'CA') else None,
                united_states=united_statesType(
                    zip_code=payload.recipient.postal_code
                ) if (payload.recipient.country_code == 'US') else None,
                international=internationalType(
                    country_code=payload.shipment.country_code
                ) if (payload.recipient.country_code not in ['US', 'CA']) else None
            )
        )
