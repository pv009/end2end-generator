// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This is will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

Cypress.Commands.add('login', (email, password) => {
  // cy.pause();
  cy.get('input[formcontrolname=email]').type(email);
  cy.get('input[formcontrolname=password]').type(password);
  cy.get('button[type=submit]').click();
  cy.url().should('equal', 'http://localhost:4200/cards/list');
})

Cypress.Commands.add('logout', () => {
  cy.get('mat-icon').contains('menu').click();
  cy.get('button').contains('Abmelden').click();
  cy.url().should('equal', 'http://localhost:4200/logout')

})
