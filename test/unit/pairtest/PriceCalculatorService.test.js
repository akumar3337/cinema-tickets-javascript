import { describe, it, expect } from "vitest";
import { calculateTotalPrice } from "../../../src/pairtest/PriceCalculatorService.js";
import config from "../../../src/configs/config.js";

describe("calculateTotalPrice (including infants)", () => {

    it("should calculates total price for children and adults", () => {
        const ticketCounts = { adults: 4, children: 3 };

        const expected =
            ticketCounts.adults   * config.ADULT_TICKET_PRICE +
            ticketCounts.children * config.CHILD_TICKET_PRICE;

        expect(calculateTotalPrice(ticketCounts)).toBe(expected);
    });

    it("should ignore infants ticket price when calculates total price as infants do not pay", () => {
        const ticketCounts = { adults: 4, children: 3, infants: 4 };

        const expected =
            ticketCounts.adults   * config.ADULT_TICKET_PRICE +
            ticketCounts.children * config.CHILD_TICKET_PRICE;

        expect(calculateTotalPrice(ticketCounts)).toBe(expected);
    });

});