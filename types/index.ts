// Enums
export type TipoUsuario = 'ADMIN_ESCOLA' | 'PAI_VENDEDOR' | 'PAI_COMPRADOR'
export type CategoriaProduto = 'UNIFORME_NOVO' | 'UNIFORME_USADO' | 'MATERIAL_ESCOLAR' | 'LIVRO'
export type CondicaoProduto = 'NOVO' | 'SEMINOVO' | 'USADO'
export type StatusPedido = 'PENDENTE' | 'PROCESSANDO' | 'CONFIRMADO' | 'ENVIADO' | 'ENTREGUE' | 'CANCELADO'
export type StatusPagamento = 'PENDENTE' | 'PROCESSANDO' | 'APROVADO' | 'RECUSADO' | 'CANCELADO'
export type StatusHigienizacao = 'PENDENTE' | 'EM_PROCESSO' | 'CONCLUIDO'
export type MetodoPagamento = 'CARTAO_CREDITO' | 'PIX' | 'BOLETO' | 'CARTAO_PIX_BOLETO'
export type TipoSplit = 'VENDEDOR' | 'PLATAFORMA' | 'HIGIENIZACAO'
export type TipoEndereco = 'RESIDENCIAL' | 'COMERCIAL' | 'ENTREGA'

// Interfaces principais
export interface Usuario {
  id: string
  email: string
  senha: string
  nome: string
  cpf: string
  telefone: string
  tipo: TipoUsuario
  escola?: Escola
  escolaId?: string
  endereco: Endereco[]
  produtosVendidos: Produto[]
  pedidosComprador: Pedido[]
  avaliacoes: Avaliacao[]
  criadoEm: Date
  atualizadoEm: Date
  emailVerificado: boolean
  ativo: boolean
}

export interface Escola {
  id: string
  nome: string
  cnpj: string
  endereco: string
  telefone: string
  email: string
  usuarios: Usuario[]
  produtos: Produto[]
  uniformes: ConfiguracaoUniforme[]
  criadoEm: Date
  atualizadoEm: Date
}

export interface Produto {
  id: string
  nome: string
  descricao: string
  preco: number
  categoria: CategoriaProduto
  estoque: number
  condicao?: CondicaoProduto
  tamanho?: string
  cor?: string
  imagens: string[]
  vendedor: Usuario
  vendedorId: string
  escola?: Escola
  escolaId?: string
  ativo: boolean
  necessitaHigienizacao: boolean
  statusHigienizacao?: StatusHigienizacao
  avaliacoes: Avaliacao[]
  itensPedido: ItemPedido[]
  criadoEm: Date
  atualizadoEm: Date
}

export interface Pedido {
  id: string
  numero: string
  comprador: Usuario
  compradorId: string
  itens: ItemPedido[]
  total: number
  subtotal: number
  taxaServico: number
  status: StatusPedido
  pagamento?: Pagamento
  enderecoEntrega: Endereco
  enderecoEntregaId: string
  criadoEm: Date
  atualizadoEm: Date
}

export interface Pagamento {
  id: string
  pedido: Pedido
  pedidoId: string
  stripePaymentIntentId: string
  metodo: MetodoPagamento
  status: StatusPagamento
  parcelas: number
  splits: SplitPagamento[]
  criadoEm: Date
  atualizadoEm: Date
}

export interface SplitPagamento {
  id: string
  pagamento: Pagamento
  pagamentoId: string
  destinatario: string
  valor: number
  percentual: number
  tipo: TipoSplit
  criadoEm: Date
}

export interface Endereco {
  id: string
  usuario: Usuario
  usuarioId: string
  cep: string
  logradouro: string
  numero: string
  complemento?: string
  bairro: string
  cidade: string
  estado: string
  pais: string
  tipo: TipoEndereco
  principal: boolean
  pedidos: Pedido[]
  criadoEm: Date
  atualizadoEm: Date
}

export interface Avaliacao {
  id: string
  usuario: Usuario
  usuarioId: string
  produto: Produto
  produtoId: string
  nota: number
  comentario?: string
  criadoEm: Date
  atualizadoEm: Date
}

export interface ItemPedido {
  id: string
  pedido: Pedido
  pedidoId: string
  produto: Produto
  produtoId: string
  quantidade: number
  precoUnitario: number
  subtotal: number
}

export interface ConfiguracaoUniforme {
  id: string
  escola: Escola
  escolaId: string
  nome: string
  descricao?: string
  tamanhos: string[]
  cores: string[]
  precoBase: number
  ativo: boolean
  criadoEm: Date
  atualizadoEm: Date
}

// Tipos para formulários e APIs
export interface CreateUsuarioData {
  email: string
  senha: string
  nome: string
  cpf: string
  telefone: string
  tipo: TipoUsuario
  escolaId?: string
}

export interface CreateProdutoData {
  nome: string
  descricao: string
  preco: number
  categoria: CategoriaProduto
  estoque: number
  condicao?: CondicaoProduto
  tamanho?: string
  cor?: string
  imagens: string[]
  vendedorId: string
  escolaId?: string
  necessitaHigienizacao?: boolean
}

export interface CreatePedidoData {
  compradorId: string
  itens: {
    produtoId: string
    quantidade: number
    precoUnitario: number
  }[]
  enderecoEntregaId: string
  metodoPagamento: MetodoPagamento
}

export interface CreateEnderecoData {
  usuarioId: string
  cep: string
  logradouro: string
  numero: string
  complemento?: string
  bairro: string
  cidade: string
  estado: string
  tipo?: TipoEndereco
  principal?: boolean
}
