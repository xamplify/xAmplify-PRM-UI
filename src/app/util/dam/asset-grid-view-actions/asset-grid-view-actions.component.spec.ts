import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetGridViewActionsComponent } from './asset-grid-view-actions.component';

describe('AssetGridViewActionsComponent', () => {
  let component: AssetGridViewActionsComponent;
  let fixture: ComponentFixture<AssetGridViewActionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssetGridViewActionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssetGridViewActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
