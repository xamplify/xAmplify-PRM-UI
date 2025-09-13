import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SfDealComponent } from './sf-deal.component';

describe('SfDealComponent', () => {
  let component: SfDealComponent;
  let fixture: ComponentFixture<SfDealComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SfDealComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SfDealComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
