describe('User can set username', () => {
  beforeEach(() => {
    cy.task('db:testUser')
    cy.newUserSession('/user/account')
  })
  afterEach(() => {
    cy.task('db:removeTestUser')
  })

  it('user can navigate to account settings and update username', () => {
    cy.intercept('PUT', '/api/user', (req) => {
      req.headers[
        'Cookie'
      ] = `next-auth.csrf-token=dfbc1c2ed29dd90157662042a479720a4bf4c394f954bdd2e01a372aa42c9f1b%7C426823b50e26ac90384ba7a800b10b79c4d19202dd2a5e1f80739d2c7594db44; next-auth.session-token=cdc4b0fb-77b5-44b5-947a-dde785af2676;`
    }).as('setUsername')

    cy.intercept('/api/auth/session', {
      user: {
        name: 'cypress-tester',
        email: 'cypress@tester.com',
        image: null,
        username: 'cypressTester',
        biography: 'cypress tester biography',
      },
      expires: '3000-01-01T00:00:00.000Z',
      accessToken: 'abcdefghijklmnopqrst',
    }).as('usernameSet')

    cy.findByLabelText('Username').type('cypressTester')
    cy.findByLabelText('About').type('cypress tester biography')
    cy.findByRole('button', { name: 'Save' }).click()

    cy.wait('@setUsername').its('response.statusCode').should('eq', 200)

    cy.wait('@usernameSet')
    cy.database(`SELECT * FROM "User" WHERE username = 'cypressTester';`).then(
      (users) => {
        const user = users[0]
        cy.wrap(user).its('username').should('eq', 'cypressTester')
        cy.wrap(user).its('usernameURL').should('eq', 'cypresstester')
      }
    )
    cy.findByLabelText('Username')
      .invoke('val')
      .should('equal', 'cypressTester')
    cy.findByLabelText('About')
      .invoke('val')
      .should('equal', 'cypress tester biography')
    cy.findByText(
      'If you wish to change your username please contact us via the discord server.'
    ).should('exist')
  })
})
