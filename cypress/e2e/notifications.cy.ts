describe('Notifications', () => {
  beforeEach(() => {
    cy.task('db:testUser', true)
    cy.setSessionCookie()
    cy.visit('/')
    cy.intercept('/').as('readAll')
  })
  afterEach(() => {
    cy.task('db:removeTestUser')
  })

  it('displays notification bell with red unread alert, allowing user to view and mark all notifications as read', () => {
    cy.getBySel('notification-dropdown-alert-indicator').should('exist')
    cy.findByLabelText('Open notifications')
      .click()
      .then(() => {
        cy.findByText('great stamp!').should('be.visible')

        cy.getBySel('read-all-notifications-button')
          .click()
          .then(() => {
            cy.wait('@readAll')

            cy.database(
              `SELECT * FROM "Notification" WHERE "userId"='testSeedUserId';`,
            ).then((notifications) => {
              cy.wrap(notifications).each((notification) => {
                cy.wrap(notification).should('contain', {
                  isRead: true,
                })
              })
            })
          })
      })
  })
})
