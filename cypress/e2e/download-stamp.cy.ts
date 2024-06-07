const path = require('path') // eslint-disable-line

describe('Download Stamp from stamp page', () => {
  it('user can download stamp and download counter incrementing', () => {
    cy.visit('/')
    cy.getBySel('stamp-card-link')
      .first()
      .then((link) => {
        cy.visit(link.attr('href'))
      })

    cy.getBySel('stamp-downloads')
      .invoke('text')
      .then(Number)
      .then((initDownloads) => {
        cy.log(String(initDownloads))
        cy.getBySel('stamp-download')
          .trigger('mouseover')
          .then(($link) => {
            expect($link.css('cursor')).to.equal('pointer')
          })
          .click()

        cy.url().then((url) => {
          cy.database(
            `SELECT * FROM "Stamp" WHERE id = '${url.split('/').at(-1)}';`
          ).then((stamps) => {
            const stamp = stamps[0]
            cy.wrap(stamp)
              .its('downloads')
              .should('eq', initDownloads + 1)
          })
        })
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
