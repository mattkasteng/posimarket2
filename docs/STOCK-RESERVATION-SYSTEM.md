# Sistema de Reserva de Estoque

## 📋 Visão Geral

O **Sistema de Reserva de Estoque** previne overselling garantindo que produtos não sejam vendidos acima do estoque disponível. Quando um usuário adiciona um item ao carrinho, o sistema reserva temporariamente essas unidades, impedindo que outros usuários comprem mais do que há disponível.

## ⏱️ Tempo de Expiração

**Uma reserva expira em 15 minutos** se o usuário não concluir a compra.

- **Tempo de reserva**: 15 minutos
- **Configuração**: Em `lib/stock-reservation.ts`, constante `RESERVATION_EXPIRATION_MINUTES`
- **Renovação automática**: Cada vez que o usuário atualiza a quantidade no carrinho, a reserva é renovada por mais 15 minutos

## 🔄 Como Funciona

### 1. Adicionar ao Carrinho
Quando um usuário adiciona um item ao carrinho:
- O sistema verifica se há estoque disponível (considerando reservas ativas)
- Cria uma reserva com timestamp de expiração
- Outros usuários veem o estoque reduzido

### 2. Atualizar Quantidade
Quando o usuário altera a quantidade:
- A reserva é renovada (mais 15 minutos)
- Verifica se há estoque disponível para a nova quantidade
- Atualiza a reserva

### 3. Remover do Carrinho
Quando o usuário remove um item:
- A reserva é automaticamente liberada
- O estoque fica disponível para outros usuários

### 4. Concluir Compra
No checkout:
- O estoque é consumido permanentemente
- A reserva é convertida em um pedido
- O carrinho é limpo

### 5. Expiração
Se o usuário não completar a compra em 15 minutos:
- A reserva expira automaticamente
- O estoque fica disponível novamente
- O sistema pode limpar reservas expiradas periodicamente

## 📁 Arquivos Modificados

### Schema (`prisma/schema.prisma`)
Adicionados campos ao `ItemCarrinho`:
- `reservadoDesde`: Timestamp de quando a reserva foi criada
- `expiraEm`: Timestamp de quando a reserva expira

### Biblioteca (`lib/stock-reservation.ts`)
Funções principais:
- `calculateReservationExpiration()`: Calcula quando uma reserva expira
- `reserveStock()`: Verifica e valida se há estoque disponível
- `getAvailableStock()`: Retorna estoque disponível considerando reservas
- `cleanupExpiredReservations()`: Remove reservas expiradas
- `consumeStock()`: Consome estoque quando pedido é confirmado
- `isReservationExpired()`: Verifica se uma reserva expirou

### APIs Modificadas

#### `app/api/cart/items/route.ts`
- Adiciona item ao carrinho com reserva
- Verifica estoque disponível
- Cria/atualiza reserva com expiração

#### `app/api/cart/items/[id]/route.ts`
- Atualiza quantidade e renova reserva
- Verifica estoque disponível

#### `app/api/orders/route.ts`
- Verifica estoque disponível ao criar pedido
- Consome estoque ao confirmar pedido

#### `app/api/stock-reservations/cleanup/route.ts` (NOVO)
- Endpoint para limpar reservas expiradas
- Pode ser chamado por um cron job

## 🧪 Testes

Execute o script de teste para verificar o sistema:

```bash
npx tsx scripts/test-stock-reservation.ts
```

O script testa:
- ✅ Estoque disponível inicial
- ✅ Reserva de estoque para múltiplos usuários
- ✅ Bloqueio quando estoque é insuficiente
- ✅ Liberação de estoque após remoção
- ✅ Limpeza de reservas expiradas
- ✅ Prevenção de overselling

## 🔧 Configuração

### Alterar Tempo de Expiração

Para modificar o tempo de expiração, edite em `lib/stock-reservation.ts`:

```typescript
export const RESERVATION_EXPIRATION_MINUTES = 15 // Alterar para desejado
```

### Limpeza Automática

Configure um cron job para limpar reservas expiradas periodicamente:

```bash
# A cada 5 minutos
curl -X POST http://localhost:3000/api/stock-reservations/cleanup \
  -H "Authorization: Bearer YOUR_CRON_SECRET_TOKEN"
```

Ou configure via Vercel Cron (com deploy):

```json
{
  "crons": [
    {
      "path": "/api/stock-reservations/cleanup",
      "schedule": "*/5 * * * *"
    }
  ]
}
```

## 📊 Exemplo de Uso

### Cenário: Dois usuários tentam comprar o último item

1. **Usuário A** adiciona item ao carrinho (estoque: 1)
   - Sistema reserva 1 unidade para Usuário A por 15 minutos
   - Estoque disponível: 0

2. **Usuário B** tenta adicionar o mesmo item ao carrinho
   - Sistema verifica estoque disponível: 0
   - Erro: "Estoque insuficiente"
   - Usuário B não consegue adicionar ao carrinho

3. **Cenário A**: Usuário A completa compra em 10 minutos
   - Estoque é consumido
   - Item vendido para Usuário A

4. **Cenário B**: Usuário A não completa a compra em 15 minutos
   - Reserva expira após 15 minutos
   - Estoque fica disponível novamente
   - Usuário B pode adicionar ao carrinho

## ⚠️ Pontos Importantes

1. **Raciocínio**: O sistema previne overselling mantendo reservas temporárias
2. **Performance**: Consultas otimizadas considerando apenas reservas não expiradas
3. **Limpeza**: Reservas expiradas são automaticamente ignoradas em novas reservas
4. **UX**: Usuários recebem feedback claro sobre disponibilidade de estoque
5. **Escalabilidade**: Sistema funciona com múltiplos usuários simultaneamente

## 🎯 Benefícios

- ✅ **Previne overselling**: Não vende mais do que há em estoque
- ✅ **Melhora UX**: Feedback preciso sobre disponibilidade
- ✅ **Automatizado**: Reservas expiram automaticamente
- ✅ **Robusto**: Testado em múltiplos cenários
- ✅ **Escalável**: Funciona com muitos usuários simultâneos

