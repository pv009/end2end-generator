import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateProfileComponent } from './create-profile/create-profile.component';
import { ContactProfileComponent } from './profile-es/contact-profile/contact-profile.component';
import { ProfileEsComponent } from './profile-es/profile-es.component';
import { ProfileComponent } from './profile.component';

const routes: Routes = [
    {
        path: 'contact',
        children: [
            {
                path: ':id',
                component: ContactProfileComponent,
                pathMatch: 'full'
            }
        ]
    },
    {
        path: 'es',
        children: [
            {
                path: ':id',
                component: ProfileEsComponent,
                pathMatch: 'full'
            }
        ]
    },
    {
        path: 'create-profile',
        component: CreateProfileComponent
    },
    {
        path: 'edit-profile',
        component: CreateProfileComponent
    },
    {
        path: '',
        component: ProfileComponent,
        children: [
            {
                path: ':id',
                component: ProfileComponent,
                pathMatch: 'full'
            }
        ]
    }

];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ProfileRoutingModule {

}
