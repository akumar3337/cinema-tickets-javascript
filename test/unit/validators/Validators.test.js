import { describe, it, expect } from "vitest";
import {
    validateAccount,
    validateTicketRequestArray,
    validateTicketTypeRequest,
    validateBusinessRules,
    validateMaxLimitTicketPurchase,
    validateChildrenInfantAccompanyByAdult,
    validateInfantAdultRatio
} from "../../../src/validators/validators.js";

import InvalidPurchaseException from "../../../src/pairtest/lib/InvalidPurchaseException.js";
import TicketTypeRequest from "../../../src/pairtest/lib/TicketTypeRequest.js";
import config from "../../../src/configs/config.js";

describe("Validators", () => {

    describe("validateAccount", () => {
        it("should throw error for non-number accountId", () => {
            expect(() => validateAccount("abc"))
                .toThrowError(new InvalidPurchaseException("Invalid account id"));
        });

        it("should throw error for zero or negative accountId", () => {
            expect(() => validateAccount(0))
                .toThrowError(new InvalidPurchaseException("Invalid account id"));
            expect(() => validateAccount(-5))
                .toThrowError(new InvalidPurchaseException("Invalid account id"));
        });

        it("should not throw error for valid accountId", () => {
            expect(() => validateAccount(10)).not.toThrow();
        });
    });

    describe("validateTicketRequestArray", () => {
        it("should throw error when array is empty", () => {
            expect(() => validateTicketRequestArray([]))
                .toThrowError(new InvalidPurchaseException("No ticket requests supplied"));
        });

        it("should throw error when not an array", () => {
            expect(() => validateTicketRequestArray(null))
                .toThrowError(new InvalidPurchaseException("No ticket requests supplied"));
        });

        it("should validate each request and business rules successfully", () => {
            const requests = [
                new TicketTypeRequest("ADULT", 2),
                new TicketTypeRequest("CHILD", 1)
            ];

            expect(() => validateTicketRequestArray(requests)).not.toThrow();
        });
    });

    describe("validateTicketTypeRequest", () => {
        it("should throw an error when not instance of TicketTypeRequest", () => {
            const bad = { getTicketType: () => "ADULT", getNoOfTickets: () => 1 };
            expect(() => validateTicketTypeRequest(bad))
                .toThrowError(new InvalidPurchaseException("Invalid ticket request type"));
        });

        it("should throw an error when request is null", () => {
            expect(() => validateTicketTypeRequest(null))
                .toThrowError(new InvalidPurchaseException("Invalid ticket request type"));
        });

        it("should throw an error when number of tickets <= 0", () => {
            const req = new TicketTypeRequest("ADULT", 0);
            expect(() => validateTicketTypeRequest(req))
                .toThrowError(new InvalidPurchaseException("Number of tickets must be greater than zero"));
        });

        it("should not throw error for valid request", () => {
            const req = new TicketTypeRequest("ADULT", 2);
            expect(() => validateTicketTypeRequest(req)).not.toThrow();
        });
    });

    describe("validateMaxLimitTicketPurchase", () => {
        it("should throw error when total tickets exceed MAX_TICKETS", () => {
            const tooMany = config.MAX_TICKETS + 1;

            expect(() => validateMaxLimitTicketPurchase(tooMany))
                .toThrowError(
                    new InvalidPurchaseException(
                        `Cannot purchase more than ${config.MAX_TICKETS} tickets`
                    )
                );
        });

        it("should not throw error when within limit", () => {
            expect(() => validateMaxLimitTicketPurchase(config.MAX_TICKETS)).not.toThrow();
        });
    });

    describe("validateChildrenInfantAccompanyByAdult", () => {
        it("should throw error when adults == 0", () => {
            const noOfAdults = 0;
            expect(() => validateChildrenInfantAccompanyByAdult(noOfAdults))
                .toThrowError(
                    new InvalidPurchaseException("No adult ticket exists. Invalid ticket request.")
                );
        });

        it("should throw error when adults < 0", () => {
            const noOfAdults = -1;
            expect(() => validateChildrenInfantAccompanyByAdult(noOfAdults))
                .toThrowError(
                    new InvalidPurchaseException("No adult ticket exists. Invalid ticket request.")
                );
        });

        it("should not throw error when adults > 0", () => {
            const noOfAdults = 1;
            expect(() => validateChildrenInfantAccompanyByAdult(noOfAdults)).not.toThrow();
        });
    });

    describe("validateInfantAdultRatio", () => {
        it("should throw error when infants > adults", () => {
            const noOfInfants = 2;
            const noOfAdults = 1;
            expect(() => validateInfantAdultRatio(noOfAdults, noOfInfants))
                .toThrowError(
                    new InvalidPurchaseException(
                        "Adults cannot be less than infants, as one infant needs one adult to sit on their lap."
                    )
                );
        });

        it("should not throw error when infants == adults", () => {
            let noOfInfants = 2;
            let noOfAdults = 2;

            expect(() => validateInfantAdultRatio(2, 2)).not.toThrow();

        });

        it("should not throw error when infants < adults", () => {
            let noOfInfants = 2;
            let noOfAdults = 3;
            expect(() => validateInfantAdultRatio(noOfAdults, noOfInfants)).not.toThrow();
        });

    });

    describe("validateBusinessRules", () => {
        it("should throw error when any business rule fails", () => {
            const ticketCounts = { adults: 0, children: 1, infants: 0 };

            expect(() => validateBusinessRules(ticketCounts))
                .toThrowError(
                    new InvalidPurchaseException("No adult ticket exists. Invalid ticket request.")
                );
        });

        it("should not throw any error when all rules pass", () => {
            const ticketCounts = { adults: 2, children: 1, infants: 1 };

            expect(() => validateBusinessRules(ticketCounts)).not.toThrow();
        });
    });

});