import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExcluirProdutoComponent } from './excluir-produto.component';

describe('ExcluirProdutoComponent', () => {
  let component: ExcluirProdutoComponent;
  let fixture: ComponentFixture<ExcluirProdutoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExcluirProdutoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExcluirProdutoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
