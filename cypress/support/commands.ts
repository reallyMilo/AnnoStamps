import '@testing-library/cypress/add-commands'

Cypress.Commands.add('getBySel', (selector, ...args) => {
  return cy.get(`[data-testid=${selector}]`, ...args)
})

Cypress.Commands.add('setSessionCookie', () => {
  cy.setCookie('authjs.session-token', Cypress.env('sessionToken'))
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
