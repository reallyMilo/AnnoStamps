/*eslint @eslint-community/eslint-comments/disable-enable-pair: [error, {allowWholeFile: true}] */
/* eslint-disable cypress/unsafe-to-chain-command */
//FIXME: unsafe chain
describe('Comment on stamp', () => {
  it('unauthorized user click on comment form redirects to sign in with callback to stamp', () => {
    cy.intercept('/api/auth/session')
    cy.visit('/')
    cy.getBySel('stamp-card-link')
      .last()
      .then((link) => {
        cy.visit(link.attr('href'))
        cy.findByLabelText('Comment')
          .click()
          .then(() => {
            cy.url().should('include', `callbackUrl=${link.attr('href')}`)
          })
      })
  })
  describe('authorized user without username set', () => {
    beforeEach(() => {
      cy.task('db:testUser')
      cy.setSessionCookie()
      cy.visit('/')
    })
    afterEach(() => {
      cy.task('db:removeTestUser')
    })

    it('authorized user without username set has comment form redirecting to settings page', () => {
      cy.getBySel('stamp-card-link')
        .last()
        .then((link) => {
          cy.visit(link.attr('href'))
          cy.findByLabelText('Comment')
            .click()
            .then(() => {
              cy.url().should('include', `/testSeedUserId/settings`)
            })
        })
    })
  })

  describe('authorized user with username set', () => {
    beforeEach(() => {
      cy.task('db:testUser', true)
      cy.setSessionCookie()
      cy.visit('/stamp/testSeed1800StampId')
      cy.intercept('/stamp/testSeed1800StampId').as('addComment')
    })
    afterEach(() => {
      cy.task('db:removeTestUser')
    })

    it('can leave a comment on a stamp', () => {
      cy.findByLabelText('Comment').type('Great stamp!')
      cy.findByRole('button', { name: 'Comment' }).click()
      cy.wait('@addComment')
      cy.findByText('Great stamp!').should('exist')
      cy.database(
        `SELECT * FROM "Comment" WHERE "userId"='testSeedUserId';`,
      ).then((comments) => {
        cy.wrap(comments[0]).should('be.an', 'object').and('contain', {
          content: 'Great stamp!',
          parentId: null,
          stampId: 'testSeed1800StampId',
          userId: 'testSeedUserId',
        })
      })
      cy.database(
        `SELECT * FROM "Notification" WHERE "userId"='testSeedUserId';`,
      ).then((notifications) => {
        cy.wrap(notifications[1])
          .should('be.an', 'object')
          .and('contain', {
            channel: 'web',
            targetUrl: '/stamp/testSeed1800StampId',
          })
          .wrap(notifications[1].body)
          .should('contain', {
            authorOfContent: 'testSeedUser',
            authorOfContentURL: 'testseeduser',
            content: 'Great stamp!',
          })
      })
    })

    it('can reply to another comment and then reply to that reply', () => {
      cy.findAllByRole('button', { name: 'Reply' })
        .last()
        .click()
        .then(() => {
          cy.findAllByLabelText('Comment')
            .last()
            .type('Thanks for your comment!')
          cy.getBySel('comment-submit-button').click()
        })

      cy.wait('@addComment')
      cy.findByText('Thanks for your comment!').should('not.exist')
      cy.findByRole('button', { name: '1 Reply' })
        .click()
        .then(() => {
          cy.findByText('Thanks for your comment!').should('exist')
          cy.getBySel('reply-list').find('li').should('have.length', 1)
        })

      cy.database(
        `SELECT * FROM "Comment" WHERE "userId"='testSeedUserId' AND "parentId"='cypressComment';`,
      ).then((comments) => {
        cy.wrap(comments[0]).should('be.an', 'object').and('contain', {
          content: 'Thanks for your comment!',
          stampId: 'testSeed1800StampId',
        })
      })
      cy.database(
        `SELECT * FROM "Notification" WHERE "userId"='replySeedUserId';`,
      ).then((notifications) => {
        cy.wrap(notifications[0])
          .should('be.an', 'object')
          .and('contain', {
            channel: 'web',
            targetUrl: '/stamp/testSeed1800StampId',
          })
          .wrap(notifications[0].body)
          .should('contain', {
            authorOfContent: 'testSeedUser',
            authorOfContentURL: 'testseeduser',
            content: 'Thanks for your comment!',
          })
      })

      cy.findAllByRole('button', { name: 'Reply' })
        .last()
        .click()
        .then(() => {
          cy.findAllByLabelText('Comment')
            .last()
            .type('Nested reply to reply comment')
          cy.findAllByTestId('comment-submit-button').last().click()
        })

      cy.findByRole('link', { name: '@testSeedUser' }).should('exist')
      cy.findByText('Nested reply to reply comment').should('exist')
    })
  })
})
