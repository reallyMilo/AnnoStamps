describe('Stamp liking', () => {
  beforeEach(() => {
    cy.task('db:testUser')
  })
  afterEach(() => {
    cy.task('db:removeTestUser')
  })

  it('unauthorized user redirected to sign in with callback to stamp', () => {
    cy.intercept('/api/auth/session')
    cy.visit('/')
    cy.getBySel('stamp-card-link')
      .last()
      .click()
      .then((link) => {
        cy.url().should('include', `${link.attr('href')}`)
        cy.getBySel('like-stamp')
          .click()
          .then(() => {
            cy.url().should('include', `callbackUrl=${link.attr('href')}`)
          })
      })
  })

  it('user can like stamp', () => {
    cy.intercept('/stamp/*').as('likeStamp')
    cy.visit('/stamps')
    cy.setSessionCookie()
    cy.getBySel('stamp-card-link').first().click()

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

        cy.getBySel('like-stamp')
          .find('svg')
          .should('have.css', 'color', 'rgb(109, 211, 192)')
        cy.getBySel('like-stamp')
          .invoke('text')
          .then(Number)
          .should('eq', initialLikesCount + 1)
      })

    cy.database(
      `SELECT * FROM "User" INNER JOIN "_StampLiker" ON "User".id = "_StampLiker"."B" WHERE id = 'testSeedUserId';`,
    ).then((users) => {
      cy.wrap(users).should('have.length', 1)
    })
  })
})
