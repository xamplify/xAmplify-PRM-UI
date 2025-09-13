import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpfComponent } from './spf.component';

describe('SpfComponent', () => {
  let component: SpfComponent;
  let fixture: ComponentFixture<SpfComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpfComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
