describe('Stamp liking', () => {
	beforeEach(() => {
		cy.task('db:testUser');
	});
	afterEach(() => {
		cy.task('db:removeTestUser');
	});

	it('unauthorized user redirected to sign in with callback to stamp', () => {
		cy.intercept('/api/auth/get-session');
		cy.visit('/stamp/testSeed1800StampId');
		cy.getBySel('like-stamp').click();

		cy.url().should('include', `callbackUrl=/stamp/testSeed1800StampId`);
	});

	it('user can like stamp', () => {
		cy.setSessionCookie();
		cy.intercept('/api/auth/get-session').as('clientSession');
		cy.intercept('/api/user/testSeedUserId/likes').as('userLikes');
		cy.visit('/stamp/testSeed1800StampId');
		cy.wait('@clientSession');
		cy.wait('@userLikes');

		cy.getBySel('like-stamp')
			.invoke('text')
			.then((likesText) => Number.parseInt(likesText.trim(), 10))
			.then((initialLikesCount) => {
				cy.log(String(initialLikesCount));

				cy.getBySel('like-stamp').should('be.visible').click();
				cy.getBySel('like-stamp').should(($button) => {
					const likes = Number.parseInt($button.text().trim(), 10);
					expect(likes).to.eq(initialLikesCount + 1);
				});
			});

		cy.database(
			`SELECT * FROM "_StampLiker" WHERE "A"='testSeed1800StampId' AND "B"='testSeedUserId';`,
		).then((stampLikes) => {
			cy.wrap(stampLikes).should('have.length', 1);
		});
	});
});
