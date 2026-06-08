describe('PT-6: Prijava fotografa', () => {
  it('Fotograf se prijavljuje i pristupa svom korisničkom sučelju', () => {
    cy.visit('http://localhost:9000/#/auth')
    cy.get('input[aria-label="E-mail adresa"]').first().type('anteantic@fotograf.hr')
    cy.get('input[type="password"]').first().type('ante123')
    cy.contains('button', 'Prijavi se').click()
    cy.url().should('include', '/fotograf')
    cy.get('.ee-page').should('exist')
  })
})
