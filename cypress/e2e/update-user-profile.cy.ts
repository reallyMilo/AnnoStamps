describe('Update user profile', () => {
  beforeEach(() => {
    cy.task('db:testUser')
  })
  afterEach(() => {
    cy.task('db:removeTestUser')
  })

  it('user unable to submit if username input fails validation', () => {
    cy.newUserSession('/testSeedUserId/settings')
    cy.findByLabelText('Username').type('cypress tester')
    cy.findByRole('button', { name: 'Save' }).click()
    cy.get('#username')
      .invoke('prop', 'validationMessage')
      .should(
        'equal',
        'Select a username containing only alphanumeric characters, dashes (-), and underscores (_).'
      )
  })

  it('duplicate username error is displayed on already taken username', () => {
    cy.newUserSession('/testSeedUserId/settings')
    cy.intercept('PUT', '/api/user').as('setUsername')

    cy.findByLabelText('Username').type('user1')

    cy.findByRole('button', { name: 'Save' }).click()
    cy.wait('@setUsername').its('response.statusCode').should('eq', 400)
    cy.findByText('username already taken.').should('be.visible')
  })

  it('user can set username', () => {
    cy.newUserSession('/testSeedUserId/settings')
    cy.intercept('PUT', '/api/user').as('setUsername')

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
  it('user can update profile with username set', () => {
    cy.usernameSession('/testSeedUserId/settings')
    cy.intercept('PUT', '/api/user').as('setBio')

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
    }).as('bioUpdated')

    cy.findByLabelText('Username').invoke('val').should('equal', 'testSeedUser')
    cy.findByLabelText('About').invoke('val').should('equal', '')

    cy.findByLabelText('About').type('cypress tester biography')
    cy.findByRole('button', { name: 'Save' }).click()

    cy.wait('@setBio').its('response.statusCode').should('eq', 200)
    cy.wait('@bioUpdated')
    cy.database(`SELECT * FROM "User" WHERE username = 'testSeedUser';`).then(
      (users) => {
        const user = users[0]
        cy.wrap(user).its('biography').should('eq', 'cypress tester biography')
      }
    )

    cy.findByLabelText('About')
      .invoke('val')
      .should('equal', 'cypress tester biography')
  })
})
