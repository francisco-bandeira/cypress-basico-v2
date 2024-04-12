Cypress.Commands.add('fillMandatoryFieldsAndSubmit', function () {
  cy.get('#firstName').type('Francisco')
  cy.get('#lastName').type('Bandeira')
  cy.get('#email').type('francisco.frazzon@outlook.com')
  cy.get('#open-text-area').type('Teste')
  cy.get('button[type="submit"]').click()
})