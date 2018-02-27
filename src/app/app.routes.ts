import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SprintComponent } from './sprint/sprint.component';
import { EnvironmentsComponent } from './environments/environments.component';

// TODO: Move this out to it's own modules to handle the routes + lazy load
const appRoutes: Routes = [
    { path: 'sprint/current', component: SprintComponent },
    { path: 'sprint', component: SprintComponent },
    { path: 'environments', component: EnvironmentsComponent },
    { path: '', component: SprintComponent, pathMatch: 'full' }
];

@NgModule({
    imports: [
        RouterModule.forRoot(
            appRoutes,
            { enableTracing: true }
        )
    ]
})
export class AppRoutesModule { }
