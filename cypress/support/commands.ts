import '@testing-library/cypress/add-commands'

Cypress.Commands.add('getBySel', (selector, ...args) => {
  return cy.get(`[data-testid=${selector}]`, ...args)
})

Cypress.Commands.add('userSession', () => {
  cy.intercept('/api/auth/session', { fixture: 'session.json' }).as('session')
  cy.setCookie('next-auth.session-token', Cypress.env('sessionToken'))
})
