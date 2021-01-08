import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VanityAddContactsComponent } from './vanity-add-contacts.component';

describe('VanityAddContactsComponent', () => {
  let component: VanityAddContactsComponent;
  let fixture: ComponentFixture<VanityAddContactsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VanityAddContactsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VanityAddContactsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
