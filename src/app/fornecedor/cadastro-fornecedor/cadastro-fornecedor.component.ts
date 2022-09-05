import { AfterViewInit, Component, ElementRef, OnInit, ViewChildren } from '@angular/core';
import { AbstractControl, FormBuilder, FormControlName, FormGroup, Validators } from '@angular/forms';
import { NgBrazilValidators } from 'ng-brazil';
import { utilsBr } from 'js-brasil';
import { GenericFormValidation, DisplayMessage, ValidationMessages } from 'src/app/utils/generic-form-validation';
import { Fornecedor } from '../models/fornecedor';
import { fromEvent, merge, Observable } from 'rxjs';
import { TipoFornecedor } from '../models/tipo-fornecedor';
import { FornecedorService } from '../services/fornecedor.service';
import { CEP } from '../models/cep';
import { StringUtils } from 'src/app/utils/string-utils';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cadastro-fornecedor',
  templateUrl: './cadastro-fornecedor.component.html'
})
export class CadastroFornecedorComponent implements OnInit, AfterViewInit {

  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

  fornecedorForm: FormGroup;
  fornecedor: Fornecedor;
  MASKS = utilsBr.MASKS;

  placeholderDocumento: string;
  mudancasNaoSalvas: boolean;
  errors: any[];
  validator: GenericFormValidation;
  displayMessage: DisplayMessage;
  validationMessages: ValidationMessages;

  constructor(private fb: FormBuilder,
              private fornecedorService: FornecedorService,
              private toastr: ToastrService,
              private router: Router) {

    this.errors = [];
    this.displayMessage = {};
    this.placeholderDocumento = 'CPF requerido';

    this.validationMessages = {
      nome: {
        required: "O campo Nome é obrigatório."
      },
      documento: {
        required: "O campo Documento é obrigatório.",
        cpf: "CPF em formato inválido",
        cnpj: "CNPJ em formato inválido"
      },
      logradouro: {
        required: "O campo Logradouro é obrigatório."
      },
      numero: {
        required: "O campo Número é obrigatório."
      },
      bairro: {
        required: "O campo Bairro é obrigatório."
      },
      cep: {
        required: "O campo CEP é obrigatório.",
        cep: "CEP em formato inválido."
      },
      uf: {
        required: "O campo Estado é obrigatório."
      },
      cidade: {
        required: "O campo Cidade é obrigatório."
      }
    };

    this.validator = new GenericFormValidation(this.validationMessages);
  }

  ngOnInit(): void {

    this.fornecedorForm = this.fb.group({
      nome: ['', [Validators.required]],
      documento: ['', [Validators.required]],
      tipoFornecedor: [''],
      ativo: [''],

      endereco: this.fb.group({
        logradouro: ['', [Validators.required]],
        numero: ['', [Validators.required]],
        complemento: [''],
        bairro: ['', [Validators.required]],
        uf: ['', [Validators.required]],
        cidade: ['', [Validators.required]],
        cep: ['', [Validators.required, NgBrazilValidators.cep]]
      })
    });

    this.fornecedorForm.patchValue({
      ativo: true,
      tipoFornecedor: 1
    });
  }

  ngAfterViewInit(): void {
    
    this.tipoFornecedorForm().valueChanges.subscribe(() => {
      this.validaDocumento();
      this.configurarElementosValidacao();
      this.validaFormulario();
    });

    this.configurarElementosValidacao();
  }

  configurarElementosValidacao() {
    let controlsBlur: Observable<any>[] = this.formInputElements.map((el: ElementRef) =>
      fromEvent(el.nativeElement, 'blur')
    );

    merge(...controlsBlur).subscribe(() => {
      this.validaFormulario();
    });
  }

  validaFormulario() {
    this.displayMessage = this.validator.processarMensagens(this.fornecedorForm);
    this.mudancasNaoSalvas = true;
  }

  validaDocumento() {
    if (this.tipoFornecedorForm().value == TipoFornecedor.PESSOA_FISICA) {
      this.fornecedorForm.get('documento').clearValidators();
      this.fornecedorForm.setValidators([Validators.required, NgBrazilValidators.cep]);
      this.placeholderDocumento = "CPF requerido";
    }
    else {
      this.fornecedorForm.get('documento').clearValidators();
      this.fornecedorForm.setValidators([Validators.required, NgBrazilValidators.cnpj]);
      this.placeholderDocumento = "CNPJ requerido";
    }
  }

  tipoFornecedorForm(): AbstractControl {
    return this.fornecedorForm.get('tipoFornecedor');
  }

  consultaCEP(cep: string) {

    cep = StringUtils.somenteNumeros(cep);
    if(cep.length < 8) return;

    this.fornecedorService.obterCEP(cep)
      .subscribe(
        response => {
          this.preencherEnderecoPorCep(response),
          error => this.errors.push(error)
        }
      );
  }

  preencherEnderecoPorCep(response: CEP) {
    this.fornecedorForm.patchValue({
      endereco: {
        logradouro: response.logradouro,
        bairro: response.bairro,
        cep: response.cep,
        cidade: response.localidade,
        estado: response.uf
      }
    });
  }

  cadastrarFornecedor() {
    if (this.fornecedorForm.dirty && this.fornecedorForm.valid) {
      this.fornecedor = Object.assign({}, this.fornecedor, this.fornecedorForm.value);
      
      this.fornecedorService.cadastrar(this.fornecedor)
        .subscribe(
          response => {
            this.processarSucesso(response),
            error => this.processarFalha(error)
          }
        );
    }
  }

  processarSucesso(response: Fornecedor) {
    this.fornecedorForm.reset();
    this.errors = [];

    this.mudancasNaoSalvas = false;

    this.toastr.success(`Fornecedor ${response.nome} cadastrado com sucesso!`, 'Sucesso')
      .onHidden.subscribe(() => this.router.navigate(['/fornecedor/todos']));
  }

  processarFalha(response: any) {
    this.errors = response.error.errors;
    this.toastr.error('Ocorreu um erro!', 'Ops :(');
  }

}
