describe('Delete stamp', () => {
  beforeEach(() => {
    cy.task('db:testUser', true)
  })
  afterEach(() => {
    cy.task('db:removeTestUser')
  })

  it('user cannot see stamp commands nor delete other stamps', () => {
    cy.usernameSession('/user100')
    cy.getBySel('delete-stamp').should('not.exist')
    cy.getBySel('stamp-card-link')
      .last()
      .invoke('attr', 'href')
      .should('be.a', 'string')
      .invoke('split', '/')
      .its(2)
      .should('have.length', 24)
      .then((id) => {
        cy.request({
          url: `/api/stamp/delete/${id}`,
          method: 'DELETE',
          failOnStatusCode: false,
        }).then((response) => {
          expect(response.status).to.eq(500)
          expect(response.body).to.have.property('ok', false)
          expect(response.body).to.have.property('message', 'Not stamp owner')
        })
      })
  })

  it('user can delete own stamp', () => {
    cy.intercept('/api/stamp/delete/*').as('deleteStamp')
    cy.usernameSession('/testseeduser')
    cy.getBySel('delete-stamp').click()
    cy.findByRole('button', { name: 'Yes, delete' })
      .should('be.visible')
      .click()
    cy.wait('@deleteStamp')

    cy.database(
      `SELECT * FROM "Stamp" WHERE title = 'Test-Seed-User-Stamp';`
    ).then((stamps) => {
      cy.wrap(stamps).should('have.length', 0)
    })
    cy.reload()
    cy.findByText('User has no stamps').should('be.visible')
  })
})