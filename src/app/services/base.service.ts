import { HttpErrorResponse, HttpHeaders } from "@angular/common/http";
import { throwError } from "rxjs";
import { environment } from "src/environments/environment";
import { LocalStorageUtils } from "../utils/localstorage";

export abstract class BaseService {

  protected LocalStorage = new LocalStorageUtils();
  protected UrlApiV1 = environment.BASE_URL_API;

  protected ObterHeaderJson(){
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
  }

  protected ObterAuthHeaderJson() {
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.LocalStorage.obterTokenUsuario()}`
      })
    }
  }

  protected extractData(response: any){
    return response.data || {};
  }

  protected serviceError(response: Response | any){
    let customError: string[] = [];

    if(response instanceof HttpErrorResponse){
      if(response.statusText == "Unknown Error"){
        customError.push("Ocorreu um erro desconhecido");
        response.error.errors = customError;
      }
    }

    return throwError(response);
       
  }
}
