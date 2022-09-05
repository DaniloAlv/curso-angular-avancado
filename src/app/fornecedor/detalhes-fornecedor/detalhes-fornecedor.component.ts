import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';
import { Fornecedor } from '../models/fornecedor';

@Component({
  selector: 'app-detalhes-fornecedor',
  templateUrl: './detalhes-fornecedor.component.html'
})
export class DetalhesFornecedorComponent implements OnInit {

  fornecedor: Fornecedor;
  enderecoMap: any;

  constructor(private route: ActivatedRoute,
              private sanitizer: DomSanitizer) { }

  ngOnInit(): void {
    this.fornecedor = this.route.snapshot.data['fornecedor'];
    this.enderecoMap = this.sanitizer.bypassSecurityTrustResourceUrl(`https://www.google.com.br/maps/embed/v1/place?q=${this.enderecoCompleto}&key=${environment.APIKEY_GOOGLE_MAPS}`);
  }

  enderecoCompleto(): string {
    return `${this.fornecedor.endereco.logradouro}, ${this.fornecedor.endereco.numero}, ${this.fornecedor.endereco.bairro}, ${this.fornecedor.endereco.cidade}, ${this.fornecedor.endereco.uf}`;
  }

}
