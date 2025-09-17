import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModuleAccessComponent } from './module-access.component';

describe('ModuleAccessComponent', () => {
  let component: ModuleAccessComponent;
  let fixture: ComponentFixture<ModuleAccessComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModuleAccessComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModuleAccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
