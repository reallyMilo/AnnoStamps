import '@testing-library/cypress/add-commands'

Cypress.Commands.add('getBySel', (selector, ...args) => {
  return cy.get(`[data-testid=${selector}]`, ...args)
})

Cypress.Commands.add('usernameSession', (route: string) => {
  cy.intercept('/api/auth/session', { fixture: 'usernameSession.json' }).as(
    'usernameSession'
  )
  cy.setCookie('authjs.session-token', Cypress.env('sessionToken'))
  cy.visit(route)
  cy.wait('@usernameSession')
})

Cypress.Commands.add('newUserSession', (route: string) => {
  cy.intercept('/api/auth/session', { fixture: 'newUserSession.json' }).as(
    'newUserSession'
  )
  cy.setCookie('authjs.session-token', Cypress.env('sessionToken'))
  cy.visit(route)
  cy.wait('@newUserSession')
})

Cypress.Commands.add('database', (rawQuery, logTask = false) => {
  const log = Cypress.log({
    name: 'database',
    displayName: 'DATABASE',
    message: [`🔎 ${rawQuery}`],
    autoEnd: false,
  })

  return cy.task(`db:query`, rawQuery, { log: logTask }).then((data) => {
    log.snapshot()
    log.end()
    return data
  })
})
