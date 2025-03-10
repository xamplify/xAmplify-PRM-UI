import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UnlayerBuliderComponent } from './unlayer-bulider.component';

describe('UnlayerBuliderComponent', () => {
  let component: UnlayerBuliderComponent;
  let fixture: ComponentFixture<UnlayerBuliderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UnlayerBuliderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UnlayerBuliderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
