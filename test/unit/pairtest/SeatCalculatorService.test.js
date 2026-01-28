import {describe, it, expect} from "vitest";
import {calculateTotalSeats} from "../../../src/pairtest/SeatCalculatorService.js";

describe("calculateTotalSeats", () => {

    it("should calculates seats correctly for adults and children", () => {
        const ticketCounts = {adults: 2, children: 3};

        const expected =
            ticketCounts.adults +
            ticketCounts.children;

        expect(calculateTotalSeats(ticketCounts)).toBe(expected);
    });

    it("should not include infant seat as no seat required for them", () => {
        const ticketCounts = {adults: 5, children: 3, infants: 5};

        const expected =
            ticketCounts.adults +
            ticketCounts.children;

        expect(calculateTotalSeats(ticketCounts)).toBe(expected);
    });

});