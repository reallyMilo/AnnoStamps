describe('public routes render', () => {
  it('render home page', () => {
    cy.visit('/')
  })
  it('display the privacy page', () => {
    cy.visit('/privacy')
    cy.get('h1').contains('Privacy Policy')
  })

  it('display how-to page', () => {
    cy.visit('/how-to')
    cy.get('h1').contains('How to use stamps in Anno 1800')
  })
  it('display stamp creator page', () => {
    cy.visit('/user1')
    cy.get('h1').contains('user1 Stamps')
    cy.contains('User has no stamps').should('not.exist')
  })

  describe('Stamp Card', () => {
    beforeEach(() => {
      cy.visit('/')
      cy.getBySel('stamp-card-link').first().as('stamp')
    })
    it('navigates to stamp', () => {
      this.stamp.click()
      cy.url().should('include', '/stamp')
    })
  })

  describe('Stamp Page', () => {
    beforeEach(() => {
      cy.visit('/')
      cy.getBySel('stamp-card-link')
        .first()
        .then(($link) => {
          cy.visit($link.attr('href'))
        })
    })
    it('stamp title', () => {
      cy.get('h1').invoke('text').should('include', 'Stamp-')
    })
    it('list has category and region', () => {
      cy.get('ol li').should('have.length', 2)
    })
  })
})
