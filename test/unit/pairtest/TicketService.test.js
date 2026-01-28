import {describe, it, expect, beforeEach} from 'vitest';
import TicketService from '../../../src/pairtest/TicketService.js';
import TicketTypeRequest from '../../../src/pairtest/lib/TicketTypeRequest.js';
import InvalidPurchaseException from '../../../src/pairtest/lib/InvalidPurchaseException.js';
import config from "../../../src/configs/config.js";

describe('TicketService', () => {
    let ticketService;
    let paymentSpy;
    let seatSpy;
    const validAccountId = 1;
    const invalidAccountId = 0;

    let service;

    beforeEach(() => {
        const mockPaymentService = { makePayment: vi.fn() };
        const mockSeatService = { reserveSeat: vi.fn() };

        // Spy on the methods
        paymentSpy = vi.spyOn(mockPaymentService, "makePayment");
        seatSpy = vi.spyOn(mockSeatService, "reserveSeat");

        ticketService = new TicketService(mockSeatService, mockPaymentService);
    });

    it('should successfully purchase valid tickets for adults only', () => {
        const adultTickets = new TicketTypeRequest('ADULT', 10);

        const expectedAmount = adultTickets.getNoOfTickets() * config.ADULT_TICKET_PRICE;
        const expectedSeats = adultTickets.getNoOfTickets();

        ticketService.purchaseTickets(validAccountId, adultTickets);

        expect(paymentSpy).toHaveBeenCalledWith(
            validAccountId,
            expectedAmount
        );

        expect(seatSpy).toHaveBeenCalledWith(
            validAccountId,
            expectedSeats
        );
    });

    it('should throw exception when purchasing tickets for children only', () => {
        const childTickets = new TicketTypeRequest('CHILD', 10);
        expect(() => ticketService.purchaseTickets(validAccountId, childTickets))
            .toThrowError( new InvalidPurchaseException("No adult ticket exists. Invalid ticket request."));
        expect(paymentSpy).not.toHaveBeenCalled();
        expect(seatSpy).not.toHaveBeenCalled();
    });

    it('should throw exception when purchasing tickets for infants only', () => {
        const infantTickets = new TicketTypeRequest('INFANT', 10);
        expect(() => ticketService.purchaseTickets(validAccountId, infantTickets))
            .toThrowError( new InvalidPurchaseException("No adult ticket exists. Invalid ticket request."));
        expect(paymentSpy).not.toHaveBeenCalled();
        expect(seatSpy).not.toHaveBeenCalled();
    });

    it('should throw exception when purchasing without any adult ticket, as adult must accompany infant or child', () => {
        const childTickets = new TicketTypeRequest('CHILD', 2);
        const infantTickets = new TicketTypeRequest('INFANT', 1);

        expect(() => ticketService.purchaseTickets(validAccountId, childTickets, infantTickets))
            .toThrowError( new InvalidPurchaseException("No adult ticket exists. Invalid ticket request."));
        expect(paymentSpy).not.toHaveBeenCalled();
        expect(seatSpy).not.toHaveBeenCalled();
    });

    it('should ignore infant ticket price and seat when purchase includes infant', () => {
        const adultTickets = new TicketTypeRequest('ADULT', 5);
        const childTickets = new TicketTypeRequest('CHILD', 5);
        const infantTickets = new TicketTypeRequest('INFANT', 5);

        const expectedAmount = adultTickets.getNoOfTickets() * config.ADULT_TICKET_PRICE +
            childTickets.getNoOfTickets() * config.CHILD_TICKET_PRICE;

        const expectedSeats = adultTickets.getNoOfTickets() + childTickets.getNoOfTickets();

        ticketService.purchaseTickets(validAccountId, childTickets, infantTickets, adultTickets);

        expect(paymentSpy).toHaveBeenCalledWith(
            validAccountId,
            expectedAmount
        );

        expect(seatSpy).toHaveBeenCalledWith(
            validAccountId,
            expectedSeats
        );

    });

    it('should throw exception for invalid account id', () => {
        const adultTickets = new TicketTypeRequest('ADULT', 1);
        expect(() => ticketService.purchaseTickets(invalidAccountId, adultTickets)).toThrowError( new InvalidPurchaseException("Invalid account id"));
        expect(paymentSpy).not.toHaveBeenCalled();
        expect(seatSpy).not.toHaveBeenCalled();
    });

    it('should throw exception when there is no tickets request present', () => {
        expect(() => ticketService.purchaseTickets(validAccountId)).toThrowError( new InvalidPurchaseException("No ticket requests supplied"));
        expect(paymentSpy).not.toHaveBeenCalled();
        expect(seatSpy).not.toHaveBeenCalled();
    });

    it('should throw exception for zero tickets in ticket type request', () => {
        const adultTickets = new TicketTypeRequest('ADULT', 0);
        expect(() => ticketService.purchaseTickets(validAccountId, adultTickets))
            .toThrowError( new InvalidPurchaseException("Number of tickets must be greater than zero"));
        expect(paymentSpy).not.toHaveBeenCalled();
        expect(seatSpy).not.toHaveBeenCalled();
    });

    it('should throw exception for negative ticket quantity', () => {
        const adultTickets = new TicketTypeRequest('ADULT', -1);
        expect(() => ticketService.purchaseTickets(validAccountId, adultTickets))
            .toThrowError( new InvalidPurchaseException("Number of tickets must be greater than zero"));
        expect(paymentSpy).not.toHaveBeenCalled();
        expect(seatSpy).not.toHaveBeenCalled();
    });

    it('should purchase ticket successfully when adults are more than infants tickets', () => {
        const adultTickets = new TicketTypeRequest('ADULT', 11);
        const infantTickets = new TicketTypeRequest('INFANT', 10);

        const expectedAmount = adultTickets.getNoOfTickets() * config.ADULT_TICKET_PRICE +
            infantTickets.getNoOfTickets() * config.INFANT_TICKET_PRICE;

        const expectedSeats = adultTickets.getNoOfTickets();

        ticketService.purchaseTickets(validAccountId, adultTickets, infantTickets);

        expect(paymentSpy).toHaveBeenCalledWith(
            validAccountId,
            expectedAmount
        );

        expect(seatSpy).toHaveBeenCalledWith(
            validAccountId,
            expectedSeats
        );
    });

    it('should purchase ticket successfully when adults are equal to infants tickets', () => {
        const adultTickets = new TicketTypeRequest('ADULT', 10);
        const infantTickets = new TicketTypeRequest('INFANT', 10);

        const expectedAmount = adultTickets.getNoOfTickets() * config.ADULT_TICKET_PRICE +
            infantTickets.getNoOfTickets() * config.INFANT_TICKET_PRICE;

        const expectedSeats = adultTickets.getNoOfTickets();

        ticketService.purchaseTickets(validAccountId, adultTickets, infantTickets);

        expect(paymentSpy).toHaveBeenCalledWith(
            validAccountId,
            expectedAmount
        );

        expect(seatSpy).toHaveBeenCalledWith(
            validAccountId,
            expectedSeats
        );
    });

    it('should throw exception when infants are more than adult tickets as an infant will sit on lap of an adult', () => {
        const adultTickets = new TicketTypeRequest('ADULT', 2);
        const infantTickets = new TicketTypeRequest('INFANT', 3);

        expect(() => ticketService.purchaseTickets(validAccountId, adultTickets, infantTickets))
            .toThrowError(  new InvalidPurchaseException(
                    "Adults cannot be less than infants, as one infant needs one adult to sit on their lap."
                )
            );
        expect(paymentSpy).not.toHaveBeenCalled();
        expect(seatSpy).not.toHaveBeenCalled();
    });

    it('should successfully purchase valid tickets upto given limit including infant', () => {
        const adultTickets = new TicketTypeRequest('ADULT', 10);
        const childTickets = new TicketTypeRequest('CHILD', 10);
        const infantTickets = new TicketTypeRequest('INFANT', 5);

        const expectedAmount = adultTickets.getNoOfTickets() * config.ADULT_TICKET_PRICE +
            childTickets.getNoOfTickets() * config.CHILD_TICKET_PRICE +
            infantTickets.getNoOfTickets() * config.INFANT_TICKET_PRICE;

        const expectedSeats = adultTickets.getNoOfTickets() + childTickets.getNoOfTickets();

        ticketService.purchaseTickets(validAccountId, childTickets, infantTickets, adultTickets);

        expect(paymentSpy).toHaveBeenCalledWith(
            validAccountId,
            expectedAmount
        );

        expect(seatSpy).toHaveBeenCalledWith(
            validAccountId,
            expectedSeats
        );
    });

    it('should throw exception when purchasing more than the limit', () => {
        const adultTickets = new TicketTypeRequest('ADULT', 26);

        expect(() => ticketService.purchaseTickets(validAccountId, adultTickets))
            .toThrowError(  new InvalidPurchaseException(
                    "Cannot purchase more than 25 tickets"
                )
            );
        expect(paymentSpy).not.toHaveBeenCalled();
        expect(seatSpy).not.toHaveBeenCalled();
    });

    it('should throw exception when purchasing more than the limit, including infants', () => {
        const adultTickets = new TicketTypeRequest('ADULT', 20);
        const infantTickets = new TicketTypeRequest('INFANT', 6);

        expect(() => ticketService.purchaseTickets(validAccountId, adultTickets, infantTickets))
            .toThrowError(  new InvalidPurchaseException(
                    "Cannot purchase more than 25 tickets"
                )
            );
        expect(paymentSpy).not.toHaveBeenCalled();
        expect(seatSpy).not.toHaveBeenCalled();
    });

});