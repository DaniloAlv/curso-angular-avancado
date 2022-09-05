import { AfterViewInit, Component, ElementRef, OnInit, ViewChildren } from '@angular/core';
import { FormBuilder, FormControlName, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomValidators } from 'ngx-custom-validators';
import { ToastrService } from 'ngx-toastr';
import { fromEvent, merge, Observable } from 'rxjs';
import { DisplayMessage, GenericFormValidation, ValidationMessages } from 'src/app/utils/generic-form-validation';
import { User } from '../models/user';
import { AuthService } from '../services/auth-service.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit, AfterViewInit {

  @ViewChildren(FormControlName, { read: ElementRef }) forminputElements: ElementRef[];

  formLogin: FormGroup;
  user: User;
  returnUrl: string = '';

  errors: any[];
  validator: GenericFormValidation;
  displayMessage: DisplayMessage;
  validationMessages: ValidationMessages;

  constructor(private fb: FormBuilder,
    private authservice: AuthService,
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute) {

    this.errors = [];
    this.displayMessage = {};

    this.validationMessages = {
      email: {
        required: "Campo e-mail é obrigatório.",
        email: "E-mail em formato inválido."
      },
      password: {
        required: "Campo senha é obrigatório.",
        rangeLength: "A senha deve ter entre 8 e 15 caracteres."
      }
    }

    this.validator = new GenericFormValidation(this.validationMessages);
  }

  ngOnInit(): void {

    this.formLogin = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, CustomValidators.rangeLength([8, 15])]]
    });

    this.returnUrl = this.route.snapshot.queryParams['returnUrl'];
  }

  ngAfterViewInit(): void {

    let controlBlurs: Observable<any>[] = this.forminputElements
      .map((er: ElementRef) =>
        fromEvent(er.nativeElement, 'blur')
      );

    merge(...controlBlurs).subscribe(() => {
      this.displayMessage = this.validator.processarMensagens(this.formLogin);
    });
  }

  login() {
    if (this.formLogin.dirty && this.formLogin.valid) {
      this.user = Object.assign({}, this.user, this.formLogin.value);

      this.authservice.login(this.user)
        .subscribe({
          next: (data) => this.processarSucesso(data),
          error: (e) => this.processarFalha(e)
        });
    }
  }

  processarSucesso(response: any) {
    this.formLogin.reset();
    this.errors = [];

    this.authservice.instanceofLocalStorage().salvarDadosLocaisUsuario(response.result);
    let user = this.authservice.instanceofLocalStorage().obterUsuario();

    this.toastr.success("Login realizado com sucesso!", `$Seja bem vindo, ${user.name}`)
      .onHidden.subscribe(() => {
        if(this.returnUrl != '') {
          this.router.navigate([this.returnUrl]);
        }else {
          this.router.navigate(['/home']);
        }
      });
  }

  processarFalha(response: any) {
    this.errors = response.error.errors;

    this.toastr.error("Ocorreram erros ao tentar realizar o login!", "Ops :(", {
      closeButton: true,
      progressBar: true
    });
  }

}
