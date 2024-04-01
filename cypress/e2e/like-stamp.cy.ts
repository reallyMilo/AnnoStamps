describe('Stamp liking', () => {
  beforeEach(() => {
    cy.task('db:testUser')
  })
  afterEach(() => {
    cy.task('db:removeTestUser')
  })

  it('unauthorized user redirected to sign in with callback to stamp', () => {
    cy.intercept('/api/auth/session', [])
    cy.visit('/')
    cy.getBySel('stamp-card-link')
      .last()
      .then((link) => {
        cy.visit(link.attr('href'))
        cy.getBySel('like-stamp').click()
        cy.url().should(
          'include',
          `callbackUrl=${encodeURIComponent(link.attr('href'))}`
        )
      })
  })

  it('user can like stamp', () => {
    cy.intercept('/api/stamp/like/*', (req) => {
      req.headers[
        'cookie'
      ] = `next-auth.csrf-token=dfbc1c2ed29dd90157662042a479720a4bf4c394f954bdd2e01a372aa42c9f1b%7C426823b50e26ac90384ba7a800b10b79c4d19202dd2a5e1f80739d2c7594db44; next-auth.session-token=cdc4b0fb-77b5-44b5-947a-dde785af2676;`
    }).as('likeStamp')
    cy.newUserSession('/')
    cy.getBySel('stamp-card-link').last().click()

    cy.getBySel('like-stamp')
      .invoke('text')
      .then(Number)
      .then((initialLikesCount) => {
        cy.log(String(initialLikesCount))

        cy.getBySel('like-stamp')
          .trigger('mouseover')
          .then(($link) => {
            expect($link.css('cursor')).to.equal('pointer')
          })
          .click()
        cy.wait('@likeStamp')

        cy.database(
          `SELECT * FROM "User" INNER JOIN "_StampLiker" ON "User".id = "_StampLiker"."B" WHERE id = 'testSeedUserId';`
        ).then((users) => {
          cy.wrap(users).should('have.length', 1)
        })

        cy.getBySel('like-icon').should(
          'have.css',
          'color',
          'rgb(109, 211, 192)'
        )
        cy.getBySel('like-stamp')
          .invoke('text')
          .then(Number)
          .should('eq', initialLikesCount + 1)
      })
  })
})
