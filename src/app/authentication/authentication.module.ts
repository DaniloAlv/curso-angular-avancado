import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CadastroComponent } from './cadastro/cadastro.component';
import { LoginComponent } from './login/login.component';
import { AuthenticationRoutingModule } from './authentication.route';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AuthenticationAppComponent } from './authentication.app.component';
import { AuthService } from './services/auth-service.service';
import { AuthGuardService } from './services/auth.guard';

@NgModule({
  declarations: [
    AuthenticationAppComponent,
    CadastroComponent,
    LoginComponent
  ],
  imports: [
    CommonModule,
    AuthenticationRoutingModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [
    AuthService,
    AuthGuardService
  ]
})

export class AuthenticationModule { }
