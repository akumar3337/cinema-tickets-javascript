<!-- It is supposed to all about this project, but I have added this task details for now -->
# Objective
Provide a working implementation of a `TicketService` that:
- Considers the given business rules, constraints & assumptions.
- Calculates the correct amount for the requested tickets and makes a payment request to the `TicketPaymentService`.
- Calculates the correct no of seats to reserve and makes a seat reservation request to the `SeatReservationService`.
- Rejects any invalid ticket purchase requests. It is up to you to identify what should be deemed as an invalid purchase request

# Business Rules
- There are 3 types of tickets i.e. Infant, Child, and Adult.
- The ticket prices are based on the type of ticket (see table below).
- The ticket purchaser declares how many and what type of tickets they want to buy.
- Multiple tickets can be purchased at any given time.
- Only a maximum of 25 tickets that can be purchased at a time.
- Infants do not pay for a ticket and are not allocated a seat. They will be sitting on an Adult's lap.
- Child and Infant tickets cannot be purchased without purchasing an Adult ticket.
  |   Ticket Type    |     Price   |
  | ---------------- | ----------- |
  |    INFANT        |    £0       |
  |    CHILD         |    £15     |
  |    ADULT         |    £25      |
- There is an existing `TicketPaymentService` responsible for taking payments.
- There is an existing `SeatReservationService` responsible for reserving seats.

## Constraints
- The code in the thirdparty.* packages CANNOT be modified.
- The `TicketTypeRequest` SHOULD be an immutable object.

## implementation details:
not adding any test on ticket type request as this validation is already present in the given tickettyperequest. Therefore no test added

## Assumptions - provided
- All accounts with an id greater than zero are valid. They also have sufficient funds to pay for any no of tickets.
- The `TicketPaymentService` implementation is an external provider with no defects. You do not need to worry about how the actual payment happens.
- The payment will always go through once a payment request has been made to the `TicketPaymentService`.
- The `SeatReservationService` implementation is an external provider with no defects. You do not need to worry about how the seat reservation algorithm works.
- The seat will always be reserved once a reservation request has been made to the `SeatReservationService`.

## Additional Assumptions
- Additional classes, files and project directories can be created without breaking the given constraints
- At least one ticket request is required, and each request is a `TicketTypeRequest`.
- A purchase must include at least one adult ticket.
- Infants require an adult (infants must be less than or equal to adults). Therefore, infants > adults is a _Failure scenario_ AND infants <= adults is _Success scenario_
- A single purchase cannot exceed 25 total tickets including infants along with adults and children.
- Seats are reserved for adults and children only; infants do not take seats.
- Any TicketTypeRequest with noOfTicktes==0 is invalid even when it comes with valid ones as below:

```bash
        const ticketTypeRequestArray = [
            new TicketTypeRequest("ADULT", 1),
            new TicketTypeRequest("ADULT", 0),  <--invalid request type
            new TicketTypeRequest("CHILD", 1),
            new TicketTypeRequest("CHILD", 4),
            new TicketTypeRequest("INFANT", 2)
        ];
```


## Project Structure
- `src/pairtest/lib/`: supportive type and exceptions
- `src/pairtest/TicketService.js`: orchestrates validation, pricing, and seat reservation.
- `src/validators/Validators.js`: validation and business rules.
- `src/utils/`: ticket counting helpers.
- `src/configs/config.js`: ticket prices and max ticket limit - config externalized.
- `src/thirdparty/`: payment and seat reservation stubs.
- `test/unit/`: unit tests for services, validators, and utils.

## Pre-requisite
node v22

## How to Build
```bash
npm run build
```

## How to Test
```bash
npm run test
```

## Optional coverage:
```bash
npm run coverage
```
