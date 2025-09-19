const path = require('path') // eslint-disable-line

describe('Download Stamp from stamp page', () => {
  it('user can download stamp from disclaimer', () => {
    cy.visit('/')
    cy.getBySel('stamp-card-link')
      .last()
      .then((link) => {
        cy.visit(link.attr('href'))
        cy.url().should('include', `${link.attr('href')}`)
      })

    cy.findByRole('button', { name: 'Download' })
      .click()
      .then(() =>
        cy
          .getBySel('stamp-downloads')
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
          }),
      )

    const downloadsFolder = Cypress.config('downloadsFolder')

    cy.get('h1').then((h1) => {
      const filename = path.join(downloadsFolder, `${h1.text().trimEnd()}.zip`)
      cy.readFile(filename, { timeout: 15000 }).should('have.length.gt', 50)
    })
  })

  it('shows 404 page if stamp route is invalid', () => {
    cy.on('uncaught:exception', (err) => {
      expect(err.message).to.include('NEXT_NOT_FOUND')

      // using mocha's async done callback to finish
      // this test so we prove that an uncaught exception
      // was thrown

      // return false to prevent the error from
      // failing this test
      return false
    })

    cy.visit(`/stamp/does-not-exist`, { failOnStatusCode: false })
    cy.findByText('404 - Page not found').should('be.visible')
  })
})
