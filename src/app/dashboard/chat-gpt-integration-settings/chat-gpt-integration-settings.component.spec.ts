import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatGptIntegrationSettingsComponent } from './chat-gpt-integration-settings.component';

describe('ChatGptIntegrationSettingsComponent', () => {
  let component: ChatGptIntegrationSettingsComponent;
  let fixture: ComponentFixture<ChatGptIntegrationSettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChatGptIntegrationSettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatGptIntegrationSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
