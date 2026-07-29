/// <reference types="cypress" />

declare namespace Cypress {
	interface Chainable {
		database(
			rawQuery: string,
			log?: boolean,
		): Chainable<Record<string, unknown>[]>;
		getBySel(
			dataTestAttribute: string,
			args?: any,
		): Chainable<JQuery<HTMLElement>>;
		setSessionCookie();
	}
}
