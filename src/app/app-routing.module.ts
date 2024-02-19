import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {HomeComponent} from "./features/home/home.component";
import {MintyComponent} from "./features/minty/minty.component";
import {DocumentationComponent} from "./features/documentation/documentation.component";

const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'minty', component: MintyComponent },
    { path: 'documentation', component: DocumentationComponent }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
