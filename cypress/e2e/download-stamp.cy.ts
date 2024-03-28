const path = require('path') // eslint-disable-line

describe('Download Stamp from stamp page', () => {
  it('user can download stamp and download counter incrementing', () => {
    cy.visit('/')
    cy.getBySel('stamp-card-link')
      .first()
      .then((link) => {
        cy.visit(link.attr('href'))
      })

    cy.intercept('GET', '/stamp.zip', {
      fixture: 'test-stamp.zip',
    }).as('download')
    cy.intercept('/api/stamp/download/*').as('incDownloads')

    cy.getBySel('stamp-downloads')
      .invoke('text')
      .then(Number)
      .then((initDownloads) => {
        cy.getBySel('stamp-download')
          .trigger('mouseover')
          .then(($link) => {
            expect($link.css('cursor')).to.equal('pointer')
          })
          .click()
        cy.wait('@incDownloads')
        cy.wait('@download').then((req) => {
          expect(req.response.statusCode).to.equal(200)
        })
        cy.reload(true)
        cy.getBySel('stamp-downloads').should(
          'have.text',
          String(initDownloads + 1)
        )
      })

    const downloadsFolder = Cypress.config('downloadsFolder')

    cy.get('h1').then((h1) => {
      const filename = path.join(downloadsFolder, `${h1.text().trimEnd()}.zip`)
      cy.readFile(filename, { timeout: 15000 }).should('have.length.gt', 50)
    })
  })

  it('shows 404 page if stamp route is invalid', () => {
    const url = `/stamp/does-not-exist`
    cy.request({ url, failOnStatusCode: false })
      .its('status')
      .should('equal', 200)
    cy.visit(url, { failOnStatusCode: false })
    cy.findByText('404 - Page not found').should('be.visible')
  })
})
