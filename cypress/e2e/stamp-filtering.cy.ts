describe('Filtering 117 Stamps', () => {
  beforeEach(() => {
    cy.viewport(1920, 1080)
    cy.visit('/stamps')
  })

  it('user can filter and sort stamps', () => {
    cy.findByText('117 Stamps').should('exist')

    cy.get('#production').click()
    cy.url().should('include', '?category=production')

    cy.findAllByText('Production', { exact: false }).should(
      'have.length.greaterThan',
      10,
    )
  })

  it('pagination reset on exceeding pages through search functionality', () => {
    cy.findByLabelText('Page 10').click()
    cy.url().should('include', 'page=10')

    cy.get('#search').type('Stamp-801{enter}')

    cy.url().should('include', 'search=Stamp-801&page=1')
    cy.getBySel('stamp-card-link').should('have.length', 1)
  })

  it('preselects checkboxes based on category query params', () => {
    cy.visit('/stamps?category=production&category=general')

    cy.get('#production').should('be.checked')
    cy.get('#general').should('be.checked')
  })
})

describe('Filtering 1800 stamps', () => {
  beforeEach(() => {
    cy.viewport(1920, 1080)
    cy.visit('/1800/stamps')
  })
  it('user can filter and sort stamps', () => {
    cy.findByText('1800 Stamps').should('exist')

    cy.get('#production').click()
    cy.url().should('include', '?category=production')

    cy.findAllByText('Production', { exact: false }).should(
      'have.length.greaterThan',
      10,
    )

    cy.get('#enbesa').click()

    cy.url().should('include', '?category=production&region=enbesa')

    cy.findAllByText('enbesa').should('have.length.greaterThan', 2)
    cy.findByLabelText('Sort')
      .select('newest')
      .invoke('val')
      .should('eq', 'newest')
    cy.url().should('include', 'category=production&region=enbesa&sort=newest')
  })
  it('preselects checkboxes based on category query params', () => {
    cy.visit('/1800/stamps?region=old%20world')

    cy.get('#old world').should('be.checked')
  })
})
