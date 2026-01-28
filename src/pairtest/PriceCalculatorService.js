import config from "../configs/config.js";

export function calculateTotalPrice(ticketCounts) {
    const {adults, children} = ticketCounts;

    return adults * config.ADULT_TICKET_PRICE +
        children * config.CHILD_TICKET_PRICE;
}
