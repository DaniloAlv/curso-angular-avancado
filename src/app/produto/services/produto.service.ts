import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable } from 'rxjs';
import { BaseService } from 'src/app/services/base.service';
import { FornecedorProdutoCombo, Produto } from '../models/produto';

@Injectable({
  providedIn: 'root'
})
export class ProdutoService extends BaseService {

  constructor(private httpClient: HttpClient) { 
    super();
  }

  listarProdutos(): Observable<Produto[]> {
    return this.httpClient.get<Produto[]>(`${this.UrlApiV1}/produtos`, super.ObterHeaderJson())
      .pipe(map(super.extractData), catchError(super.serviceError));
  }

  obterPorId(id: string): Observable<Produto> {
    return this.httpClient.get<Produto>(`${this.UrlApiV1}/produtos/${id}`, super.ObterAuthHeaderJson())
      .pipe(map(super.extractData), catchError(super.serviceError));
  }

  cadastrarProduto(produto: Produto): Observable<Produto> {
    return this.httpClient.post(`${super.UrlApiV1}/produtos`, produto, super.ObterAuthHeaderJson())
      .pipe(map(super.extractData), catchError(this.serviceError));
  }

  editarProduto(produto: Produto): Observable<Produto> {
    return this.httpClient.put(`${super.UrlApiV1}/produtos/${produto.id}`, produto, super.ObterAuthHeaderJson())
      .pipe(map(this.extractData), catchError(this.serviceError));
  }

  excluirProduto(id: string): Observable<any> {
    return this.httpClient.delete(`${this.UrlApiV1}/produtos/${id}`, this.ObterAuthHeaderJson())
      .pipe(map(super.extractData), catchError(super.serviceError));
  }

  obterFornecedores(): Observable<FornecedorProdutoCombo[]> {
    return this.httpClient.get<FornecedorProdutoCombo[]>(`${this.UrlApiV1}/produtos/fornecedores`, super.ObterAuthHeaderJson())
      .pipe(map(super.extractData), catchError(super.serviceError));
  }
}
