import { AfterViewInit, Component, ElementRef, OnInit, ViewChildren } from '@angular/core';
import { FormBuilder, FormControl, FormControlName, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CustomValidators } from 'ngx-custom-validators';
import { ToastrService } from 'ngx-toastr';
import { fromEvent, merge, Observable } from 'rxjs';
import { DisplayMessage, GenericFormValidation, ValidationMessages } from 'src/app/utils/generic-form-validation';
import { User } from '../models/user';
import { AuthService } from '../services/auth-service.service';

@Component({
  selector: 'app-cadastro',
  templateUrl: './cadastro.component.html'
})

export class CadastroComponent implements OnInit, AfterViewInit {

  @ViewChildren(FormControlName, { read: ElementRef }) formInpiutElements: ElementRef[];

  formCadastro: FormGroup;
  user: User;
  dadosNaoSalvos: boolean;

  errors: any[];
  validator: GenericFormValidation;
  displayMessage: DisplayMessage;
  validationMessages: ValidationMessages;

  constructor(private fb: FormBuilder,
    private authService: AuthService,
    private toastr: ToastrService,
    private router: Router) {

    this.errors = [];
    this.displayMessage = {};

    this.validationMessages = {
      email: {
        required: "O campo e-mail é obrigatório.",
        email: "E-mail em formato inválido."
      },
      password: {
        required: "O campo senha é obrigatório.",
        rangeLength: "A senha deve conter entre 8 e 15 caracteres."
      },
      confirmPassword: {
        required: "O campo senha é obrigatório.",
        rangeLength: "A senha deve conter entre 8 e 15 caracteres.",
        equalTo: "As senhas informadas não conferem."
      }
    };

    this.validator = new GenericFormValidation(this.validationMessages);
  }

  ngOnInit(): void {

    let senha = new FormControl('', [Validators.required, CustomValidators.rangeLength([8, 15])]);
    let confirmaSenha = new FormControl('', [Validators.required, CustomValidators.rangeLength([8, 15]), CustomValidators.equalTo(senha)]);

    this.formCadastro = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: senha,
      confirmPassword: confirmaSenha
    });
  }

  ngAfterViewInit(): void {
    let controlBlurs: Observable<any>[] = this.formInpiutElements
      .map((fc: ElementRef) => fromEvent(fc.nativeElement, 'blur'));

    merge(...controlBlurs).subscribe(() => {
      this.displayMessage = this.validator.processarMensagens(this.formCadastro);
      this.dadosNaoSalvos = true;
    });
  }

  cadastrarUsuario() {
    if (this.formCadastro.dirty || this.formCadastro.valid) {
      this.user = Object.assign({}, this.user, this.formCadastro.value);

      this.authService.cadastrarUsuario(this.user)
        .subscribe({
          next: (data) => this.processarSucesso(data),
          error: (e) => this.processarErros(e)
        });

      this.dadosNaoSalvos = false;
    }
  }

  processarSucesso(response: any) {
    this.formCadastro.reset();
    this.errors = [];

    this.authService.instanceofLocalStorage().salvarDadosLocaisUsuario(response.data);

    this.toastr.success("Cadastro realizado com sucesso!", "Bem vindo")
      .onHidden.subscribe(() => {
        this.router.navigate(['/home']);
      });
  }

  processarErros(erros: any) {
    this.errors = erros.error.errors;

    this.toastr.error("Não foi possível concluir o cadastro, ocorreram erros.", "Ops :(", {
      progressBar: true,
      closeButton: true,
    });
  }
}
