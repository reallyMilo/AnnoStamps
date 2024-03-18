import '@testing-library/cypress/add-commands'

Cypress.Commands.add('getBySel', (selector, ...args) => {
  return cy.get(`[data-testid=${selector}]`, ...args)
})

Cypress.Commands.add('usernameSession', (route: string) => {
  cy.intercept('/api/auth/session', { fixture: 'usernameSession.json' }).as(
    'usernameSession'
  )
  cy.setCookie('next-auth.session-token', Cypress.env('sessionToken'))
  cy.visit(route)
  cy.wait('@usernameSession')
})

Cypress.Commands.add('newUserSession', (route: string) => {
  cy.intercept('/api/auth/session', { fixture: 'newUserSession.json' }).as(
    'newUserSession'
  )
  cy.setCookie('next-auth.session-token', Cypress.env('sessionToken'))
  cy.visit(route)
  cy.wait('@newUserSession')
})
