describe('user/account route', () => {
  it('new user can set username', () => {
    cy.visit('/user/account')
    cy.intercept('PUT', '/api/user', {
      statusCode: 200,
    })
    cy.intercept('/api/auth/session', {
      user: {
        name: 'cypress-tester',
        email: 'cypress@tester.com',
        image: null,
        username: null,
      },
      expires: '3000-01-01T00:00:00.000Z',
      accessToken: 'abcdefghijklmnopqrst',
    })
    cy.get('#username').type('cypressTester')
    cy.get('#user-settings').submit()

    cy.userSession()
    cy.get('#username').invoke('val').should('equal', 'cypressTester')
    cy.findByText(
      'If you wish to change your username please contact us via the discord server.'
    ).should('exist')
  })
})
