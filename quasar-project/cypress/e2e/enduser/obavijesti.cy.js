describe('FT-17: Slanje obavijesti korisnicima', () => {
  beforeEach(() => {
    cy.visit('http://localhost:9000/#/auth')
    cy.get('input[aria-label="E-mail adresa"]').first().type('admin@eleganteye.hr')
    cy.get('input[type="password"]').first().type('admin123')
    cy.contains('button', 'Prijavi se').click()
    cy.url().should('include', '/admin')
  })

  it('Administrator šalje obavijest svim korisnicima', () => {
    cy.visit('http://localhost:9000/#/admin/specijalne-funkcije')
    cy.wait(1000)

    cy.contains('Slanje obavijesti korisnicima').click()
    cy.wait(500)

    cy.get('input[aria-label="Tekst poruke"], textarea[aria-label="Tekst poruke"]')
      .type('Testna obavijest svim korisnicima', { delay: 80 })
    cy.wait(500)

    cy.contains('button', 'Pokreni funkciju').click()
    cy.wait(1000)

    cy.get('.q-notification').should('exist')
  })
})