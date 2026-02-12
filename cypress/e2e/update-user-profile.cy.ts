describe('Update user profile', () => {
  describe('new user', () => {
    beforeEach(() => {
      cy.task('db:testUser')
    })
    afterEach(() => {
      cy.task('db:removeTestUser')
    })
    it('user unable to submit if username input fails validation', () => {
      cy.setSessionCookie()
      cy.visit('/testSeedUserId/settings')

      cy.findByLabelText('Username').type('cypress tester')
      cy.findByRole('button', { name: 'Save' }).click()
      cy.findByLabelText('Username')
        .invoke('prop', 'validationMessage')
        .should(
          'equal',
          'Select a username containing only alphanumeric characters, dashes (-), and underscores (_).',
        )
    })

    it('duplicate username error is displayed on already taken username', () => {
      cy.intercept('POST', '/testSeedUserId/settings').as('setUsername')
      cy.setSessionCookie()

      cy.visit('/testSeedUserId/settings')

      cy.database(`SELECT * FROM "User" LIMIT 1;`).then((users) => {
        const user = users[0]
        cy.wrap(user)
          .its('username')
          .then((username) => {
            cy.findByLabelText('Username').type(username)
          })
      })

      cy.findByRole('button', { name: 'Save' }).click()
      cy.wait('@setUsername')
      cy.findByText('Username already taken').should('be.visible')
    })

    it('blocked username rejected', () => {
      cy.intercept('POST', '/testSeedUserId/settings').as('setUsername')
      cy.setSessionCookie()

      cy.visit('/testSeedUserId/settings')

      cy.findByLabelText('Username').type('1800')
      cy.findByRole('button', { name: 'Save' }).click()
      cy.wait('@setUsername')

      cy.findByText('Not allowed to use as username').should('be.visible')
    })

    it('user can set user profile fields', () => {
      cy.intercept('/api/upload/presigned*').as('presigned')

      cy.intercept('POST', '/testSeedUserId/settings').as('setUsername')
      cy.setSessionCookie()

      cy.visit('/testSeedUserId/settings')
      cy.findByLabelText('Username').type('cypressTester')
      cy.findByLabelText('About').type('cypress tester biography')

      cy.getBySel('email-checkbox').should('be.checked')

      cy.get('input#avatar').selectFile(
        'cypress/fixtures/cypress-test-image.png',
        { force: true },
      )
      cy.findByAltText('Uploaded avatar').should('exist')

      cy.findByRole('button', { name: 'Save' }).click()

      cy.wait('@presigned').then(({ request }) => {
        const url = new URL(request.url)

        expect(url.searchParams.get('filename')).to.eq('cypress-test-image.png')
        expect(url.searchParams.get('fileType')).to.eq('image/png')
        expect(url.searchParams.get('directory')).to.eq('avatar')
      })

      cy.findByLabelText('Username')
        .invoke('val')
        .should('equal', 'cypressTester')
      cy.findByLabelText('About')
        .invoke('val')
        .should('equal', 'cypress tester biography')
      cy.findByText(
        'If you wish to change your username please contact us via the discord server.',
      ).should('exist')

      cy.wait('@setUsername').then(({ response }) => {
        expect(response?.statusCode).to.eq(200)
      })

      cy.database(
        `SELECT * FROM "User" LEFT JOIN "Preference" ON "User".id = "Preference"."userId" WHERE username = 'cypressTester';`,
      ).then((users) => {
        cy.wrap(users[0])
          .should('deep.include', {
            biography: 'cypress tester biography',
            channel: 'email',
            enabled: true,
            username: 'cypressTester',
            usernameURL: 'cypresstester',
          })
          .its('image')
          .should('match', /annostamps\/avatar\/testSeedUserId\/.*\.png$/)
      })

      cy.findByTestId('check-badge-icon').should('exist')

      cy.reload()
      cy.findByLabelText('Username')
        .invoke('val')
        .should('equal', 'cypressTester')
    })

    it('shows an error when avatar upload presign fails', () => {
      cy.intercept('/api/upload/presigned*', {
        body: { error: 'Upload failed' },
        statusCode: 500,
      }).as('presigned')
      cy.intercept('POST', '/testSeedUserId/settings').as('updateUserSettings')
      cy.setSessionCookie()

      cy.visit('/testSeedUserId/settings')
      cy.findByLabelText('Username').type('cypressTester')
      cy.get('input#avatar').selectFile(
        'cypress/fixtures/cypress-test-image.png',
        { force: true },
      )
      cy.findByRole('button', { name: 'Save' }).click()

      cy.wait('@presigned')
      cy.findByText('Upload failed').should('be.visible')
      cy.get('@updateUserSettings.all').should('have.length', 0)
    })
  })

  describe('Existing user', () => {
    beforeEach(() => {
      cy.task('db:testUser', true)
    })
    afterEach(() => {
      cy.task('db:removeTestUser')
    })
    it('user can update profile with username set and remove profile picture', () => {
      cy.intercept('POST', '/testSeedUserId/settings').as('updateUserSettings')
      cy.intercept('/api/auth/get-session').as('getSession')
      cy.setSessionCookie()

      cy.visit('/testSeedUserId/settings')

      cy.wait('@getSession')
      cy.findByLabelText('Username')
        .invoke('val')
        .should('equal', 'testSeedUser')
      cy.findByLabelText('Username').should('have.attr', 'readonly')
      cy.findByLabelText('About')
        .invoke('val')
        .should('equal', 'amazing test user bio')

      cy.findByLabelText('About').clear()
      cy.findByLabelText('About').type('cypress tester biography')
      cy.getBySel('email-checkbox').click()

      cy.findByRole('button', {
        name: 'Remove and use AnnoStamps default image',
      }).click()

      cy.get('input#avatar').should('exist')
      cy.findByRole('button', { name: 'Save' }).click()

      cy.wait('@updateUserSettings')

      cy.findByLabelText('About')
        .invoke('val')
        .should('equal', 'cypress tester biography')

      cy.getBySel('email-checkbox').should('not.be.checked')

      cy.database(
        `SELECT * FROM "User" LEFT JOIN "Preference" ON "User".id = "Preference"."userId" WHERE username = 'testSeedUser';`,
      ).then((users) => {
        cy.wrap(users[0]).should('deep.include', {
          biography: 'cypress tester biography',
          enabled: false,
          image: null,
        })
      })
    })
  })
})
