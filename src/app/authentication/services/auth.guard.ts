import { Injectable } from "@angular/core";
import { CanActivate, CanDeactivate, Router } from "@angular/router";
import { LocalStorageUtils } from "src/app/utils/localstorage";
import { CadastroComponent } from "../cadastro/cadastro.component";

@Injectable()

export class AuthGuardService implements CanActivate, CanDeactivate<CadastroComponent> {

    localStorage: LocalStorageUtils;

    constructor(private router: Router) {
        this.localStorage = new LocalStorageUtils();
    }

    canActivate() {
        if (this.localStorage.obterTokenUsuario()) {
            this.router.navigate(['/home']);
        }

        return true;
    }

    canDeactivate(cadastroComponent: CadastroComponent) {
        if (cadastroComponent.dadosNaoSalvos) {
            return window.confirm('Deseja abandonar o preenchimento do formulário?');
        }

        return true;
    }
}