describe('PT-5: Pregled rezervacija korisnika', () => {
  beforeEach(() => {
    cy.visit('http://localhost:9000/#/auth')
    cy.get('input[aria-label="E-mail adresa"]').first().type('ana1780935963101@test.com')
    cy.get('input[type="password"]').first().type('test123')
    cy.contains('button', 'Prijavi se').click()
    cy.url().should('include', '/korisnik')
  })

  it('Korisnik otvara pregled rezervacija i vidi status svake', () => {
    cy.visit('http://localhost:9000/#/korisnik/rezervacije')
    cy.wait(2000)
    cy.get('.q-table').should('exist')
    cy.get('.q-table tbody tr').should('have.length.greaterThan', 0)
    cy.get('.q-table tbody tr').first().then($row => {
      const text = $row.text()
      expect(text).to.match(/na cekanju|potvrdjena|odbijena|otkazana/)
    })
  })
})