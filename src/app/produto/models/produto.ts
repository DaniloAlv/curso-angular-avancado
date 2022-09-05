export interface Produto {
    id: string;
    nome: string;
    ativo: boolean;
    valor: number;
    imagem: string; // nome da imagem
    imagemUpload: string; // imagem em base64
    descricao: string;
    dataCadastro: Date;
    fornecedor: string;
}

export interface FornecedorProdutoCombo {
    fornecedorId: string;
    nomeFornecedor: string;
}