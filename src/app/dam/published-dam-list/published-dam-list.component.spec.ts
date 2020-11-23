import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PublishedDamListComponent } from './published-dam-list.component';

describe('PublishedDamListComponent', () => {
  let component: PublishedDamListComponent;
  let fixture: ComponentFixture<PublishedDamListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PublishedDamListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PublishedDamListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
