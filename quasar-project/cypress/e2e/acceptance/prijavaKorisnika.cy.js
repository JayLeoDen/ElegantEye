describe('PT-2: Prijava korisnika', () => {
  it('Registrirani korisnik unosi podatke i uspješno pristupa profilu', () => {
    cy.visit('http://localhost:9000/#/auth')
    cy.get('input[aria-label="E-mail adresa"]').first().type('ana1780935963101@test.com')
    cy.get('input[type="password"]').first().type('test123')
    cy.contains('button', 'Prijavi se').click()
    cy.url().should('include', '/korisnik')
    cy.get('.ee-page').should('exist')
  })
})
