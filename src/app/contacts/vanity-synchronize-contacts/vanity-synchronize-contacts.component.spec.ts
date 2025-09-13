import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VanitySynchronizeContactsComponent } from './vanity-synchronize-contacts.component';

describe('VanitySynchronizeContactsComponent', () => {
  let component: VanitySynchronizeContactsComponent;
  let fixture: ComponentFixture<VanitySynchronizeContactsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VanitySynchronizeContactsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VanitySynchronizeContactsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
