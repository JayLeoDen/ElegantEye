describe('FT-3: Pregled usluga', () => {
  beforeEach(() => {
    cy.visit('http://localhost:9000/#/auth')
    cy.get('input[aria-label="E-mail adresa"]').first().type('mategulan@gmail.com', { delay: 100 })
    cy.get('input[type="password"]').first().type('mate123', { delay: 100 })
    cy.contains('button', 'Prijavi se').click()
    cy.url().should('include', '/korisnik')
  })

  it('Prikazuje se popis dostupnih usluga', () => {
    cy.visit('http://localhost:9000/#/usluge')
    cy.get('.card-line').should('have.length.greaterThan', 0)
  })

  it('Pretraga filtrira rezultate', () => {
    cy.visit('http://localhost:9000/#/usluge')
    cy.get('input[aria-label="Pretraga po imenu, lokaciji ili vrsti usluge"]').type('Ante', { delay: 100 })
    cy.get('.card-line').each($el => {
      cy.wrap($el).invoke('text').then(text => {
        expect(text).to.include('Ante')
      })
    })
  })
})
