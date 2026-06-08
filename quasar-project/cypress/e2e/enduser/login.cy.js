describe('FT-1: Testiranje prijave korisnika', () => {
  beforeEach(() => {
    cy.visit('http://localhost:9000/#/auth')
  })

  it('Korisnik se uspješno prijavljuje s ispravnim podacima', () => {
    cy.contains('.q-field', 'E-mail').find('input').first().type('mategulan@gmail.com', { delay: 100 })
    cy.contains('.q-field', 'Lozinka').find('input').first().type('mate123', { delay: 100 })
    cy.contains('button', 'Prijavi se').click()
    cy.url().should('include', '/korisnik')
  })

  it('Prijava s neispravnim podacima prikazuje grešku', () => {
    cy.contains('.q-field', 'E-mail').find('input').first().type('pogresni@email.com', { delay: 100 })
    cy.contains('.q-field', 'Lozinka').find('input').first().type('pogresna', { delay: 100 })
    cy.contains('button', 'Prijavi se').click()
    cy.get('.q-notification').should('exist')
  })
})