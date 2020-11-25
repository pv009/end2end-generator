import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatComponent } from './chat.component';
import { OverviewComponent } from './overview/overview.component';
import { SinglechatComponent } from './singlechat/singlechat.component';
import { ChatRoutingModule } from './chat-routing.module';
import { SharedModule } from '../shared/shared.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgxsModule } from '@ngxs/store';
import { ChatState } from './state/chats.state';
import { CardsState } from '../cards/state/cards.state';
import { ChatService } from './service/chat.service';
import { CardsModule } from '../cards/cards.module';
import { FroalaEditorModule, FroalaViewModule } from 'angular-froala-wysiwyg';
import { DeletehtmlPipe } from './pipes/deletehtml.pipe';



@NgModule({
  declarations: [ChatComponent, OverviewComponent, SinglechatComponent, DeletehtmlPipe],
  imports: [
    CommonModule,
    ChatRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    FormsModule,
    NgxsModule.forFeature([CardsState, ChatState]),
    CardsModule,
    FroalaEditorModule,
    FroalaViewModule,
  ],
  providers: [ChatService]
})
export class ChatModule { }
