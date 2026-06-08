describe('FT-16: Pregled izvještaja', () => {
  beforeEach(() => {
    cy.visit('http://localhost:9000/#/auth')
    cy.get('input[aria-label="E-mail adresa"]').first().type('admin@eleganteye.hr')
    cy.get('input[type="password"]').first().type('admin123')
    cy.contains('button', 'Prijavi se').click()
    cy.url().should('include', '/admin')
  })

  it('Administrator odabire parametre i generira izvještaj', () => {
    cy.visit('http://localhost:9000/#/admin/izvjestaji')
    cy.wait(1000)

    cy.get('.q-select').eq(0).click()
    cy.wait(500)
    cy.get('.q-menu .q-item').first().click({ force: true })
    cy.wait(500)

    cy.get('.q-select').eq(1).click()
    cy.wait(500)
    cy.get('.q-menu .q-item').first().click({ force: true })
    cy.wait(500)

    cy.get('.q-select').eq(2).click()
    cy.wait(500)
    cy.get('.q-menu .q-item').first().click({ force: true })
    cy.wait(500)

    cy.contains('button', 'Generiraj izvještaj').click()
    cy.wait(1000)

    cy.get('.q-table, .ee-page').should('exist')
  })
})