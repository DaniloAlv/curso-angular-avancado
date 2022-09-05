import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, CanDeactivate, Router } from "@angular/router";
import { CadastroProdutoComponent } from "../cadastro-produto/cadastro-produto.component";

@Injectable()
export class ProdutoGuard implements CanActivate, CanDeactivate<CadastroProdutoComponent> {

    constructor(private router: Router){}

    canActivate(route: ActivatedRouteSnapshot) {
        return true;
    }

    canDeactivate(component: CadastroProdutoComponent) {
        if(component.mudancasNaoSalvas){
            return window.confirm("Tem certeza que deseja abandonar o preenchimento do formulário?");
        }

        return true;
    }
}