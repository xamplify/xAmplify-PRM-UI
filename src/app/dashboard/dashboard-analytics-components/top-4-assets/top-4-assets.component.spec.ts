import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Top4AssetsComponent } from './top-4-assets.component';

describe('Top4AssetsComponent', () => {
  let component: Top4AssetsComponent;
  let fixture: ComponentFixture<Top4AssetsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Top4AssetsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Top4AssetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
