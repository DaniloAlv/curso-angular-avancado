import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import { Produto } from '../models/produto';
import { ProdutoService } from '../services/produto.service';

@Component({
  selector: 'app-excluir-produto',
  templateUrl: './excluir-produto.component.html'
})
export class ExcluirProdutoComponent implements OnInit {

  imagens: string = environment.pathImagens;
  produto: Produto;

  constructor(private route: ActivatedRoute,
              private produtoService: ProdutoService,
              private toastr: ToastrService,
              private router: Router) { }

  ngOnInit(): void {
    this.produto = this.route.snapshot.data['produto'];
  }

  excluirProduto() {
    const produtoId = this.route.params['id'];

    this.produtoService.excluirProduto(produtoId)
      .subscribe(() => {
        this.processarSucesso(),
        error => this.processarFalha(error)
      });
  }

  processarSucesso() {
    this.toastr.success("Removido!", `${this.produto.nome} removido com sucesso!`)
      .onHidden.subscribe(() => {
        this.router.navigate(['/produto/todos']);
      });
  }

  processarFalha(response: any) {
    this.toastr.error("Ops. Algo deu errado!");
  }

}
