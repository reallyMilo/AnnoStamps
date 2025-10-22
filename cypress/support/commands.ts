import '@testing-library/cypress/add-commands'

Cypress.Commands.add('getBySel', (selector, ...args) => {
  return cy.get(`[data-testid=${selector}]`, ...args)
})

Cypress.Commands.add('setSessionCookie', () => {
  cy.task('signedCookie').then((cookie) =>
    cy.setCookie('better-auth.session_token', cookie as string),
  )
})

Cypress.Commands.add('database', (rawQuery, logTask = false) => {
  const log = Cypress.log({
    autoEnd: false,
    displayName: 'DATABASE',
    message: [`🔎 ${rawQuery}`],
    name: 'database',
  })

  return cy.task(`db:query`, rawQuery, { log: logTask }).then((data) => {
    log.snapshot()
    log.end()
    return data
  })
})
//FIXME: NEXT_REDIRECT issue with cypress
Cypress.on('uncaught:exception', (err) => {
  if (err.message.includes('NEXT_REDIRECT')) {
    return false
  }
})
