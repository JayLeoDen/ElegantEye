describe('FT-11: Obrada rezervacije', () => {
  beforeEach(() => {
    cy.visit('http://localhost:9000/#/auth')
    cy.get('input[aria-label="E-mail adresa"]').first().type('anteantic@fotograf.hr')
    cy.get('input[type="password"]').first().type('ante123')
    cy.contains('button', 'Prijavi se').click()
    cy.url().should('include', '/fotograf')
  })

  it('Fotograf pregledava i potvrđuje rezervaciju', () => {
    cy.visit('http://localhost:9000/#/fotograf/rezervacije')
    cy.get('.ee-page').should('exist')
    cy.get('body').then($body => {
      if ($body.find('button:contains("Potvrdi")').length > 0) {
        cy.contains('button', 'Potvrdi').first().click()
        cy.get('.q-notification').should('exist')
      }
    })
  })
})
