import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TermsConditonComponent } from './terms-conditon.component';

describe('TermsConditonComponent', () => {
  let component: TermsConditonComponent;
  let fixture: ComponentFixture<TermsConditonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TermsConditonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TermsConditonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
