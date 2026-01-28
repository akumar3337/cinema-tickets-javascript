import {validateAccount, validateTicketRequestArray} from "../validators/Validators.js";
import {extractTicketCounts} from "../utils/utils.js";
import TicketPaymentService from "../thirdparty/paymentgateway/TicketPaymentService.js";
import SeatReservationService from "../thirdparty/seatbooking/SeatReservationService.js"
import {calculateTotalPrice} from "./PriceCalculatorService.js";
import {calculateTotalSeats} from "./SeatCalculatorService.js";

export default class TicketService {
    /**
     * Should only have private methods other than the one below.
     */

    constructor(
        seatReservationService = new SeatReservationService(),
        ticketPaymentService = new TicketPaymentService()
    ) {
        this.seatReservationService = seatReservationService;
        this.ticketPaymentService = ticketPaymentService;
    }

    purchaseTickets(accountId, ...ticketTypeRequests) {

        validateAccount(accountId);
        validateTicketRequestArray(ticketTypeRequests);

        const ticketCounts = extractTicketCounts(ticketTypeRequests);

        const totalAmount = calculateTotalPrice(ticketCounts);
        const totalSeats = calculateTotalSeats(ticketCounts);

        this.ticketPaymentService.makePayment(accountId, totalAmount);
        this.seatReservationService.reserveSeat(accountId, totalSeats);
    }

}
