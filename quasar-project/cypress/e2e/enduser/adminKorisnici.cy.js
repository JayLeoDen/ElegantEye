describe('FT-14: Upravljanje korisnicima', () => {
  beforeEach(() => {
    cy.visit('http://localhost:9000/#/auth')
    cy.get('input[aria-label="E-mail adresa"]').first().type('admin@eleganteye.hr')
    cy.get('input[type="password"]').first().type('admin123')
    cy.contains('button', 'Prijavi se').click()
    cy.url().should('include', '/admin')
  })

  it('Administrator pregledava popis korisnika', () => {
    cy.visit('http://localhost:9000/#/admin/korisnici')
    cy.get('.ee-page').should('exist')
    cy.get('.q-table').should('exist')
  })
})
