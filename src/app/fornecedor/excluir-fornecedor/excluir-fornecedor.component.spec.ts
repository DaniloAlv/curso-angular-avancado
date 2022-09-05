import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExcluirFornecedorComponent } from './excluir-fornecedor.component';

describe('ExcluirFornecedorComponent', () => {
  let component: ExcluirFornecedorComponent;
  let fixture: ComponentFixture<ExcluirFornecedorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExcluirFornecedorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExcluirFornecedorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
