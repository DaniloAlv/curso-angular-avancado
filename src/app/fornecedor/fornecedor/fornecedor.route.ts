import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { CadastroFornecedorComponent } from "../cadastro-fornecedor/cadastro-fornecedor.component";
import { DetalhesFornecedorComponent } from "../detalhes-fornecedor/detalhes-fornecedor.component";
import { EditarFornecedorComponent } from "../editar-fornecedor/editar-fornecedor.component";
import { ExcluirFornecedorComponent } from "../excluir-fornecedor/excluir-fornecedor.component";
import { ListarFornecedoresComponent } from "../listar-fornecedores/listar-fornecedores.component";
import { FornecedorGuard } from "../services/fornecedor.guard";
import { FornecedorResolve } from "../services/fornecedor.resolve";
import { FornecedorAppComponent } from "./fornecedor.app.component";

const routesFornecedor: Routes = [
    { 
        path: '', component: FornecedorAppComponent, 
        children: [
            { 
                path: 'cadastro', component: CadastroFornecedorComponent,
                canActivate: [FornecedorGuard],
                canDeactivate: [FornecedorGuard],
                data: [{
                    claim: {
                        nome: 'Fornecedor',
                        valor: 'Adicionar'
                    }
                }]
            },
            { path: 'todos', component: ListarFornecedoresComponent },
            { 
                path: 'editar/:id', component: EditarFornecedorComponent, 
                resolve: { fornecedor: FornecedorResolve },
                canActivate: [FornecedorGuard],
                data: [{
                    claim: {
                        nome: 'Fornecedor',
                        valor: 'Editar'
                    }
                }]
            },
            { 
                path: 'excluir/:id', component: ExcluirFornecedorComponent, 
                resolve: { fornecedor: FornecedorResolve },
                canActivate: [FornecedorGuard],
                data: [{
                    claim: {
                        nome: 'Fornecedor',
                        valor: 'Excluir'
                    }
                }]
            },
            { 
                path: 'detalhes/:id', component: DetalhesFornecedorComponent, 
                resolve: { fornecedor: FornecedorResolve },
                canActivate: [FornecedorGuard]
            }
        ]
    }
]

@NgModule({
    imports: [
        RouterModule.forChild(routesFornecedor)
    ],
    exports: [
        RouterModule
    ]
})

export class FornecedorRoutingModule { }