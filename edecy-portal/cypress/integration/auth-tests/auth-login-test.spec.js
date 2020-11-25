/// <reference types="cypress" />

describe('Test for Login', () => {
  beforeEach(() => {
    cy.visit('http://localhost:4200/login');
  })

  it("Visit Login Page", () => {
    cy.contains('Anmelden');
  })

  it("Login To App", () => {
    cy.login(Cypress.env('username'), Cypress.env('password'));
    cy.logout();
  })
})
