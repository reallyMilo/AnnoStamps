const path = require('path') // eslint-disable-line

describe('Stamp Page', () => {
  it('download button should download stamp', () => {
    cy.visit('/')
    cy.getBySel('stamp-card-link')
      .first()
      .then(($link) => {
        cy.visit($link.attr('href'))
      })

    cy.intercept('GET', '/stamp.zip', {
      fixture: 'test-stamp.zip',
    }).as('download')
    cy.intercept('GET', '/api/stamp/download/*', { statusCode: 200 })
    cy.getBySel('stamp-download')
      .trigger('mouseover')
      .then(($link) => {
        expect($link.css('cursor')).to.equal('pointer')
      })
      .click()

    cy.wait('@download').then((req) => {
      expect(req.response.statusCode).to.equal(200)
    })
    const downloadsFolder = Cypress.config('downloadsFolder')

    cy.get('h1').then((h1) => {
      const filename = path.join(downloadsFolder, `${h1.text().trimEnd()}.zip`)
      cy.readFile(filename, { timeout: 15000 }).should('have.length.gt', 50)
    })
  })
})
