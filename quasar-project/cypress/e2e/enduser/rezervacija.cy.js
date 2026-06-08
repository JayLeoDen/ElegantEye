describe('FT-6: Kreiranje rezervacije', () => {
  beforeEach(() => {
    cy.visit('http://localhost:9000/#/auth')
    cy.contains('.q-field', 'E-mail').find('input').first().type('mategulan@gmail.com')
    cy.contains('.q-field', 'Lozinka').find('input').first().type('mate123')
    cy.contains('button', 'Prijavi se').click()
    cy.url().should('include', '/korisnik')
  })

  it('Korisnik uspješno kreira rezervaciju', () => {
    cy.visit('http://localhost:9000/#/korisnik/rezervacija')

    cy.get('.q-select').first().click()
    cy.get('.q-menu .q-item').first().click()

    cy.get('.q-select').eq(1).click()
    cy.get('.q-menu .q-item').first().click()

    cy.get('input[type="date"]').type('2027-12-01')
    cy.get('input[type="time"]').type('14:00')

    cy.contains('.q-field', 'Lokacija').find('input').type('Hotel Bonavia')

    cy.contains('.q-field', 'Dodatne napomene').find('textarea').type('Testna napomena')

    cy.contains('button', 'Potvrdi rezervaciju').click()
    cy.get('.q-notification').should('contain', 'Rezervacija spremljena')
  })
})