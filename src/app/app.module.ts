import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppComponent} from './app.component';
import {MintyTableComponent} from './minty-table/minty-table.component';
import {ReactiveFormsModule} from "@angular/forms";
import {GraphModule} from "@swimlane/ngx-graph";
import {HttpClientModule} from "@angular/common/http";

@NgModule({
    declarations: [
        AppComponent,
        MintyTableComponent
    ],
    imports: [
        BrowserModule,
        ReactiveFormsModule,
        GraphModule,
        HttpClientModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {
}
