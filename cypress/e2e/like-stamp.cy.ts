/*eslint @eslint-community/eslint-comments/disable-enable-pair: [error, {allowWholeFile: true}] */
/* eslint-disable cypress/unsafe-to-chain-command */
//FIXME: unsafe chain
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
    cy.setSessionCookie()
    cy.intercept('/api/auth/get-session').as('clientSession')
    cy.intercept('/api/user/testSeedUserId/likes').as('userLikes')
    cy.visit('/stamp/testSeed1800StampId')
    cy.wait('@clientSession')
    cy.wait('@userLikes')

    cy.getBySel('like-stamp')
      .invoke('text')
      .then((likesText) => Number.parseInt(likesText.trim(), 10))
      .then((initialLikesCount) => {
        cy.log(String(initialLikesCount))
        expect(initialLikesCount).to.be.a('number').and.not.NaN

        cy.getBySel('like-stamp').should('be.visible').click()
        cy.getBySel('like-stamp').should(($button) => {
          const likes = Number.parseInt($button.text().trim(), 10)
          expect(likes).to.eq(initialLikesCount + 1)
        })
      })

    cy.database(
      `SELECT * FROM "_StampLiker" WHERE "A"='testSeed1800StampId' AND "B"='testSeedUserId';`,
    ).then((stampLikes) => {
      cy.wrap(stampLikes).should('have.length', 1)
    })
  })
})
