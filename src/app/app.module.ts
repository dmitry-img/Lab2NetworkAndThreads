import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppComponent} from './app.component';
import {MintyTableComponent} from './minty-table/minty-table.component';
import {ReactiveFormsModule} from "@angular/forms";
import {GraphModule} from "@swimlane/ngx-graph";
import {HttpClientModule} from "@angular/common/http";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {NgLetModule} from "ng-let";

@NgModule({
    declarations: [
        AppComponent,
        MintyTableComponent
    ],
    imports: [
        BrowserAnimationsModule,
        BrowserModule,
        ReactiveFormsModule,
        GraphModule,
        HttpClientModule,
        NgLetModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {
}
