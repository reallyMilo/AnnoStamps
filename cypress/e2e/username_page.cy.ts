describe('Username Page', () => {
  it('displays user stamps', () => {
    cy.visit('/user1')
    cy.intercept('get', '/api/user', {
      fixture: 'userStamps',
    })

    cy.get('#stamp-title').should('be.visible')
  })

  it('displays 404 page', () => {
    cy.request({ url: '/no-user', failOnStatusCode: false })
      .its('status')
      .should('equal', 404)
    cy.visit('/no-user', { failOnStatusCode: false })
  })
})
