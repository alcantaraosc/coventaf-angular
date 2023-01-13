import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginmaterialComponent } from './loginmaterial.component';

describe('LoginmaterialComponent', () => {
  let component: LoginmaterialComponent;
  let fixture: ComponentFixture<LoginmaterialComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoginmaterialComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoginmaterialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
