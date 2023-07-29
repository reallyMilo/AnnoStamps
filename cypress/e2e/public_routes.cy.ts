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
    cy.contains('User has no Stamps').should('not.exist')
  })
  it('invalid creator path nickname has no stamps', () => {
    cy.visit('/nostampshere')
    cy.get('h1').contains('nostampshere Stamps')
    cy.contains('User has no Stamps').should('exist')
  })

  describe('Stamp Card', () => {
    it('navigates to stamp', () => {
      cy.visit('/')
      cy.getBySel('stamp-card-link').first().click()
      cy.url().should('include', '/stamp')
    })
    it('liking stamp opens auth modal', () => {
      cy.visit('/')
      cy.getBySel('auth-modal').should('not.exist')
      cy.getBySel('stamp-card-like').first().click()
      cy.getBySel('auth-modal').should('be.visible')
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
    it('has all stamp fields', () => {
      cy.get('h1').invoke('text').should('include', 'Stamp-')
      cy.get('ol li').should('have.length', 2)
    })

    it('download button should download stamp', () => {
      cy.intercept('GET', '/stamp.zip').as('download')
      cy.getBySel('stamp-download')
        .trigger('mouseover')
        .then(($link) => {
          expect($link.css('cursor')).to.equal('pointer')
        })
      cy.getBySel('stamp-download').click()
      cy.wait('@download').then((req) => {
        expect(req.response.statusCode).to.equal(200)
      })
      // const downloadsFolder = Cypress.config('downloadsFolder')
      // cy.get('h1').then((h1) => {
      //   cy.readFile(downloadsFolder + '/' + h1.text())
      // })
    })
  })
})
