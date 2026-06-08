describe('FT-15: Upravljanje uslugama', () => {
  beforeEach(() => {
    cy.visit('http://localhost:9000/#/auth')
    cy.get('input[aria-label="E-mail adresa"]').first().type('admin@eleganteye.hr')
    cy.get('input[type="password"]').first().type('admin123')
    cy.contains('button', 'Prijavi se').click()
    cy.url().should('include', '/admin')
  })

  it('Administrator dodaje novu uslugu', () => {
    cy.visit('http://localhost:9000/#/admin/usluge')
    cy.get('input[aria-label="Naziv"]').type('Test usluga')
    cy.get('input[aria-label="Opis"]').type('Opis test usluge')
    cy.get('input[aria-label="Cijena"]').type('100')
    cy.get('input[aria-label="Trajanje (HH:MM:SS)"]').type('02:00:00')
    cy.contains('button', 'Dodaj').click()
    cy.get('.q-table').should('contain', 'Test usluga')
  })

  it('Administrator uređuje postojeću uslugu', () => {
    cy.visit('http://localhost:9000/#/admin/usluge')
    cy.wait(1000)
    cy.get('.q-table tbody tr').first().find('.q-btn').first().click()
    cy.wait(800)
    cy.get('input[aria-label="Naziv"]').clear()
    cy.wait(500)
    cy.get('input[aria-label="Naziv"]').type('Uređena usluga', { delay: 100 })
    cy.wait(800)
    cy.contains('button', 'Spremi izmjene').click()
    cy.wait(1000)
    cy.get('.q-table').should('contain', 'Uređena usluga')
  })
})