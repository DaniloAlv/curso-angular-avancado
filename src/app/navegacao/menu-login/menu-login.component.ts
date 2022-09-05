import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/authentication/services/auth-service.service';

@Component({
  selector: 'app-menu-login',
  templateUrl: './menu-login.component.html'
})
export class MenuLoginComponent implements OnInit {

  token: string;
  user: any;

  constructor(private authService: AuthService,
              private router: Router) {
    this.token = '';
  }

  ngOnInit(): void {
  }

  usuarioLogado(): boolean{
    this.token = this.authService.instanceofLocalStorage()
      .obterTokenUsuario();
    this.user = this.authService.instanceofLocalStorage()
      .obterUsuario();

    return this.token != null;
  }

  logout(){
    this.authService.instanceofLocalStorage().limparDadosUsuario();
    this.router.navigate(['/home']);
  }

}
