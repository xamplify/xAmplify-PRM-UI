import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ChatGptSettingsService } from 'app/dashboard/chat-gpt-settings.service';
import { ChatGptIntegrationSettingsDto } from 'app/dashboard/models/chat-gpt-integration-settings-dto';

@Component({
  selector: 'app-ppt-design-picker',
  templateUrl: './ppt-design-picker.component.html',
  styleUrls: ['./ppt-design-picker.component.css']
})
export class PptDesignPickerComponent implements OnInit {
  @Input() pptData: string = '';
  @Output() notifyData: EventEmitter<any> = new EventEmitter();
  @Input() fromOliverPopup : boolean = false;
  pptLoader: boolean = false;
  cards = [
    {
      id: 'template1',
      title: 'Mobile Wireframe PowerPoint Template',
      image: 'assets/images/pptblueimage.png',
      selected: false
    },
    {
      id: 'template2',
      title: 'Customer Card UI PowerPoint Template',
      image: 'assets/images/custompptdesign.png',
      selected: false
    },
    {
      id: 'template3',
      title: 'User Login Mockup PowerPoint Template',
      image: 'assets/images/neworangeimage.png',
      selected: false
    }
  ];

  constructor(private chatGptSettingsService: ChatGptSettingsService) { }

  ngOnInit(): void { 
  }

  // Select only one card at a time
  selectCard(clickedCard: any): void {
  // Toggle selection
  const wasSelected = clickedCard.selected;

  // Deselect all cards first
  this.cards.forEach(card => card.selected = false);

  // If the clicked card was not already selected, select it
  if (!wasSelected) {
    clickedCard.selected = true;
  }
}


  hasAnySelectedCard(): boolean {
    return this.cards.some(card => card.selected);
  }

  getSelectedCard(): any {
    return this.cards.find(card => card.selected);
  }

  generateSelectedCard(): void {
    const selected = this.getSelectedCard();
    if (!selected) return;

    console.log('Generating PPT for:', selected.title);
    this.onPptFile(selected.id);
  }

  onPptFile(id: string): void {
    this.pptLoader = true;
    this.pptData = (this.pptData || '').trim();

    if (!this.pptData) {
      console.warn('[pptx] No content');
      this.pptLoader = false;
      return;
    }

    const dto = new ChatGptIntegrationSettingsDto();
    dto.prompt = this.pptData;

    this.chatGptSettingsService.getOpenAiResponse(dto).subscribe(
      (response: any) => {
        const data = response.data;
        if (data) {
          this.chatGptSettingsService.generateAndDownloadPpt(data, id);
        } else {
          console.warn('[pptx] No data returned from GPT');
        }
      },
      (error: any) => {
        console.error('[pptx] GPT error:', error);
        this.pptLoader = false;
      },
      () => {
        this.pptLoader = false;
        this.close();
      }
    );
  }

  close(): void {
    this.notifyData.emit('close');
    this.pptLoader = false;
  }
}
