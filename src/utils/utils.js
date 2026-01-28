import {TicketCounts} from "./TicketCounts.js";

export function extractTicketCounts(ticketTypeRequests) {
    const counts = new TicketCounts();

    for (const req of ticketTypeRequests) {
        switch (req.getTicketType()) {
            case 'ADULT':
                counts.adults += req.getNoOfTickets();
                break;
            case 'CHILD':
                counts.children += req.getNoOfTickets()
                break;
            case 'INFANT':
                counts.infants += req.getNoOfTickets()
                break;
        }
    }

    return counts;
}