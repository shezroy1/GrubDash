## Justification of Design Decisions

This project uses a modular Express.js architecture, separating concerns into routers, controllers, data, and utility files. Each resource (dishes, orders) has its own router and controller, promoting maintainability and clarity. Error handling is centralized through middleware, and validation logic is abstracted into reusable functions. The use of in-memory data modules allows for easy testing and development without a database. Trade-offs include simplicity and speed of development versus persistence and scalability, which would require a database in a production environment.

## Debugging Approach and Reasoning

Debugging was performed using a combination of automated Jest tests and manual inspection. The test suite provided clear feedback on failing cases, which guided code corrections. Console logging was used during development to trace data flow and identify logic errors, but was silenced in production code to keep test output clean. Each handler was tested for both success and failure scenarios, ensuring robust coverage.

## Error and Edge Case Handling

The solution anticipates and handles errors through layered middleware. Validation functions check for required properties, correct data types, and valid values (e.g., price > 0, dish quantity > 0). Custom error messages and status codes are returned for missing or invalid input. Not found and method not allowed errors are handled by dedicated middleware. Edge cases, such as mismatched IDs or attempts to delete non-pending orders, are explicitly checked and return appropriate error responses.

## Process Log and Key Milestones

- Project setup and initial Express app scaffolding
- Implemented dishes and orders data modules
- Developed routers and controllers for dishes and orders
- Added validation and error handling middleware
- Wrote and refined handlers to pass all provided Jest tests
- Iteratively debugged and improved code based on test feedback
- Finalized documentation and code cleanup

## Evidence of Individual and Original Contributions

All controller and middleware logic was written from scratch, with validation and error handling tailored to the project requirements. The modular structure and reusable validation functions reflect my own design choices. Test-driven development was followed, and all code was iteratively improved based on test results and manual review. No code was copied from external sources.

## Disclosure of AI Tool Usage

I used AI tools (Github Copilot) to fill out the documentation after the coding portion was complete. AI tools are good at summarizing the codebase and wording descriptions well.

## Authenticity Explanations

The implementation demonstrates my understanding of Express.js, RESTful API design, and middleware patterns. All logic, including validation, error handling, and routing, was implemented by me. Any use of external help is limited to documentation from past lessons and the provided test suite. The codebase is original and reflects my approach to building robust server-side applications.
