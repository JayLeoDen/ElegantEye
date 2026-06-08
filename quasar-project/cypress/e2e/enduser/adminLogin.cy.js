describe('FT-13: Prijava administratora', () => {
  it('Administrator se uspješno prijavljuje', () => {
    cy.visit('http://localhost:9000/#/auth')
    cy.get('input[aria-label="E-mail adresa"]').first().type('admin@eleganteye.hr')
    cy.get('input[type="password"]').first().type('admin123')
    cy.contains('button', 'Prijavi se').click()
    cy.url().should('include', '/admin')
  })
})
