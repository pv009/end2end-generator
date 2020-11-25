import { Component, Input, OnInit } from '@angular/core';
import { FAQs, mainFAQs, registerFAQs } from '../model/faq';

@Component({
  selector: 'app-faq-template',
  templateUrl: './faq-template.component.html',
  styleUrls: ['./faq-template.component.scss']
})
export class FaqTemplateComponent implements OnInit {
  @Input() faqTitle = '';

  selectedFAQs: FAQs;

  noSelected: number;

  constructor() { }

  ngOnInit() {
    console.log('TITLE ', this.faqTitle);
    if (this.faqTitle !== '') {
      switch (this.faqTitle) {
        case 'register':
          this.selectedFAQs = registerFAQs;
          break;
        case 'main':
          this.selectedFAQs = mainFAQs;
          break;
        default:
          console.error('No FAQ found for this title');
          break;
      }
    }

  }

  openQuestion(no: number) {
    if (this.noSelected === no) {
      this.noSelected = undefined;
    } else {
      this.noSelected = no;
    }
  }

}
