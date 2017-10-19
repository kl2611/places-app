import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AgmCoreModule } from '@agm/core';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AgmCoreModule.forRoot({
      apiKey: "AIzaSyAiY4i9g2DtV6dtQR4BylQX3_vDZqqVLBU",
      libraries: ["places"]
    }),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
