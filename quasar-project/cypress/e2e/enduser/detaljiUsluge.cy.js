describe('FT-5: Pregled detalja usluge', () => {
  it('Prikazuju se detalji odabrane usluge', () => {
    cy.visit('http://localhost:9000/#/usluge')
    cy.get('.card-line').first().contains('Detalji').click()
    cy.url().should('include', '/usluge/')
    cy.get('.ee-page').should('exist')
    cy.contains('Rezerviraj').should('exist')
  })
})
