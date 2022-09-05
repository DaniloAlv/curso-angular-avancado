import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { CadastroProdutoComponent } from "./cadastro-produto/cadastro-produto.component";
import { DetalhesProdutoComponent } from "./detalhes-produto/detalhes-produto.component";
import { EditarProdutoComponent } from "./editar-produto/editar-produto.component";
import { ExcluirProdutoComponent } from "./excluir-produto/excluir-produto.component";
import { ListarProdutosComponent } from "./listar-produtos/listar-produtos.component";
import { ProdutoAppComponent } from "./produto.app";
import { ProdutoResolve } from "./services/produto.resolve";

const produtoRoutes: Routes = [
    {
        path: '', component: ProdutoAppComponent,
        children: [
            { path: 'cadastro', component: CadastroProdutoComponent },
            {
                path: 'editar:id', component: EditarProdutoComponent,
                resolve: ProdutoResolve
            },
            { 
                path: 'detalhes:id', component: DetalhesProdutoComponent,
                resolve: ProdutoResolve
            },
            { path: 'excluir:id', component: ExcluirProdutoComponent },
            {
                path: 'todos', component: ListarProdutosComponent
            }
        ]
    }
]

@NgModule({
    imports: [
        RouterModule.forChild(produtoRoutes)
    ],
    exports: [
        RouterModule
    ]
})

export class ProdutoRoutingModule { }