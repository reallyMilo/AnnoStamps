/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable {
    database(
      rawQuery: string,
      log?: boolean,
    ): Chainable<Record<string, unknown>[]>;
    getBySel(
      dataTestAttribute: string,
      options?: Partial<Loggable & Timeoutable & Withinable & Shadow>,
    ): Chainable<JQuery<HTMLElement>>;
    setSessionCookie();
  }
}
