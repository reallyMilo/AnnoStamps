/// <reference types="cypress" />
/* eslint-disable @typescript-eslint/no-explicit-any */
declare namespace Cypress {
  interface Chainable {
    database(rawQuery: string, log?: boolean): Chainable<any>
    getBySel(
      dataTestAttribute: string,
      args?: any
    ): Chainable<JQuery<HTMLElement>>
    setSessionCookie()
  }
}
