import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {HomeComponent} from "./features/home/home.component";
import {MintyComponent} from "./features/minty/minty.component";
import {AboutComponent} from "./features/about/about.component";

const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'minty', component: MintyComponent },
    { path: 'about', component: AboutComponent }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
