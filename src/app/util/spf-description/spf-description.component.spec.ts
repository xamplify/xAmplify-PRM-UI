import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpfDescriptionComponent } from './spf-description.component';

describe('SpfDescriptionComponent', () => {
  let component: SpfDescriptionComponent;
  let fixture: ComponentFixture<SpfDescriptionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpfDescriptionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpfDescriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
