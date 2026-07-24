// cypress/integration/mediaViewPage.cy.js

describe("Media View Page", () => {
  before(() => {
    cy.loginEmployee(1, "password1");
  });

  it("displays media details for an employee", () => {
    const mediaId = "1556a951-27fd-47b9-929f-367763be055a";

    // Visit the media details page
    cy.visit(`/media/view/${mediaId}`);

    // Add assertions based on the media view page for an employee
    cy.contains("Medium").should("exist");
    cy.contains("Author").should("exist");
    cy.contains("Lokation").should("exist");
    cy.contains("Ausleihe").should("not.exist");
  });
});
