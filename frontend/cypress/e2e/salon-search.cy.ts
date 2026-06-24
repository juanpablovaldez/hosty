describe('Búsqueda y filtros de salones', () => {
  beforeEach(() => {
    cy.visit('https://d1ako6y2uvskg7.cloudfront.net/salones')
  })

  it('muestra salones disponibles al ingresar a la página', () => {
    cy.contains('Salones cerca tuyo').should('be.visible')
    cy.get('a[href*="/salones/"]').should('have.length.greaterThan', 0)
  })

  it('filtra salones por tipo de evento al hacer clic en Casamientos', () => {
    cy.contains('Casamientos').click()
    cy.get('a[href*="/salones/"]').should('have.length.greaterThan', 0)
  })
})