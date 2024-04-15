describe('Stamp creation', () => {
  beforeEach(() => {
    cy.task('db:testUser', true)
  })
  afterEach(() => {
    cy.task('db:removeTestUser')
  })

  it('displays alert to set username with link if username not set', () => {
    cy.newUserSession('/user/create')

    cy.findByRole('link', { name: 'Please set your username.' }).should(
      'have.attr',
      'href',
      '/user/account'
    )
    cy.findByLabelText('Add Images').should('not.exist')
  })

  it('user cannot submit a stamp without all fields being filled', () => {
    cy.usernameSession('/user/create')
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
      }
    )
    cy.findByAltText('stamp image preview').should('exist')
    cy.findByText('Submit Stamp').click()

    cy.findByText('Please add stamps').should('exist')

    cy.findByText('Add Stamps').selectFile('cypress/fixtures/test-stamp', {
      force: true,
    })
    cy.findByText('test-stamp').should('exist')
  })

  it('user can create a stamp with all fields filled', () => {
    cy.intercept('/api/stamp/create').as('createStamp')
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
            url: 'presigned?fileType=zip',
            path: '/stamp.zip',
          })
        } else {
          res.send(200, {
            ok: true,
            url: 'presigned?fileType=img',
            path: 'anno-stamps-logo.png',
          })
        }
      })
    }).as('uploadAsset')

    cy.intercept('PUT', '/user/presigned*', (req) => {
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

    cy.usernameSession('/user/create')

    cy.findByLabelText('Add Images').selectFile(
      'cypress/fixtures/cypress-test-image.png',
      {
        force: true,
      }
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
      .type('cypress test description')
      .should('have.value', 'cypress test description')

    cy.findByText('Submit Stamp').click()

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
    cy.wait('@createStamp').its('response.statusCode').should('eq', 200)

    cy.database(
      `SELECT * FROM "Stamp" WHERE title = 'cypress test title';`
    ).then((stamps) => {
      const stamp = stamps[0]
      cy.wrap(stamp).its('userId').should('eq', 'testSeedUserId')
    })
    // redirect after successful stamp creation
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
