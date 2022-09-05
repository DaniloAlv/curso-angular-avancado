import { Pipe, PipeTransform } from '@angular/core';
import { TipoFornecedor } from '../models/tipo-fornecedor';

@Pipe({
  name: 'formataTipoFornecedor'
})
export class FormataTipoFornecedorPipe implements PipeTransform {

  transform(value: number): string {
    if (value === TipoFornecedor.PESSOA_FISICA){
      return "Pessoa Fisíca";
    }

    return "Pessoa Jurídica";
  }

}
