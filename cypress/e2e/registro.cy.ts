describe('Vista Registro de usuario', () =>{

it('debería mostrar errores si el formulario está vacío', () => {
  cy.visit('/registro');

  cy.get('form').submit();

  cy.contains('Ingresá tu nombre para continuar').should('be.visible');
  cy.contains('Ingresá tu apellido para continuar').should('be.visible');
  cy.contains('Ingresá tu fecha de nacimiento para continuar').should('be.visible');
  cy.contains('correo electrónico debe contener un arroba').should('not.exist');
  cy.contains('Ingresá la contraseña para continuar').should('be.visible');
  cy.contains('Volvé a ingresar la contraseña para continuar').should('be.visible');
});

it('debería mostrar error si las contraseñas no coinciden', () => {
  cy.visit('/registro');

  cy.get('input[formControlName="contrasenia"]').type('Abc123!');
  cy.get('input[formControlName="repetirContrasenia"]').type('Abc1234!');

  cy.get('form').submit();

  cy.contains('Las contraseñas no coinciden').should('be.visible');
});

it('debería mostrar error si el usuario es menor de 16 años', () => {
  cy.visit('/registro');

  const fecha = new Date();
  fecha.setFullYear(fecha.getFullYear() - 15); 
  const fechaStr = fecha.toISOString().split('T')[0];

  cy.get('input[formControlName="fechaNacimiento"]').type(fechaStr);
  cy.get('form').submit();

  cy.contains('Tenés que ser mayor de 16 años').should('be.visible');
});

it('debería mostrar error si el correo es inválido', () => {
  cy.visit('/registro');

  cy.get('input[formControlName="email"]').type('correo_sin_arroba');
  cy.get('form').submit();

  cy.contains('correo electrónico debe contener un arroba').should('be.visible');
});

});