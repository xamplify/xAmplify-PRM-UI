import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PipedriveAuthenticationComponent } from './pipedrive-authentication.component';

describe('PipedriveAuthenticationComponent', () => {
  let component: PipedriveAuthenticationComponent;
  let fixture: ComponentFixture<PipedriveAuthenticationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PipedriveAuthenticationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PipedriveAuthenticationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
