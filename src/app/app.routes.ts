import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SprintComponent } from '@sprint/components/sprint/sprint.component';
import { EnvironmentsComponent } from '@environments/environments.component';
import { SignInComponent } from '@auth/sign-in/sign-in.component';
import { PbiContainerComponent } from 'sprint-board/pbi-container/pbi-container.component';
import { BacklogContainerComponent } from '@backlog/backlog-container/backlog-container.component';
import { MetaModalComponent } from 'meta/meta-modal/meta-modal.component';

// TODO: Move this out to it's own modules to handle the routes + lazy load
const appRoutes: Routes = [
    { path: 'sprint/:iteration', component: SprintComponent},
    { path: 'sprint/current', component: SprintComponent },
    { path: 'sprint', redirectTo: 'sprint/current' },
    { path: 'pbi/:pbiId', component: PbiContainerComponent },
    { path: 'pbi', redirectTo: 'sprint/current'},
    { path: 'about', component: MetaModalComponent },
    { path: 'environments', component: EnvironmentsComponent },
    { path: 'backlog', component: BacklogContainerComponent },
    { path: 'auth', component: SignInComponent },
    { path: '', redirectTo: 'sprint/current', pathMatch: 'full' }
];

@NgModule({
    imports: [
        RouterModule.forRoot(
            appRoutes,
            { useHash: true }
        )
    ]
})
export class AppRoutesModule { }
