describe("Media Search Page ", () => {
  it("renders media table with search and pagination", () => {
    cy.visit("/media/search");

    cy.get('input[placeholder="Suche nach Titel..."]').type("Business-focused");
  });
});
