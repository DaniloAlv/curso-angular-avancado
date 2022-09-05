import { Component, ElementRef, OnInit, ViewChildren } from '@angular/core';
import { FormBuilder, FormControlName, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CustomValidators } from 'ngx-custom-validators';
import { Dimensions, ImageCroppedEvent, ImageTransform } from 'ngx-image-cropper';
import { ToastrService } from 'ngx-toastr';
import { GenericFormValidation, DisplayMessage, ValidationMessages } from 'src/app/utils/generic-form-validation';
import { FornecedorProdutoCombo, Produto } from '../models/produto';
import { ProdutoService } from '../services/produto.service';

@Component({
  selector: 'app-cadastro-produto',
  templateUrl: './cadastro-produto.component.html'
})
export class CadastroProdutoComponent implements OnInit {

  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

  imageChangedEvent: any = '';
  croppedImage: string = '';
  canvasRotation = 0;
  rotation = 0;
  scale = 1;
  showCropper = false;
  containWithinAspectRatio = false;
  transform: ImageTransform = {};
  imageURL: string;
  nomeImagem: string;

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
              private toastr: ToastrService,
              private router: Router) { 

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
    this.produtoForm = this.fb.group({
      fornecedor: ['', [Validators.required]],
      nome: ['', [Validators.required, CustomValidators.rangeLength([3, 50])]],
      descricao: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(256)]],
      valor: ['', Validators.required, CustomValidators.digits],
      imagem: ['', Validators.required],
      ativo: ['']
    });
  }

  cadastrarProduto() {
    if(this.produtoForm.dirty && this.produtoForm.valid) {
      this.produto = Object.assign({}, this.produto, this.produtoForm.value);

      this.produto.imagem = this.nomeImagem;
      this.produto.valor = parseFloat(this.produtoForm.get('valor').value);
      this.produto.imagemUpload = this.croppedImage.split(',')[1];

      this.produtoService.cadastrarProduto(this.produto)
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

    this.toastr.success(`Produto ${this.produto.nome} cadastrado com sucesso!`, 'Sucesso!')
      .onHidden.subscribe(() => {
        this.router.navigate(['/produto/todos']);
      });
  }

  processarFalha(response: any) {
    this.errors = response.errors.error;
    this.toastr.error("Algo deu errado!", "Ops! :(");
  }

  fileChangeEvent(event: any) {
    this.imageChangedEvent = event;
    this.nomeImagem = event.currentTarget.files[0].name;
  }

  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
  }

  imageLoaded() {
    this.showCropper = true;
  }

  cropperReady(sourceImageDimensions: Dimensions) {
    console.log("Cropper ready", sourceImageDimensions);
  }

  loadImageFailed() {
    this.errors.push(`Formato do arquivo ${this.nomeImagem} não é permitido!`);
  }

}
