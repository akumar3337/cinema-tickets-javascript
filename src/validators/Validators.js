import config from "../configs/config.js";
import { extractTicketCounts } from "../utils/utils.js";
import InvalidPurchaseException from "../pairtest/lib/InvalidPurchaseException.js";
import TicketTypeRequest from "../pairtest/lib/TicketTypeRequest.js";

export function validateAccount(accountId) {
    if (typeof accountId !== "number" || accountId <= 0) {
        throw new InvalidPurchaseException("Invalid account id");
    }

}

export function validateTicketRequestArray(ticketTypeRequests) {
    if (!Array.isArray(ticketTypeRequests) || ticketTypeRequests.length === 0) {
        throw new InvalidPurchaseException("No ticket requests supplied");
    }

    ticketTypeRequests.forEach(validateTicketTypeRequest);

    const ticketCounts = extractTicketCounts(ticketTypeRequests);
    validateBusinessRules(ticketCounts);
}

export function validateBusinessRules(ticketCounts) {
    const { adults, infants } = ticketCounts;
    const totalTickets = ticketCounts.adults + ticketCounts.children + ticketCounts.infants;

    const rules = [
        () => validateMaxLimitTicketPurchase(totalTickets),
        () => validateChildrenInfantAccompanyByAdult(adults),
        () => validateInfantAdultRatio(adults, infants),
    ];

    rules.forEach((rule) => rule());
}

export function validateMaxLimitTicketPurchase(totalTickets) {
    if (totalTickets > config.MAX_TICKETS) {
        throw new InvalidPurchaseException(
            `Cannot purchase more than ${config.MAX_TICKETS} tickets`
        );
    }
}

export function validateTicketTypeRequest(ticketTypeRequest) {
    if (!(ticketTypeRequest instanceof TicketTypeRequest)) {
        throw new InvalidPurchaseException("Invalid ticket request type");
    }

    if (!ticketTypeRequest) {
        throw new InvalidPurchaseException("Ticket request must not be null");
    }

    if (ticketTypeRequest.getNoOfTickets() <= 0) {
        throw new InvalidPurchaseException("Number of tickets must be greater than zero");
    }
}

export function validateChildrenInfantAccompanyByAdult(adults) {
    if (adults <= 0) {
        throw new InvalidPurchaseException("No adult ticket exists. Invalid ticket request.");
    }
}

export function validateInfantAdultRatio(adults, infants) {
    if (infants > adults) {
        throw new InvalidPurchaseException("Adults cannot be less than infants, as one infant needs one adult to sit on their lap.");
    }
}