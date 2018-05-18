import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SprintComponent } from '@sprint/components/sprint/sprint.component';
import { EnvironmentsComponent } from '@environments/environments.component';
import { SignInComponent } from '@auth/sign-in/sign-in.component';
import { BacklogComponent } from '@backlog/backlog.component';

// TODO: Move this out to it's own modules to handle the routes + lazy load
const appRoutes: Routes = [
    { path: 'sprint/current', component: SprintComponent },
    { path: 'sprint', component: SprintComponent },
    { path: 'environments', component: EnvironmentsComponent },
    { path: 'backlog', component: BacklogComponent },
    { path: 'auth', component: SignInComponent },
    { path: '', component: SprintComponent, pathMatch: 'full' }
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
