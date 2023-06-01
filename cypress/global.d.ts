/// <reference types="cypress" />
declare namespace Cypress {
  interface Chainable {
    loginToDiscord(username: string, password: string): Chainable<any>
  }
}
