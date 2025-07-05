import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CallbackComponent } from './callback.component';
import { SpotifyService } from '../../../core/servicios/spotifyServicio/spotify.service';
import { ActivatedRoute, Router } from '@angular/router';
import { of, throwError } from 'rxjs';

describe('CallbackComponent', () => {
  let component: CallbackComponent;
  let fixture: ComponentFixture<CallbackComponent>;
  let spotifyServiceSpy: jasmine.SpyObj<SpotifyService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const spotifySpy = jasmine.createSpyObj('SpotifyService', ['exchangeCodeForToken', 'guardarTokens']);
    const routerSpyObj = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      declarations: [CallbackComponent],
      providers: [
        { provide: SpotifyService, useValue: spotifySpy },
        { provide: Router, useValue: routerSpyObj },
        { 
          provide: ActivatedRoute, 
          useValue: {
            snapshot: {
              queryParamMap: {
                get: (key: string) => 'mockCode'
              }
            }
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CallbackComponent);
    component = fixture.componentInstance;
    spotifyServiceSpy = TestBed.inject(SpotifyService) as jasmine.SpyObj<SpotifyService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('debería crearse correctamente', () => {
    expect(component).toBeTruthy();
  });

  it('debería intercambiar el código por tokens y redirigir a /planes', () => {
    const tokenResponse = { access_token: 'a', refresh_token: 'r', expires_in: 3600 };
    spotifyServiceSpy.exchangeCodeForToken.and.returnValue(of(tokenResponse));

    component.ngOnInit();

    expect(spotifyServiceSpy.exchangeCodeForToken).toHaveBeenCalledWith('mockCode');
    expect(spotifyServiceSpy.guardarTokens).toHaveBeenCalledWith('a', 'r', 3600);
    expect(routerSpy.navigate).toHaveBeenCalledWith(['planes']);
  });

  it('debería mostrar error si falla exchangeCodeForToken', () => {
    const consoleSpy = spyOn(console, 'error');
    spotifyServiceSpy.exchangeCodeForToken.and.returnValue(throwError(() => new Error('error simulada')));

    component.ngOnInit();

    expect(spotifyServiceSpy.exchangeCodeForToken).toHaveBeenCalledWith('mockCode');
    expect(consoleSpy).toHaveBeenCalledWith('Error obteniendo token:', jasmine.any(Error));
  });

  it('no debería hacer nada si no hay código en la URL', () => {
    const routeWithoutCode = TestBed.inject(ActivatedRoute);
    spyOn(routeWithoutCode.snapshot.queryParamMap, 'get').and.returnValue(null);

    component.ngOnInit();

    expect(spotifyServiceSpy.exchangeCodeForToken).not.toHaveBeenCalled();
    expect(spotifyServiceSpy.guardarTokens).not.toHaveBeenCalled();
    expect(routerSpy.navigate).not.toHaveBeenCalled();
  });
});
