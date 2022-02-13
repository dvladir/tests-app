import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { PaginationComponent } from './components/pagination/pagination.component';
import { UsersTableComponent } from './components/users-table/users-table.component';
import {NgxsModule} from "@ngxs/store";
import {environment} from "../environments/environment";
import {UsersState} from "./store/users.state";
import {NgxsReduxDevtoolsPluginModule} from "@ngxs/devtools-plugin";

const IS_PROD = !!environment.production;

@NgModule({
  declarations: [
    AppComponent,
    PaginationComponent,
    UsersTableComponent,
  ],
  imports: [
    BrowserModule,
    NgxsModule.forRoot([
      UsersState
    ], {
      developmentMode: !IS_PROD,
      selectorOptions: {
        suppressErrors: false,
        injectContainerState: false
      }
    }),
    NgxsReduxDevtoolsPluginModule.forRoot({disabled: IS_PROD})
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
