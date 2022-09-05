import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Fornecedor } from '../models/fornecedor';
import { FornecedorService } from '../services/fornecedor.service';

@Component({
  selector: 'app-listar-fornecedores',
  templateUrl: './listar-fornecedores.component.html'
})
export class ListarFornecedoresComponent implements OnInit {

  fornecedores: Fornecedor[];

  constructor(private router: Router,
              private fornecedorService: FornecedorService,
              private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    this.spinner.show();
    this.obterFornecedores();

    setTimeout(() => {
      this.spinner.hide(),
      3000
    });
  }

  navegarParaCadastroFornecedor() {
    this.router.navigate(['/fornecedor/cadastro']);
  }

  obterFornecedores() {
    this.fornecedorService.obterTodos()
      .subscribe(response => {
        this.fornecedores = response;
      });
  }

}
