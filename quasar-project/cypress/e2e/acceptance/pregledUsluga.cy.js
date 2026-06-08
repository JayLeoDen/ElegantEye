describe('PT-3: Pregled usluga', () => {
  beforeEach(() => {
    cy.visit('http://localhost:9000/#/auth')
    cy.get('input[aria-label="E-mail adresa"]').first().type('mategulan@gmail.com')
    cy.get('input[type="password"]').first().type('mate123')
    cy.contains('button', 'Prijavi se').click()
    cy.url().should('include', '/korisnik')
  })

  it('Korisnik pregledava dostupne usluge i otvara detalje odabrane', () => {
    cy.visit('http://localhost:9000/#/korisnik/usluge')
    cy.get('.card-line').should('have.length.greaterThan', 0)
    cy.get('.card-line').first().contains('Detalji').click()
    cy.url().should('include', '/usluge/')
    cy.get('.ee-page').should('exist')
  })
})