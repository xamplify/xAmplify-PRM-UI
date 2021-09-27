import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowPrmContentComponent } from './show-prm-content.component';

describe('ShowPrmContentComponent', () => {
  let component: ShowPrmContentComponent;
  let fixture: ComponentFixture<ShowPrmContentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShowPrmContentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowPrmContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
