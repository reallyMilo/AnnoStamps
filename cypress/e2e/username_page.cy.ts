describe('Username Page', () => {
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
