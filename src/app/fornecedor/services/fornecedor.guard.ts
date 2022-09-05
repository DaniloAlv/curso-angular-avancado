import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, CanDeactivate, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { LocalStorageUtils } from "src/app/utils/localstorage";
import { CadastroFornecedorComponent } from "../cadastro-fornecedor/cadastro-fornecedor.component";

@Injectable()

export class FornecedorGuard implements CanActivate, CanDeactivate<CadastroFornecedorComponent> {

    localStorage: LocalStorageUtils;

    constructor(private router: Router) { 
        this.localStorage = new LocalStorageUtils();
    }

    canDeactivate(component: CadastroFornecedorComponent) {
        if(component.mudancasNaoSalvas){
            return window.confirm("Tem certeza que quer abandonar o formulário? Ainda há campos a serem preenchidos!");
        }

        return true
    }

    canActivate(route: ActivatedRouteSnapshot): boolean {
        
        if(!this.localStorage.obterTokenUsuario()){
            this.router.navigate(['/auth/login'], { queryParams: { returnUrl: this.router.url }});
        }

        let user = this.localStorage.obterUsuario();
        let claim = route.data[0];

        if (claim !== undefined) {
            let claim = route.data[0]['claim'];

            if(claim){
                if(!user.claims){
                    this.navigateAcessoNegado();
                }

                let userClaims = user.claims.find(u => u.type === claim.nome);

                if(!userClaims){
                    this.navigateAcessoNegado();
                }

                let valueClaims = userClaims.value as string;

                if(!valueClaims.includes(claim.valor)){
                    this.navigateAcessoNegado();
                }
            }
        }

        return true;
    }

    navigateAcessoNegado() {
        this.router.navigate(['/acesso-negado']);
    }
}