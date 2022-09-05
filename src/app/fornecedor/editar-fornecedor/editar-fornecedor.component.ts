import { Component, ElementRef, OnInit, ViewChildren } from '@angular/core';
import { FormControlName, FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { utilsBr } from 'js-brasil';
import { NgBrazilValidators } from 'ng-brazil';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Observable, fromEvent, merge } from 'rxjs';
import { GenericFormValidation, DisplayMessage, ValidationMessages } from 'src/app/utils/generic-form-validation';
import { StringUtils } from 'src/app/utils/string-utils';
import { CEP } from '../models/cep';
import { Endereco } from '../models/endereco';
import { Fornecedor } from '../models/fornecedor';
import { TipoFornecedor } from '../models/tipo-fornecedor';
import { FornecedorService } from '../services/fornecedor.service';

@Component({
  selector: 'app-editar-fornecedor',
  templateUrl: './editar-fornecedor.component.html'
})
export class EditarFornecedorComponent implements OnInit {

  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

  fornecedorForm: FormGroup;
  enderecoForm: FormGroup;
  fornecedor: Fornecedor;
  endereco: Endereco;
  MASKS = utilsBr.MASKS;

  placeholderDocumento: string;
  mudancasNaoSalvas: boolean;
  errors: any[];
  errorsEndereco: any[];
  validator: GenericFormValidation;
  displayMessage: DisplayMessage;
  validationMessages: ValidationMessages;

  constructor(private fb: FormBuilder,
    private fornecedorService: FornecedorService,
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute,
    private modalService: NgbModal,
    private spinner: NgxSpinnerService) {

    this.errors = [];
    this.errorsEndereco = [];
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

    this.fornecedor = this.route.snapshot.data['fornecedor'];
  }

  ngOnInit(): void {

    this.spinner.show();

    this.fornecedorForm = this.fb.group({
      nome: ['', [Validators.required]],
      documento: ['', [Validators.required]],
      tipoFornecedor: [''],
      ativo: ['']
    });

    this.enderecoForm = this.fb.group({
      logradouro: ['', [Validators.required]],
      numero: ['', [Validators.required]],
      complemento: [''],
      bairro: ['', [Validators.required]],
      uf: ['', [Validators.required]],
      cidade: ['', [Validators.required]],
      cep: ['', [Validators.required, NgBrazilValidators.cep]],
      fornecedorId: ''
    });

    this.preencheFormulario();

    setTimeout(() => {
      this.spinner.hide();
    }, 3000);
  }

  ngAfterViewInit(): void {
    this.tipoFornecedorForm().valueChanges.subscribe(() => {
      this.validaDocumento();
      this.configurarElementosValidacao();
      this.validaFormulario();
    });

    this.configurarElementosValidacao();
  }

  preencheFormulario() {
    this.fornecedorForm.patchValue({
      id: this.fornecedor.id,
      nome: this.fornecedor.nome,
      ativo: this.fornecedor.ativo,
      tipoFornecedor: this.fornecedor.tipoFornecedor,
      documento: this.fornecedor.documento
    });

    this.enderecoForm.patchValue({
      id: this.fornecedor.endereco.id,
      logradouro: this.fornecedor.endereco.logradouro,
      numero: this.fornecedor.endereco.numero,
      complemento: this.fornecedor.endereco.complemento,
      bairro: this.fornecedor.endereco.bairro,
      cidade: this.fornecedor.endereco.cidade,
      estado: this.fornecedor.endereco.uf,
      cep: this.fornecedor.endereco.cep
    });
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
    if (cep.length < 8) return;

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

  editarFornecedor() {
    if (this.fornecedorForm.dirty && this.fornecedorForm.valid) {
      this.fornecedor = Object.assign({}, this.fornecedor, this.fornecedorForm.value);

      this.fornecedorService.atualizarFornecedor(this.fornecedor)
        .subscribe(
          response => {
            this.processarSucesso(response),
              error => this.processarFalha(error)
          }
        );
    }

    this.mudancasNaoSalvas = false;
  }

  editarEndereco() {
    if (this.enderecoForm.dirty && this.enderecoForm.valid) {
      this.endereco = Object.assign({}, this.endereco, this.enderecoForm.value);
      this.endereco.cep = StringUtils.somenteNumeros(this.endereco.cep);
      this.endereco.fornecedorId = this.fornecedor.id;

      this.fornecedorService.atualizarEndereco(this.endereco)
        .subscribe(() => {
          this.processarSucessoEndereco(this.endereco),
            err => this.processarFalhaEndereco(err);
        });
    }
  }

  processarSucesso(response: Fornecedor) {
    this.fornecedorForm.reset();
    this.errors = [];

    this.toastr.success(`Fornecedor ${response.nome} editado com sucesso!`)
      .onHidden.subscribe(() => this.router.navigate(['/fornecedor/todos']));
  }

  processarFalha(response: any) {
    this.errors = response.error.errors;
    this.toastr.error('Ocorreu um erro!', 'Ops :(');
  }

  processarSucessoEndereco(response: Endereco) {
    this.enderecoForm.reset();
    this.errorsEndereco = [];

    this.toastr.success(`Endereço atualizado com sucesso!`)
    this.fornecedor.endereco = response;
    this.modalService.dismissAll();
  }

  processarFalhaEndereco(response: any) {
    this.errorsEndereco = response.error.errors;
    this.toastr.error('Ocorreu um erro!', 'Ops :(');
  }

  abrirModal(content: any) {
    this.modalService.open(content);
  }

}
