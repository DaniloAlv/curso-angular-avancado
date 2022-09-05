import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable } from 'rxjs';
import { BaseService } from 'src/app/services/base.service';
import { CEP } from '../models/cep';
import { Endereco } from '../models/endereco';
import { Fornecedor } from '../models/fornecedor';

@Injectable({
  providedIn: 'root'
})
export class FornecedorService extends BaseService {

  constructor(private httpClient: HttpClient) {
    super();
  }

  obterTodos(): Observable<Fornecedor[]> {
    return this.httpClient.get<Fornecedor[]>(`${this.UrlApiV1}/fornecedores`, this.ObterHeaderJson())
      .pipe(catchError(super.serviceError));
  }

  obterPorId(id: string): Observable<Fornecedor> {

    return this.httpClient.get<Fornecedor>(`${this.UrlApiV1}/fornecedores/${id}`, this.ObterHeaderJson())
      .pipe(catchError(super.serviceError));
  }

  cadastrar(fornecedor: Fornecedor): Observable<Fornecedor> {

    return this.httpClient.post(`${this.UrlApiV1}/fornecedores`, fornecedor, this.ObterAuthHeaderJson())
      .pipe(
        map(this.extractData),
        catchError(this.serviceError)
      );
  }

  atualizarFornecedor(fornecedor: Fornecedor): Observable<Fornecedor> {

    return this.httpClient.put(`${this.UrlApiV1}/fornecedores`, fornecedor, this.ObterAuthHeaderJson())
      .pipe(
        map(this.extractData),
        catchError(this.serviceError)
      );
  }

  atualizarEndereco(endereco: Endereco): Observable<Endereco> {
    return this.httpClient.put(`${this.UrlApiV1}/fornecedores/endereco/${endereco.id}`, endereco, this.ObterAuthHeaderJson())
      .pipe(map(this.extractData, 
        catchError(this.serviceError)));
  }

  excluir(id: string): Observable<Fornecedor> {

    return this.httpClient.delete(`${this.UrlApiV1}/fornecedores/${id}`, this.ObterAuthHeaderJson())
      .pipe(
        map(this.extractData),
        catchError(this.serviceError)
      );
  }

  obterCEP(cep: string): Observable<CEP> {

    return this.httpClient.get<CEP>(`https://viacep.com.br/ws/${cep}/json/`, this.ObterHeaderJson())
      .pipe(
        catchError(super.serviceError)
      );
  }
}
