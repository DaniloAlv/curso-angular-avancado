import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CadastroProdutoComponent } from './cadastro-produto/cadastro-produto.component';
import { DetalhesProdutoComponent } from './detalhes-produto/detalhes-produto.component';
import { EditarProdutoComponent } from './editar-produto/editar-produto.component';
import { ListarProdutosComponent } from './listar-produtos/listar-produtos.component';
import { ExcluirProdutoComponent } from './excluir-produto/excluir-produto.component';
import { ProdutoAppComponent } from './produto.app';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ProdutoRoutingModule } from './produto.route';
import { NgxSpinnerModule } from 'ngx-spinner';
import { ProdutoResolve } from './services/produto.resolve';
import { ProdutoService } from './services/produto.service';
import { ImageCropperModule } from 'ngx-image-cropper';

@NgModule({
  declarations: [
    ProdutoAppComponent,
    CadastroProdutoComponent,
    DetalhesProdutoComponent,
    EditarProdutoComponent,
    ListarProdutosComponent,
    ExcluirProdutoComponent
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule,
    ProdutoRoutingModule,
    NgxSpinnerModule,
    ImageCropperModule
  ],
  exports: [
    CadastroProdutoComponent,
    DetalhesProdutoComponent,
    EditarProdutoComponent,
    ListarProdutosComponent,
    ExcluirProdutoComponent
  ],
  providers: [
    ProdutoResolve,
    ProdutoService
  ]
})
export class ProdutoModule { }
