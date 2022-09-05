import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { Produto } from '../models/produto';
import { ProdutoService } from '../services/produto.service';

@Component({
  selector: 'app-listar-produtos',
  templateUrl: './listar-produtos.component.html'
})
export class ListarProdutosComponent implements OnInit {

  imagens: string = environment.pathImagens;
  produtos: Produto[];
  
  constructor(private produtoService: ProdutoService,
              private router: Router) { }

  ngOnInit(): void {
    this.obterProdutos();
  }

  obterProdutos() {
    this.produtoService.listarProdutos()
      .subscribe(prods => {
        this.produtos = prods;
      });
  }

  navegarParaCadastroProduto() {
    return this.router.navigate(['/produto/cadastro']);
  }

}
