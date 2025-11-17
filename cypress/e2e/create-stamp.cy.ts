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
      cy.get('#category').select('general')
      cy.get('#category').should('have.value', 'general')
      cy.get('#region').select('arctic')
      cy.get('#region').should('have.value', 'arctic')
      cy.get('#modded').select('No')
      cy.get('#modded').should('have.value', 'false')
      cy.get('#title').type('cypress test title')
      cy.get('#title').should('have.value', 'cypress test title')
      cy.get('#description').type('cypress test description')
      cy.get('#description').should('have.value', 'cypress test description')

      cy.findByText('Submit Stamp').click()
      cy.findByText('Please add images').should('exist')

      cy.findByLabelText('Add Images').selectFile(
        'cypress/fixtures/cypress-test-image.png',
        {
          force: true,
        },
      )
      cy.findByAltText('stamp image preview').should('exist')

      cy.get('#category').select('general')
      cy.get('#category').should('have.value', 'general')
      cy.get('#region').select('arctic')
      cy.get('#region').should('have.value', 'arctic')
      cy.get('#modded').select('No')
      cy.get('#modded').should('have.value', 'false')
      cy.get('#title').type('cypress test title')
      cy.get('#title').should('have.value', 'cypress test title')
      cy.get('#description').type('cypress test description')
      cy.get('#description').should('have.value', 'cypress test description')

      cy.findByText('Submit Stamp').click()

      cy.findByText('Please add stamps').should('exist')

      cy.findByText('Add Stamps').selectFile('cypress/fixtures/test-stamp', {
        force: true,
      })
      cy.findByText('test-stamp').should('exist')
    })

    it('user can create a stamp with all fields filled', () => {
      cy.intercept('/1800/stamp/create').as('createStamp')

      cy.intercept('/api/upload/presigned?stampId=*').as('presigned')

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

      cy.get('#category').select('general')
      cy.get('#category').should('have.value', 'general')
      cy.get('#region').select('arctic')
      cy.get('#region').should('have.value', 'arctic')
      cy.get('#modded').select('No')
      cy.get('#modded').should('have.value', 'false')
      cy.get('#title').type('cypress test title')
      cy.get('#title').should('have.value', 'cypress test title')
      cy.get('#description').type('# H1 Heading')
      cy.get('#description').should('have.value', '# H1 Heading')

      cy.findByText('Submit Stamp').click()
      cy.findByText('Creating Stamp...').should('be.visible')

      cy.wait('@presigned').then(({ request }) => {
        const url = new URL(request.url)

        expect(url.searchParams.get('stampId')).to.have.length(24)
        expect(url.searchParams.get('filename')).to.eq('cypress-test-image.png')
        expect(url.searchParams.get('fileType')).to.eq('image/png')
        expect(url.searchParams.get('directory')).to.eq('images')
      })
      cy.wait('@presigned').then(({ request }) => {
        const url = new URL(request.url)

        expect(url.searchParams.get('stampId')).to.have.length(24)
        expect(url.searchParams.get('filename')).to.eq('cypress test title')
        expect(url.searchParams.get('fileType')).to.eq('zip')
        expect(url.searchParams.get('directory')).to.eq('stamps')
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
