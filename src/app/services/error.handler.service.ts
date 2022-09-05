import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { catchError, Observable, throwError } from "rxjs";
import { LocalStorageUtils } from "../utils/localstorage";

@Injectable()

export class ErrorInterceptor implements HttpInterceptor {

    localStorage: LocalStorageUtils;

    constructor(private router: Router) {
        this.localStorage = new LocalStorageUtils();
    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        return next.handle(req).pipe(catchError(error => {

            if (error instanceof HttpErrorResponse) {
                if (error.status == 401) {
                    this.localStorage.limparDadosUsuario();
                    this.router.navigate(['/auth/login']);
                }
                else if (error.status == 403) {
                    this.router.navigate(['/acesso-negado']);
                }
            }

            return throwError(error);
        }))
    }
}