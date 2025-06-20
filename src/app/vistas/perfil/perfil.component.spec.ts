// import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
// import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
// import { PerfilService } from '../../core/servicios/perfilServicio/perfil.service';
// import { environment } from '../../../environments/environment';
// import { PerfilComponent } from './perfil.component';
// import { of } from 'rxjs';
// import { ToastrService } from 'ngx-toastr';
// import { LogroService } from '../../core/servicios/logroServicio/logro.service';
// import { AuthService } from '../../core/servicios/authServicio/auth.service';
// import { NO_ERRORS_SCHEMA } from '@angular/core';


// describe('PerfilComponent', () => {
//   let component: PerfilComponent;
//   let fixture: ComponentFixture<PerfilComponent>;

//   let perfilServiceSpy: jasmine.SpyObj<PerfilService>;
//   let authServiceSpy: jasmine.SpyObj<AuthService>;
//   let logroServiceSpy: jasmine.SpyObj<LogroService>;
//   let toastrSpy: jasmine.SpyObj<ToastrService>;
  
//   beforeEach(waitForAsync(() => {
//     const perfilSpy = jasmine.createSpyObj('PerfilService', ['getPerfil', 'actualizarFotoPerfil']);
//     const authSpy = jasmine.createSpyObj('AuthService', ['getEmail']);
//     const logroSpy = jasmine.createSpyObj('LogroService', ['obtenerLogrosPorUsuario']);
//     const toastrMock = jasmine.createSpyObj('ToastrService', ['success', 'error']);

//     TestBed.configureTestingModule({
//       declarations: [PerfilComponent],
//       providers: [
//         { provide: PerfilService, useValue: perfilSpy },
//         { provide: AuthService, useValue: authSpy },
//         { provide: LogroService, useValue: logroSpy },
//         { provide: ToastrService, useValue: toastrMock }
//       ],
//        schemas: [NO_ERRORS_SCHEMA]
//     }).compileComponents();

//     perfilServiceSpy = TestBed.inject(PerfilService) as jasmine.SpyObj<PerfilService>;
//     authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
//     logroServiceSpy = TestBed.inject(LogroService) as jasmine.SpyObj<LogroService>;
//     toastrSpy = TestBed.inject(ToastrService) as jasmine.SpyObj<ToastrService>;
//   }));

//   beforeEach(() => {
//     fixture = TestBed.createComponent(PerfilComponent);
//     component = fixture.componentInstance;
//   });

//   it('se deberia crea el componente', () => {
//     expect(component).toBeTruthy();
//   });

//   it('debería llamar a getPerfil y obtener los datos del usuario', () => {
//   const perfilMock = {
//     perfil: {
//       nombre: 'Usuario Test',
//       fotoDePerfil: '',
//       apellido: '',
//       fechaCreacion: '',
//       peso: 0,
//       altura: 0,
//       edad: 0,
//       caloriasTotales: 0
//     }
//   };
//   authServiceSpy.getEmail.and.returnValue('test@test.com');
//   perfilServiceSpy.getPerfil.and.returnValue(of(perfilMock));
//   logroServiceSpy.obtenerLogrosPorUsuario.and.returnValue(of({ logros: [] }));
  
//   component.email = 'test@test.com';

//   component.ngOnInit();

//   expect(perfilServiceSpy.getPerfil).toHaveBeenCalledWith('test@test.com');
//   expect(component.perfil?.nombre).toBe('Usuario Test');
// });

// });
