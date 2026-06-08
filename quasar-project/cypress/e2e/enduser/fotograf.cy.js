describe('FT-4: Pregled profila fotografa', () => {
  beforeEach(() => {
    cy.visit('http://localhost:9000/#/auth')
    cy.get('input[aria-label="E-mail adresa"]').first().type('mategulan@gmail.com', { delay: 100 })
    cy.get('input[type="password"]').first().type('mate123', { delay: 100 })
    cy.contains('button', 'Prijavi se').click()
    cy.url().should('include', '/korisnik')
  })

  it('Otvara se detaljna stranica fotografa', () => {
    cy.visit('http://localhost:9000/#/usluge')
    cy.get('.card-line').first().contains('Detalji').click()
    cy.url().should('include', '/usluge/')
    cy.get('.ee-page').should('exist')
  })
})
