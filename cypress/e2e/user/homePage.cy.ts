describe("Homepage", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("displays UserCards when not logged in", () => {
    cy.contains("Medium suchen").should("exist");
    cy.contains("ausgeliehene Medien anzeigen").should("exist");
  });
});
