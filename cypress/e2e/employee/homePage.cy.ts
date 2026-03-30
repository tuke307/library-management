describe("Homepage", () => {
  before(() => {
    cy.loginEmployee(1, "password1");
  });

  it("displays EmployeeCards when logged in", () => {
    // Wait for the EmployeeCards to be visible
    cy.contains("Medium suchen").should("exist"); // Make sure UserCards are not visible
    cy.contains("Medium erstellen").should("exist");
  });
});
