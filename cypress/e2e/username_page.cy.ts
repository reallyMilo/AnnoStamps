describe('Username Page', () => {
  it('renders without stamps', () => {
    cy.visit('/user1')
    cy.intercept('get', '/api/user/user1', {
      statusCode: 200,
      body: { user: { listedStamps: [] } },
    })
    cy.contains('user1')
    cy.get('h1').invoke('text').should('equal', 'user1')
    cy.contains('User has no stamps')
  })

  it('displays user stamps', () => {
    cy.visit('/user1')
    cy.intercept('get', '/api/user/user1', {
      fixture: 'userStamps',
    })

    cy.get('#stamp-title').should('be.visible')
  })

  it('displays error message for user not found', () => {
    cy.visit('/no-user')
    cy.intercept('get', '/api/user/no-user', {
      statusCode: 404,
      body: { message: 'User not found' },
    })

    cy.contains('User not found')
  })
})
