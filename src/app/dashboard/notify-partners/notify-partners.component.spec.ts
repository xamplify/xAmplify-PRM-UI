import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NotifyPartnersComponent } from './notify-partners.component';

describe('NotifyPartnersComponent', () => {
  let component: NotifyPartnersComponent;
  let fixture: ComponentFixture<NotifyPartnersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NotifyPartnersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotifyPartnersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
