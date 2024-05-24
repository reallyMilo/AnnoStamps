describe('Updating Stamp', () => {
  beforeEach(() => {
    cy.task('db:testUser', true)
  })
  afterEach(() => {
    cy.task('db:removeTestUser')
  })
  it('unauthorized user redirected to signin page', () => {
    cy.visit('/stamp/update/clll7fyxp002sem82uejwfey5')
    cy.url().should('include', '/auth/signin')
  })
  it('user trying to edit another stamp is denied', () => {
    cy.usernameSession('/stamps')
    cy.getBySel('stamp-card-link')
      .first()
      .invoke('attr', 'href')
      .should('be.a', 'string')
      .invoke('split', '/')
      .its(2)
      .then((id) => {
        cy.visit(`/stamp/update/${id}`)
        cy.findByText('not your stamp').should('be.visible')
        cy.findByRole('button', { name: 'Update Stamp' }).should('not.exist')
      })
  })

  it('displays alert to set username with link if username not set', () => {
    cy.newUserSession('/stamp/update/clll7fyxp002sem82uejwfey5')
    cy.findByRole('link', { name: 'Please set your username.' }).should(
      'have.attr',
      'href',
      '/testSeedUserId/settings'
    )
    cy.findByLabelText('Add Images').should('not.exist')
  })
  it('all fields populated with default values', () => {
    cy.intercept('GET', '/api/user', {
      fixture: 'userStamps.json',
    }).as('getUser')
    cy.intercept('GET', '/api/get-stamp', {
      fixture: 'test-stamp.zip',
    }).as('getStampZip')
    cy.usernameSession('/stamp/update/clll7fyxp002sem82uejwfey5')

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
    cy.intercept('PUT', '/stamp/update/presigned*', {
      statusCode: 200,
      body: '/stamp.zip',
    }).as('S3Put')
    //FIXME: Need to revalidate the path for [username]
    cy.usernameSession('/stamp/update/testSeedUserStampId')

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
    cy.findByRole('heading', { name: 'Test-Seed-User-Stamp-Updated' })
  })
})
