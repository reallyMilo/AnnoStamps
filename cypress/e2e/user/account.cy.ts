describe('user/account route', () => {
  beforeEach(() => {
    cy.userSession()
    cy.visit('/user/account')
    cy.wait('@session')
  })
  it('renders user/account page', () => {
    cy.get('h1').invoke('text').should('equal', 'Account Details')
  })
  it('new user can set username', () => {
    cy.intercept('PUT', '/api/user/cypressTester', {
      statusCode: 200,
    }).as('setUsername')
    cy.get('#username').type('cypressTester')
    cy.getBySel('username-submit').click()

    cy.intercept('/api/auth/session', {
      user: {
        name: 'cypress-tester',
        email: 'cypress@tester.com',
        image: null,
        username: 'cypressTester',
      },
      expires: '3000-01-01T00:00:00.000Z',
      accessToken: 'abcdefghijklmnopqrst',
    })
    cy.get('#username').invoke('val').should('equal', 'cypressTester')
    cy.getBySel('username-submit').should('not.exist')
  })
})
