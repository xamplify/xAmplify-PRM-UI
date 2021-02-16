import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactsStatisticsComponent } from './contacts-statistics.component';

describe('ContactsStatisticsComponent', () => {
  let component: ContactsStatisticsComponent;
  let fixture: ComponentFixture<ContactsStatisticsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContactsStatisticsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactsStatisticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
