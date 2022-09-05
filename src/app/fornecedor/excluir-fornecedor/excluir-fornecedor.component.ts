import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import { Fornecedor } from '../models/fornecedor';
import { FornecedorService } from '../services/fornecedor.service';

@Component({
  selector: 'app-excluir-fornecedor',
  templateUrl: './excluir-fornecedor.component.html'
})
export class ExcluirFornecedorComponent implements OnInit {

  fornecedor: Fornecedor;
  errors: any[]
  enderecoMap: any;

  constructor(private fornecedorService: FornecedorService,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private router: Router,
    private sanitizer: DomSanitizer) { }

  ngOnInit(): void {
    this.errors = [];
    this.fornecedor = this.route.snapshot.data['fornecedor'];
    this.enderecoMap = this.sanitizer.bypassSecurityTrustResourceUrl(`https://www.google.com.br/maps/embed/v1/place?q=${this.enderecoCompleto}&key=${environment.APIKEY_GOOGLE_MAPS}`);
  }

  enderecoCompleto(): string {
    return `${this.fornecedor.endereco.logradouro}, ${this.fornecedor.endereco.numero}, ${this.fornecedor.endereco.bairro}, ${this.fornecedor.endereco.cidade}, ${this.fornecedor.endereco.uf}`;
  }

  excluirFornecedor() {
    const fornecedorId = this.route.params['id'];

    this.fornecedorService.excluir(fornecedorId)
      .subscribe(() => {
        this.processarSucesso(),
          error => this.processarFalha(error)
      });
  }

  processarSucesso() {
    this.toastr.success(`O fornecedor ${this.fornecedor.nome} foi removido com sucesso!`)
      .onHidden.subscribe(() => {
        this.router.navigate(['/fornecedor/todos']);
      });
  }

  processarFalha(response: any) {
    this.errors = response.error.errors;
    this.errors.forEach(e => this.toastr.error(e, "Ops, ocorreu um erro :("));
  }

}
