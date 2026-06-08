describe('FT-7: Pregled vlastitih rezervacija', () => {
  beforeEach(() => {
    cy.visit('http://localhost:9000/#/auth')
    cy.get('input[aria-label="E-mail adresa"]').first().type('mategulan@gmail.com')
    cy.get('input[type="password"]').first().type('mate123')
    cy.contains('button', 'Prijavi se').click()
    cy.url().should('include', '/korisnik')
  })

  it('Prikazuju se korisnikove rezervacije', () => {
    cy.visit('http://localhost:9000/#/korisnik/rezervacije')
    cy.get('.ee-page').should('exist')
    cy.get('h1').should('exist')
  })
})
