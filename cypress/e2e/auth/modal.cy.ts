describe('Auth Modal', () => {
  beforeEach(() => {
    cy.visit('/')
    cy.getBySel('login-button').click()
  })
  it('has anno stamp logo', () => {
    cy.getBySel('anno-stamp-logo').should('be.visible')
  })
  it('greets with welcome', () => {
    cy.get('h3').contains('Welcome!')
  })

  it('google icon with alt text', () => {
    cy.getBySel('google-icon')
      .should('have.attr', 'alt')
      .should('equal', 'google sign in')
  })
  it('google sign-in redirects', () => {
    //cy.getBySel('google-sign-in').click()
  })

  it('discord icon with alt text', () => {
    cy.getBySel('discord-icon')
      .should('have.attr', 'alt')
      .should('equal', 'discord sign in')
  })
  it('discord sign-in redirects', () => {
    //cy.getBySel('discord-sign-in').click()
  })
})
