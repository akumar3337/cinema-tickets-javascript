import { describe, it, expect } from "vitest";
import { extractTicketCounts } from "../../../src/utils/utils.js";
import { TicketCounts } from "../../../src/utils/TicketCounts.js";
import TicketTypeRequest from "../../../src/pairtest/lib/TicketTypeRequest.js";

describe("extractTicketCounts", () => {

    it("should extract counts for adults, children, and infants", () => {
        const requests = [
            new TicketTypeRequest("ADULT", 2),
            new TicketTypeRequest("CHILD", 3),
            new TicketTypeRequest("INFANT", 1)
        ];

        const result = extractTicketCounts(requests);

        expect(result.adults).toBe(2);
        expect(result.children).toBe(3);
        expect(result.infants).toBe(1);
    });

    it("should sum up multiple entries of the same ticket type", () => {
        const requests = [
            new TicketTypeRequest("ADULT", 1),
            new TicketTypeRequest("ADULT", 2),
            new TicketTypeRequest("CHILD", 1),
            new TicketTypeRequest("CHILD", 4),
            new TicketTypeRequest("INFANT", 3),
            new TicketTypeRequest("INFANT", 2)
        ];

        const result = extractTicketCounts(requests);

        expect(result.adults).toBe(3);
        expect(result.children).toBe(5);
        expect(result.infants).toBe(5);
    });

    it("should return zero counts when no requests are provided", () => {
        const result = extractTicketCounts([]);

        expect(result.adults).toBe(0);
        expect(result.children).toBe(0);
        expect(result.infants).toBe(0);
    });

    it("should handle requests with only adults", () => {
        const requests = [
            new TicketTypeRequest("ADULT", 5)
        ];

        const result = extractTicketCounts(requests);

        expect(result.adults).toBe(5);
        expect(result.children).toBe(0);
        expect(result.infants).toBe(0);
    });

    it("should handle requests with only children", () => {
        const requests = [
            new TicketTypeRequest("CHILD", 4)
        ];

        const result = extractTicketCounts(requests);

        expect(result.adults).toBe(0);
        expect(result.children).toBe(4);
        expect(result.infants).toBe(0);
    });

    it("should handle requests with only infants", () => {
        const requests = [
            new TicketTypeRequest("INFANT", 7)
        ];

        const result = extractTicketCounts(requests);

        expect(result.adults).toBe(0);
        expect(result.children).toBe(0);
        expect(result.infants).toBe(7);
    });

    it("should return a TicketCounts instance", () => {
        const requests = [
            new TicketTypeRequest("ADULT", 1)
        ];

        const result = extractTicketCounts(requests);

        expect(result).toBeInstanceOf(TicketCounts);
    });

});