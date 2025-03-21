import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AiChatManagerComponent } from './ai-chat-manager.component';

describe('AiChatManagerComponent', () => {
  let component: AiChatManagerComponent;
  let fixture: ComponentFixture<AiChatManagerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AiChatManagerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AiChatManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
