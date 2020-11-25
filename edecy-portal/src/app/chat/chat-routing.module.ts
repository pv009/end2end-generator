import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChatComponent } from './chat.component';
import { OverviewComponent } from './overview/overview.component';
import { SinglechatComponent } from './singlechat/singlechat.component';

const routes: Routes = [
    {
        path: '',
        component: ChatComponent,
        children: [
            {
                path: '',
                redirectTo: '/chat/overview',
                pathMatch: 'full'
            },
            {
                path: 'overview',
                component: OverviewComponent
            },
            {
                path: 'overview/:id',
                component: OverviewComponent
            },
            {
                path: ':uid/:projectid',
                component: SinglechatComponent,
                pathMatch: 'full'
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ChatRoutingModule {

}
