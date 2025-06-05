describe('Página de inicio de sesión', () => {
  it('debería mostrar el formulario de login', () => {
    cy.visit('http://localhost:4200/iniciar-sesion');

    cy.get('input#loginEmail').should('exist').and('be.visible');

    cy.get('input#loginPassword').should('exist').and('be.visible');

    cy.contains('button, app-boton-trainin', 'Iniciar Sesión').should('exist');
  });

  it('debería mostrar error con credenciales inválidas', () => {
    cy.visit('http://localhost:4200/iniciar-sesion');

    cy.get('input#loginEmail').type('invalido@gmail.com');
    cy.get('input#loginPassword').type('123456');

    cy.contains('button, app-boton-trainin', 'Iniciar Sesión').click();

    cy.get('.toast-message').should('contain', 'Credenciales incorrectas o error de servidor.');
  });
 //Este test solo funciona si el backend esta funcionando. 
  it('debería iniciar sesión con credenciales válidas', () => {
    cy.visit('http://localhost:4200/iniciar-sesion');

    cy.get('input#loginEmail').type('prueba@gmail.com');
    cy.get('input#loginPassword').type('Prueba123.');

    cy.contains('button, app-boton-trainin', 'Iniciar Sesión').click();
    cy.url().should('include', '/planes');
  });
});