import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CardDetailComponent } from './card-detail/card-detail.component';
import { CardListComponent } from './card-list/card-list.component';
import { CardsComponent } from './cards.component';
import { CreateRequestComponent } from './create-request/create-request.component';
import { MyCardsComponent } from './my-cards/my-cards.component';

export const routes: Routes = [
    {
        path: '',
        component: CardsComponent,
        children: [
            {
                path: '',
                redirectTo: '/cards/list',
                pathMatch: 'full'
            },
            {
                path: 'create-request',
                component: CreateRequestComponent
            },
            {
                path: 'list',
                component: CardListComponent,
                children: [
                    {
                        path: 'cards',
                        component: CardListComponent
                    }
                ]
            },
            {
                path: 'my-cards',
                component: MyCardsComponent,
                children: [
                    {
                        path: 'requests',
                        component: MyCardsComponent,
                        children: [
                            {
                                path: 'saved',
                                component: MyCardsComponent
                            }
                        ]
                    }
                ]
            },
            {
                path: 'edit/:id',
                component: CreateRequestComponent
            },
            {
                path: ':id',
                component: CardDetailComponent,
                pathMatch: 'full'
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CardsRoutingModule {

}
