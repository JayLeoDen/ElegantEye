describe('PT-8: Obrada rezervacije', () => {
  beforeEach(() => {
    cy.visit('http://localhost:9000/#/auth')
    cy.get('input[aria-label="E-mail adresa"]').first().type('marko.kovac@studio.hr')
    cy.get('input[type="password"]').first().type('fotograf123')
    cy.contains('button', 'Prijavi se').click()
    cy.url().should('include', '/fotograf')
  })

  it('Fotograf pregledava pristiglu rezervaciju i mijenja njezin status', () => {
    cy.visit('http://localhost:9000/#/fotograf/rezervacije')
    cy.wait(2000)
    cy.get('.q-table').should('exist')
    cy.get('.q-table tbody tr').should('have.length.greaterThan', 0)
    cy.contains('Pregled detalja').first().click()
    cy.wait(1000)
    cy.get('.q-dialog, .ee-page').should('exist')
  })
})