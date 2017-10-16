import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditPartnersComponent } from './edit-partners.component';

describe('EditPartnersComponent', () => {
  let component: EditPartnersComponent;
  let fixture: ComponentFixture<EditPartnersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditPartnersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditPartnersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
