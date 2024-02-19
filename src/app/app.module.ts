import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppComponent} from './app.component';
import {MintyTableComponent} from './features/minty/minty-table/minty-table.component';
import {ReactiveFormsModule} from "@angular/forms";

import {HttpClientModule} from "@angular/common/http";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {NgLetModule} from "ng-let";
import {NgxGraphModule} from "@swimlane/ngx-graph";
import {MatIconModule} from "@angular/material/icon";
import {A11yModule} from "@angular/cdk/a11y";
import { HeaderComponent } from './core/header/header.component';
import { MintyComponent } from './features/minty/minty.component';
import { HomeComponent } from './features/home/home.component';
import { DocumentationComponent } from './features/documentation/documentation.component';
import {RouterModule, RouterOutlet} from "@angular/router";
import {CommonModule} from "@angular/common";
import {AppRoutingModule} from "./app-routing.module";

@NgModule({
    declarations: [
        AppComponent,
        MintyTableComponent,
        HeaderComponent,
        MintyComponent,
        HomeComponent,
        DocumentationComponent
    ],
    imports: [
        BrowserAnimationsModule,
        BrowserModule,
        ReactiveFormsModule,
        NgxGraphModule,
        HttpClientModule,
        NgLetModule,
        MatIconModule,
        A11yModule,
        RouterOutlet,
        CommonModule,
        AppRoutingModule
    ],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule {
}
