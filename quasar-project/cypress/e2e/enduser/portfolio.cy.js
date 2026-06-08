describe('FT-10: Upravljanje portfoliom', () => {
  beforeEach(() => {
    cy.visit('http://localhost:9000/#/auth')
    cy.get('input[aria-label="E-mail adresa"]').first().type('anteantic@fotograf.hr')
    cy.get('input[type="password"]').first().type('ante123')
    cy.contains('button', 'Prijavi se').click()
    cy.url().should('include', '/fotograf')
  })

  it('Fotograf dodaje novi rad u portfolio', () => {
    cy.visit('http://localhost:9000/#/fotograf/portfolio')
    cy.contains('Dodaj fotografiju').click()
    cy.get('input[aria-label="Naziv rada"]').type('Testno vjenčanje')
    cy.get('textarea[aria-label="Opis rada"]').type('Opis testnog rada')
    cy.get('input[aria-label="Link slike"]').type('images/vjencanje.png')
    cy.contains('button', 'Spremi').click()
    cy.get('.portfolio-box').should('contain', 'Testno vjenčanje')
  })
})
