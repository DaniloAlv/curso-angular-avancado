import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';
import { Produto } from '../models/produto';

@Component({
  selector: 'app-detalhes-produto',
  templateUrl: './detalhes-produto.component.html'
})
export class DetalhesProdutoComponent implements OnInit {

  imagens: string = environment.pathImagens;
  produto: Produto;

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.produto = this.route.snapshot.data['produto'];
  }

}
