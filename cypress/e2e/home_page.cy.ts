describe('Home Page', () => {
  it('should render', () => {
    cy.visit('/')
  })

  describe('Footer', () => {
    beforeEach(() => {
      cy.visit('/')
    })
    it('should have a link to the github repo', () => {
      cy.get('[data-cy="Github"]').should(
        'have.attr',
        'href',
        'https://github.com/reallyMilo/AnnoStamps'
      )
    })
    it('should have link to discord server', () => {
      cy.get('[data-cy="Discord"]').should(
        'have.attr',
        'href',
        'https://discord.gg/73hfP54qXe'
      )
    })
  })
})
