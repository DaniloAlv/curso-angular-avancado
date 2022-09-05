import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AuthenticationAppComponent } from "./authentication.app.component";
import { CadastroComponent } from "./cadastro/cadastro.component";
import { LoginComponent } from "./login/login.component";
import { AuthGuardService } from "./services/auth.guard";

const routesAuthentication: Routes = [
    {
        path: '', component: AuthenticationAppComponent,
        children: [
            { path: 'cadastro', component: CadastroComponent, canActivate: [AuthGuardService], canDeactivate: [AuthGuardService] },
            { path: 'login', component: LoginComponent }
        ]
    }
];

@NgModule({
    imports: [
        RouterModule.forChild(routesAuthentication)
    ],
    declarations: [],
    exports: [
        RouterModule
    ],
    providers: []
})

export class AuthenticationRoutingModule { }