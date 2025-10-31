describe('User onboarding', () => {
  describe('unauthenticated user', () => {
    it('unauthenticated user gets redirect to sign in', () => {
      cy.request({
        followRedirect: false,
        url: '/auth/new-user',
      }).then((response) => {
        expect(response.status).to.eq(307)
        expect(response.redirectedToUrl).to.include('/auth/signin')
      })
    })
  })
  describe('authenticated user', () => {
    beforeEach(() => {
      cy.task('db:testUser')
      cy.setSessionCookie()
    })
    it('user redirected to his settings page', () => {
      cy.visit('/auth/new-user')
      cy.url().should('include', 'testSeedUserId/settings')
    })
    afterEach(() => {
      cy.task('db:removeTestUser')
    })
  })
})
