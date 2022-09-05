import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavegacaoModule } from './navegacao/navegacao.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { AuthenticationModule } from './authentication/authentication.module';
import { FornecedorModule } from './fornecedor/fornecedor/fornecedor.module';
import { ProdutoModule } from './produto/produto.module';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ErrorInterceptor } from './services/error.handler.service';

export const httpInterceptorProvider = [
  {
    provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true
  }
];

@NgModule({
  declarations: [
    AppComponent    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NavegacaoModule,
    AuthenticationModule,
    NgbModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    FornecedorModule,
    ProdutoModule,
    HttpClientModule
  ],
  providers: [
    httpInterceptorProvider
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
