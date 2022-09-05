import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AcessoNegadoComponent } from './navegacao/acesso-negado/acesso-negado.component';
import { HomeComponent } from './navegacao/home/home/home.component';
import { NotFoundComponent } from './navegacao/not-found/not-found/not-found.component';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  {
    path: 'auth',
    loadChildren: () => import('./authentication/authentication.module')
      .then(mod => mod.AuthenticationModule)
  },
  {
    path: 'fornecedor',
    loadChildren: () => import('./fornecedor/fornecedor/fornecedor.module')
      .then(f => f.FornecedorModule)
  },
  {
    path: 'produto',
    loadChildren: () => import('./produto/produto.module')
      .then(p => p.ProdutoModule)
  },

  { path: 'acesso-negado', component: AcessoNegadoComponent },
  { path: 'not-found', component: NotFoundComponent },
  { path: '**', component: NotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
