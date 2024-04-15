describe('Updating Stamp', () => {
  beforeEach(() => {
    cy.task('db:testUser', true)
  })
  afterEach(() => {
    cy.task('db:removeTestUser')
  })

  it('all fields populated with default values', () => {
    cy.intercept('GET', '/api/user', {
      fixture: 'userStamps.json',
    }).as('getUser')
    cy.intercept('GET', '/api/get-stamp', {
      fixture: 'test-stamp.zip',
    }).as('getStampZip')
    cy.usernameSession('/user/clll7fyxp002sem82uejwfey5')

    cy.wait(['@getUser', '@getStampZip'])

    cy.findByText('test-stamp-zip').should('exist')
    cy.get('#category').should('have.value', 'production')
    cy.get('#region').should('have.value', 'old world')
    cy.get('#modded').should('have.value', 'false')
    cy.get('#good').should('have.value', 'indigo dye')
    cy.get('#title').should(
      'have.value',
      'Stamp-Agricultural Products-Indigo Dye-0'
    )
    cy.get('#description').should(
      'have.value',
      'Stamp-Agricultural Products-Indigo Dye-0'
    )
  })

  it('user can click the edit stamp link and update the stamp', () => {
    cy.intercept('/api/stamp/update/*').as('updateStamp')

    cy.intercept('GET', '/stamp.zip', {
      fixture: 'test-stamp.zip',
    }).as('getStampZip')

    cy.intercept('/api/upload/*', {
      statusCode: 200,
      body: {
        ok: true,
        url: 'presigned?fileType=zip',
        path: '/stamp.zip',
      },
    }).as('uploadAsset')
    cy.intercept('PUT', '/user/presigned*', {
      statusCode: 200,
      body: '/stamp.zip',
    }).as('S3Put')

    cy.usernameSession('/testseeduser')

    cy.findByRole('heading', { name: 'Test-Seed-User-Stamp' }).should(
      'be.visible'
    )

    cy.findByRole('link', { name: 'Edit Stamp' }).click()
    cy.wait('@getStampZip')
    cy.findByText('Edit your stamp').should('be.visible')

    cy.findByText('test-stamp-zip').should('exist')
    cy.get('#category').should('have.value', 'cosmetic')
    cy.get('#region').should('have.value', 'old world')
    cy.get('#modded').should('have.value', 'false')
    cy.get('#title').should('have.value', 'Test-Seed-User-Stamp')
    cy.get('#description').should('have.value', 'Test seed user stamp')

    cy.get('#title')
      .type('-Updated')
      .should('have.value', 'Test-Seed-User-Stamp-Updated')

    cy.findByRole('button', { name: 'Update Stamp' }).click()
    cy.wait(['@uploadAsset', '@S3Put'])
    cy.wait('@updateStamp').its('response.statusCode').should('eq', 200)

    cy.database(
      `SELECT * FROM "Stamp" WHERE title = 'Test-Seed-User-Stamp-Updated';`
    ).then((stamps) => {
      const stamp = stamps[0]
      cy.wrap(stamp).its('userId').should('eq', 'testSeedUserId')
    })
    cy.url().should('include', '/testseeduser')
    cy.reload(true) // reload without cache
    cy.findByRole('heading', { name: 'Test-Seed-User-Stamp-Updated' })
  })
})
