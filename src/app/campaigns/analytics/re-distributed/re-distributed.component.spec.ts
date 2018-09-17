import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReDistributedComponent } from './re-distributed.component';

describe('ReDistributedComponent', () => {
  let component: ReDistributedComponent;
  let fixture: ComponentFixture<ReDistributedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReDistributedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReDistributedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
