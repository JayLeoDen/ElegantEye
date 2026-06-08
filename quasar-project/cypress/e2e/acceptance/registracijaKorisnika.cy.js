describe('PT-1: Registracija korisnika', () => {
  it('Korisnik otvara obrazac, unosi podatke i uspješno kreira račun', () => {
    const timestamp = Date.now()
    cy.visit('http://localhost:9000/#/auth')
    cy.get('input[aria-label="Ime"]').type('Ana')
    cy.get('input[aria-label="Prezime"]').type('Testić')
    cy.get('input[aria-label="E-mail adresa"]').last().type(`ana${timestamp}@test.com`)
    cy.get('input[type="password"]').last().type('test123')
    cy.contains('button', 'Registriraj se').click()
    cy.get('.q-notification').should('contain', 'uspješna')
  })
})
