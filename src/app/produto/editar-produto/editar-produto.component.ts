import { AfterViewInit, Component, ElementRef, OnInit, ViewChildren } from '@angular/core';
import { FormBuilder, FormControlName, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomValidators } from 'ngx-custom-validators';
import { ToastrService } from 'ngx-toastr';
import { fromEvent, merge, Observable } from 'rxjs';
import { GenericFormValidation, DisplayMessage, ValidationMessages } from 'src/app/utils/generic-form-validation';
import { GenericUtils } from 'src/app/utils/generic-utils';
import { environment } from 'src/environments/environment';
import { Produto, FornecedorProdutoCombo } from '../models/produto';
import { ProdutoService } from '../services/produto.service';

@Component({
  selector: 'app-editar-produto',
  templateUrl: './editar-produto.component.html'
})
export class EditarProdutoComponent implements OnInit, AfterViewInit {

  imagens: string = environment.pathImagens;

  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

  imagemBase64: string;
  imagemPreview: string;
  imagemNome: string;
  imagemOriginalSrc: string;

  mudancasNaoSalvas: boolean;
  errors: any[];
  validator: GenericFormValidation;
  displayMessage: DisplayMessage;
  validationMessages: ValidationMessages;

  produtoForm: FormGroup;
  produto: Produto;
  fornecedores: FornecedorProdutoCombo[];

  constructor(private fb: FormBuilder,
    private produtoService: ProdutoService,
    private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService) {

    this.errors = [];
    this.displayMessage = {};

    this.validationMessages = {
      fornecedor: {
        required: "Campo Fornecedor é obrigatório!"
      },
      nome: {
        required: "Campo Nome é obrigatório!",
        rangeLength: "O nome deve conter entre 3 a 50 caracteres."
      },
      descricao: {
        required: "Campo Descrição é obrigatório!",
        minLength: "A descrição deve ter no mínimo 3 caracteres.",
        maxLength: "A descrição deve ter no máximo 256 caracteres."
      },
      valor: {
        required: "Campo Valor é obrigatório!",
        digits: "Forneça apenas valores numéricos."
      },
      imagem: {
        required: "Campo Imagem é obrigatório!"
      }
    }

    this.validator = new GenericFormValidation(this.validationMessages);
  }

  ngOnInit(): void {
    this.produtoService.obterFornecedores()
      .subscribe(forn => this.fornecedores = forn);

    this.produtoForm = this.fb.group({
      fornecedor: ['', [Validators.required]],
      nome: ['', [Validators.required, CustomValidators.rangeLength([3, 50])]],
      descricao: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(256)]],
      valor: ['', Validators.required, CustomValidators.digits],
      ativo: ['']
    });

    this.produtoForm.patchValue({
      fornecedor: this.produto.fornecedor,
      id: this.produto.id,
      nome: this.produto.nome,
      descricao: this.produto.descricao,
      ativo: this.produto.ativo,
      valor: this.produto.valor
    });

    this.imagemOriginalSrc = `${this.imagens}${this.produto.imagem}`;
  }

  ngAfterViewInit(): void {
    let controlsBlur: Observable<any>[] = this.formInputElements.map((el: ElementRef) =>
      fromEvent(el.nativeElement, 'blur')
    );

    merge(...controlsBlur).subscribe(() => {
      this.validaFormulario();
    });
  }

  validaFormulario() {
    this.displayMessage = this.validator.processarMensagens(this.produtoForm);
    this.mudancasNaoSalvas = true;
  }

  editarProduto() {
    if (this.produtoForm.dirty && this.produtoForm.valid) {
      this.produto = Object.assign({}, this.produto, this.produtoForm.value);

      if (this.imagemBase64) {
        this.produto.imagemUpload = this.imagemBase64;
        this.produto.imagem = this.imagemNome;
      }

      this.produtoService.editarProduto(this.produto)
        .subscribe(response => {
          this.processarSucesso(response),
            error => this.processarFalha(error)
        });

      this.mudancasNaoSalvas = false;
    }
  }

  processarSucesso(response: any) {
    this.produtoForm.reset();
    this.errors = [];

    this.toastr.success(`Produto ${this.produto.nome} atualizado com sucesso!`, 'Sucesso!')
      .onHidden.subscribe(() => {
        this.router.navigate(['/produto/todos']);
      });
  }

  processarFalha(response: any) {
    this.errors = response.errors.error;
    this.toastr.error("Algo deu errado!", "Ops! :(");
  }

  handlerReader(readerEvent: any) {
    let binaryString = readerEvent.target.result;
    this.imagemBase64 = btoa(binaryString);
    this.imagemPreview = `data:image/jpeg;base64,${this.imagemBase64}`;
  }

  uploadFile(file: any) {
    this.imagemNome = file[0].name;

    var fr = new FileReader();
    fr.onload = this.handlerReader.bind(this);
    fr.readAsBinaryString(file[0]);
  }

  back() {
    GenericUtils.voltarPagina();
  }

}
