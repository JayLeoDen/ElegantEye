describe('FT-2: Testiranje registracije korisnika', () => {
  beforeEach(() => {
    cy.visit('http://localhost:9000/#/auth')
  })

  it('Korisnik se uspješno registrira s ispravnim podacima', () => {
    const timestamp = Date.now()
    cy.get('input[aria-label="Ime"]').type('Testni')
    cy.get('input[aria-label="Prezime"]').type('Korisnik')
    cy.get('input[aria-label="E-mail adresa"]').last().type(`korisnik${timestamp}@test.com`, { delay: 100 })
    cy.get('input[type="password"]').last().type('test123', { delay: 100 })
    cy.contains('button', 'Registriraj se').click()
    cy.get('.q-notification').should('contain', 'uspješna')
  })

  it('Registracija s praznim poljima prikazuje grešku', () => {
    cy.contains('button', 'Registriraj se').click()
    cy.get('.q-notification').should('exist')
  })
})
