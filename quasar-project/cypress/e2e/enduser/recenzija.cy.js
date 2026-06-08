describe('FT-8: Slanje recenzije', () => {
  beforeEach(() => {
    cy.visit('http://localhost:9000/#/auth')
    cy.contains('.q-field', 'E-mail').find('input').first().type('mategulan@gmail.com')
    cy.contains('.q-field', 'Lozinka').find('input').first().type('mate123')
    cy.contains('button', 'Prijavi se').click()
    cy.url().should('include', '/korisnik')
  })

  it('Korisnik šalje recenziju za rezervaciju', () => {
    cy.visit('http://localhost:9000/#/korisnik/rezervacije')

    cy.contains('Recenzija').first().click()
    cy.get('.q-dialog').should('exist')
    cy.get('.q-rating__icon').last().click()

    cy.get('.q-dialog textarea').type('Odlična usluga, preporučujem!')

    cy.get('.q-dialog').contains('button', 'Spremi').click()

    cy.get('.q-notification').should('exist')
  })
})