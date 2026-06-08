describe('PT-9: Prijava administratora', () => {
  it('Administrator se uspješno prijavljuje i pristupa administracijskom sučelju', () => {
    cy.visit('http://localhost:9000/#/auth')
    cy.get('input[aria-label="E-mail adresa"]').first().type('admin@eleganteye.hr')
    cy.get('input[type="password"]').first().type('admin123')
    cy.contains('button', 'Prijavi se').click()
    cy.url().should('include', '/admin')
    cy.get('.ee-page').should('exist')
  })
})
