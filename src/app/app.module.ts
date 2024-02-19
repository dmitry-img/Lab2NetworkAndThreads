import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppComponent} from './app.component';
import {MintyTableComponent} from './minty-table/minty-table.component';
import {ReactiveFormsModule} from "@angular/forms";

import {HttpClientModule} from "@angular/common/http";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {NgLetModule} from "ng-let";
import {NgxGraphModule} from "@swimlane/ngx-graph";
import {MatIconModule} from "@angular/material/icon";
import {A11yModule} from "@angular/cdk/a11y";

@NgModule({
    declarations: [
        AppComponent,
        MintyTableComponent
    ],
    imports: [
        BrowserAnimationsModule,
        BrowserModule,
        ReactiveFormsModule,
        NgxGraphModule,
        HttpClientModule,
        NgLetModule,
        MatIconModule,
        A11yModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {
}
