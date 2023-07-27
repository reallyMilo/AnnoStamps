describe('Footer', () => {
  beforeEach(() => {
    cy.visit('/')
  })
  it('link to the github repo', () => {
    cy.getBySel('github').should(
      'have.attr',
      'href',
      'https://github.com/reallyMilo/AnnoStamps'
    )
  })
  it('link to discord server', () => {
    cy.getBySel('discord').should(
      'have.attr',
      'href',
      'https://discord.gg/73hfP54qXe'
    )
  })
})
