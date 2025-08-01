describe('Stamp creation', () => {
  afterEach(() => {
    cy.task('db:removeTestUser')
  })
  describe('new user without set username', () => {
    beforeEach(() => {
      cy.task('db:testUser')
      cy.setSessionCookie()
      cy.visit('/stamp/create')
    })

    it('displays alert to set username with link if username not set', () => {
      cy.findByRole('link', { name: 'Please set your username.' }).should(
        'have.attr',
        'href',
        '/testSeedUserId/settings',
      )
      cy.findByLabelText('Add Images').should('not.exist')
    })
  })

  describe('user with username set', () => {
    beforeEach(() => {
      cy.task('db:testUser', true)
      cy.setSessionCookie()
      cy.visit('/1800/stamp/create')
    })

    it('user cannot submit a stamp without all fields being filled', () => {
      cy.findByText('Submit Stamp').click()

      cy.getBySel('stamp-form').within(() => {
        cy.get('input:invalid').should('have.length', 1)
      })
      cy.get('#category').select('general').should('have.value', 'general')
      cy.get('#region').select('arctic').should('have.value', 'arctic')
      cy.get('#modded').select('No').should('have.value', 'false')
      cy.get('#title')
        .type('cypress test title')
        .should('have.value', 'cypress test title')
      cy.get('#description')
        .type('cypress test description')
        .should('have.value', 'cypress test description')

      cy.findByText('Submit Stamp').click()
      cy.findByText('Please add images').should('exist')

      cy.findByLabelText('Add Images').selectFile(
        'cypress/fixtures/cypress-test-image.png',
        {
          force: true,
        },
      )
      cy.findByAltText('stamp image preview').should('exist')

      cy.get('#category').select('general').should('have.value', 'general')
      cy.get('#region').select('arctic').should('have.value', 'arctic')
      cy.get('#modded').select('No').should('have.value', 'false')
      cy.get('#title')
        .type('cypress test title')
        .should('have.value', 'cypress test title')
      cy.get('#description')
        .type('cypress test description')
        .should('have.value', 'cypress test description')

      cy.findByText('Submit Stamp').click()

      cy.findByText('Please add stamps').should('exist')

      cy.findByText('Add Stamps').selectFile('cypress/fixtures/test-stamp', {
        force: true,
      })
      cy.findByText('test-stamp').should('exist')
    })

    it('user can create a stamp with all fields filled', () => {
      cy.intercept('/1800/stamp/create').as('createStamp')
      // since 2 calls are made to upload 1 image, and 1 zip
      // we set the zip call to an api-route to catch for updating
      cy.intercept('/api/upload/*', (req) => {
        const fileType = req.url
          .split('&')
          .find((param) => param.includes('fileType='))
          .split('=')[1]
        req.continue((res) => {
          if (fileType === 'zip') {
            res.send(200, {
              ok: true,
              path: '/stamp.zip',
              url: 'presigned?fileType=zip',
            })
          } else {
            res.send(200, {
              ok: true,
              path: 'anno-stamps-logo.png',
              url: 'presigned?fileType=img',
            })
          }
        })
      }).as('uploadAsset')

      cy.intercept('PUT', '/1800/stamp/presigned*', (req) => {
        const fileType = req.url
          .split('&')
          .find((param) => param.includes('fileType='))
          .split('=')[1]
        req.continue((res) => {
          if (fileType === 'zip') {
            res.send(200, { ok: true, path: '/stamp.zip' })
          } else {
            res.send(200, { ok: true, path: 'anno-stamps-logo.png' })
          }
        })
      }).as('S3Put')

      cy.findByLabelText('Add Images').selectFile(
        'cypress/fixtures/cypress-test-image.png',
        {
          force: true,
        },
      )
      cy.findByAltText('stamp image preview').should('exist')

      cy.findByText('Add Stamps').selectFile('cypress/fixtures/test-stamp', {
        force: true,
      })
      cy.findByText('test-stamp').should('exist')

      cy.get('#category').select('general').should('have.value', 'general')
      cy.get('#region').select('arctic').should('have.value', 'arctic')
      cy.get('#modded').select('No').should('have.value', 'false')
      cy.get('#title')
        .type('cypress test title')
        .should('have.value', 'cypress test title')
      cy.get('#description')
        .type('# H1 Heading')
        .should('have.value', '# H1 Heading')

      cy.findByText('Submit Stamp').click()
      cy.findByText('Creating Stamp...').should('be.visible')

      // should have two api calls, because 1 image and 1 stamp file
      cy.wait('@uploadAsset').then((interception) => {
        assert.isNotNull(interception.response.body, '1st Presigned Url')
      })

      cy.wait('@uploadAsset').then((interception) => {
        assert.isNotNull(interception.response.body, '2nd Presigned Url')
      })
      cy.wait('@S3Put').then((interception) => {
        assert.isNotNull(interception.response.body, '1st S3 Put')
      })
      cy.wait('@S3Put').then((interception) => {
        assert.isNotNull(interception.response.body, '2nd S3 Put')
      })
      cy.wait('@createStamp').its('response.statusCode').should('eq', 303)

      cy.database(
        `SELECT * FROM "Stamp" WHERE title = 'cypress test title';`,
      ).then((stamps) => {
        const stamp = stamps[0]
        cy.wrap(stamp)
          .should('be.an', 'object')
          .and('have.keys', [
            'id',
            'userId',
            'category',
            'region',
            'modded',
            'capital',
            'title',
            'unsafeDescription',
            'markdownDescription',
            'stampFileUrl',
            'downloads',
            'game',
            'good',
            'createdAt',
            'updatedAt',
            'changedAt',
          ])
          .and('contain', {
            category: 'general',
            game: '1800',
            markdownDescription: '<h1>H1 Heading</h1>\n',
            modded: false,
            region: 'arctic',
            unsafeDescription: '# H1 Heading',
            userId: 'testSeedUserId',
          })
      })

      cy.url().should('include', `testseeduser`)

      cy.findByText('cypress test title').should('be.visible')
      cy.getBySel('stamp-card-link')
        .last()
        .invoke('attr', 'href')
        .should('be.a', 'string')
        .invoke('split', '/')
        .its(2)
        .should('have.length', 24)
    })
  })
})
