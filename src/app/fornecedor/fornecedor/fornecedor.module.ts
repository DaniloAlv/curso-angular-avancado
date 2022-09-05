import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExcluirFornecedorComponent } from '../excluir-fornecedor/excluir-fornecedor.component';
import { CadastroFornecedorComponent } from '../cadastro-fornecedor/cadastro-fornecedor.component';
import { DetalhesFornecedorComponent } from '../detalhes-fornecedor/detalhes-fornecedor.component';
import { EditarFornecedorComponent } from '../editar-fornecedor/editar-fornecedor.component';
import { FornecedorAppComponent } from './fornecedor.app.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { FornecedorRoutingModule } from './fornecedor.route';
import { TextMaskModule } from 'angular2-text-mask';
import { NgBrazil } from 'ng-brazil';
import { FornecedorResolve } from '../services/fornecedor.resolve';
import { FornecedorService } from '../services/fornecedor.service';
import { ListarFornecedoresComponent } from '../listar-fornecedores/listar-fornecedores.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { FornecedorGuard } from '../services/fornecedor.guard';
import { FormataTipoFornecedorPipe } from '../pipes/formata-tipo-fornecedor.pipe';

@NgModule({
  declarations: [
    ListarFornecedoresComponent,
    CadastroFornecedorComponent,
    EditarFornecedorComponent,
    DetalhesFornecedorComponent,
    ExcluirFornecedorComponent,
    FornecedorAppComponent,
    FormataTipoFornecedorPipe
  ],
  imports: [
    CommonModule,
    FornecedorRoutingModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgBrazil,
    TextMaskModule,
    NgxSpinnerModule
  ],
  exports: [
    ListarFornecedoresComponent,
    CadastroFornecedorComponent,
    EditarFornecedorComponent,
    DetalhesFornecedorComponent,
    ExcluirFornecedorComponent
  ],
  providers: [
    FornecedorResolve,
    FornecedorService,
    FornecedorGuard
  ]
})
export class FornecedorModule { }
