describe('Updating Stamp', () => {
  beforeEach(() => {
    cy.task('db:testUser')
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
    cy.intercept('/api/stamp/update', (req) => {
      req.headers[
        'cookie'
      ] = `next-auth.csrf-token=dfbc1c2ed29dd90157662042a479720a4bf4c394f954bdd2e01a372aa42c9f1b%7C426823b50e26ac90384ba7a800b10b79c4d19202dd2a5e1f80739d2c7594db44; next-auth.session-token=cdc4b0fb-77b5-44b5-947a-dde785af2676;`
    }).as('updateStamp')

    cy.intercept('GET', '/stamp.zip', {
      fixture: 'test-stamp.zip',
    }).as('getStampZip')

    cy.intercept('GET', '/api/user', (req) => {
      req.headers[
        'cookie'
      ] = `next-auth.csrf-token=dfbc1c2ed29dd90157662042a479720a4bf4c394f954bdd2e01a372aa42c9f1b%7C426823b50e26ac90384ba7a800b10b79c4d19202dd2a5e1f80739d2c7594db44; next-auth.session-token=cdc4b0fb-77b5-44b5-947a-dde785af2676;`
    }).as('getUserStamps')
    cy.usernameSession('/user/stamps')

    cy.wait('@getUserStamps')
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
    cy.wait('@updateStamp').its('response.statusCode').should('eq', 200)

    cy.database(
      `SELECT * FROM "Stamp" WHERE title = 'Test-Seed-User-Stamp-Updated';`
    ).then((stamps) => {
      const stamp = stamps[0]
      cy.wrap(stamp).its('userId').should('eq', 'testSeedUserId')
    })
    cy.url().should('include', '/user/stamps')
    cy.reload(true) // reload without cache
    cy.findByRole('heading', { name: 'Test-Seed-User-Stamp-Updated' })
  })
})
