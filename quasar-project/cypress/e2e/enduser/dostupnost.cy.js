describe('FT-12: Dodavanje dostupnosti', () => {
  beforeEach(() => {
    cy.visit('http://localhost:9000/#/auth')
    cy.get('input[aria-label="E-mail adresa"]').first().type('anteantic@fotograf.hr')
    cy.get('input[type="password"]').first().type('ante123')
    cy.contains('button', 'Prijavi se').click()
    cy.url().should('include', '/fotograf')
  })

  it('Fotograf dodaje termin dostupnosti', () => {
    cy.visit('http://localhost:9000/#/fotograf/dostupnost')
    cy.get('.ee-page').should('exist')
    cy.get('input[type="date"]').first().type('2027-12-01')
    cy.get('input[type="time"]').first().type('12:00')
    cy.get('.q-btn[type="submit"]').click()
    cy.get('.q-notification').should('exist')
  })
})
