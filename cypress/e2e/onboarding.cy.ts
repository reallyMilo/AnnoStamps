describe('User onboarding', () => {
  it('unauthenticated user gets redirect to sign in', () => {
    cy.request({
      followRedirect: false,
      url: '/auth/new-user',
    }).then((response) => {
      expect(response.status).to.eq(307)
      expect(response.redirectedToUrl).to.include('/auth/sign-in')
    })
  })
  it('authenticated user gets redirect to his settings page', () => {
    cy.task('db:testUser')
    cy.setSessionCookie()
    cy.visit('/auth/new-user')

    cy.url().should('include', 'testSeedUserId/settings')

    cy.task('db:removeTestUser')
  })
})
