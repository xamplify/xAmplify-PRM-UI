import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomSkinComponent } from './custom-skin.component';

describe('CustomSkinComponent', () => {
  let component: CustomSkinComponent;
  let fixture: ComponentFixture<CustomSkinComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomSkinComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomSkinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
