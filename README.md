# pagseguro-node2
Biblioteca de integração PagSeguro UOL com checkout transparente para Node.js

## Instalação
`npm install node-pagseguro2`

## Como Usar

### Modo Produção
```javascript
var PagSeguro = require('node-pagseguro2');

var payment = new PagSeguro({
   email: 'email@account.com',
   token: 'ABCDEFGH12345678ABCDEFGH12345678',
   currency: '' //opcional - default BRL
})
```
ou
```javascript
var PagSeguro = require('node-pagseguro2');

var payment = new PagSeguro({
   email: 'email@account.com',
   token: 'ABCDEFGH12345678ABCDEFGH12345678',
   sandbox: 0,
   sandbox_email: '123123123123123@sandbox.pagseguro.com.br'
})
```

### Modo Sandbox
Para utilizar o modo Sandbox é necessário configurar com o e-mail obtido nas configurações do [PagSeguro Sandbox](https://sandbox.pagseguro.uol.com.br) e passar o valor 1 para o parâmetro 'sandbox'.
```javascript
var payment = new PagSeguro({
   email: 'email@account.com',
   token: 'ABCDEFGH12345678ABCDEFGH12345678',
   sandbox: 1,
   sandbox_email: '123123123123123@sandbox.pagseguro.com.br'
})
```

### Dados do Comprador (Sender)
```javascript
payment.setSender({
   name: String,
   email: String,
   cpf_cnpj: String,
   area_code: String,
   phone: String,
   birth_date: String //formato dd/mm/yyyy
})
```

### Dados do Proprietário do Cartão de Crédito (CreditCardHolder)
Utilizar essa função apenas se o proprietário do cartão de crédito for diferente do comprador
```javascript
payment.setCreditCardHolder({
   name: String,
   cpf_cnpj: String,
   area_code: String,
   phone: String,
   birth_date: String //formato dd/mm/yyyy
})
```

### Dados do Endereço de Entrega (Shipping)
```javascript
payment.setShipping({
   street: String,
   number: String,
   district: String,
   city: String,
   state: String,
   postal_code: String,
   same_for_billing: Boolean //opcional, informar se o endereço de entrega for o mesmo do endereço de cobrança
})
```

### Dados do Endereço de Cobrança (Billing)
Se a propriedade `same_for_billing` do endereço de entrega (shipping) não for definido, os dados de cobrança são obrigatórios
```javascript
payment.setBilling({
   street: String,
   number: String,
   district: String,
   city: String,
   state: String,
   postal_code: String
})
```

### Adicionar Item
```javascript
payment.addItem({
   qtde: Number,
   value: Number,
   description: String
})
```

### Obter ID de Sessão
```javascript
payment.sessionId(function(err, session_id) {

});
```

### Enviar Transação
No pagamento com cartão de crédito é preciso gerar o token do cartão de crédito a partir da biblioteca do PagSeguro (https://devs.pagseguro.uol.com.br/docs/checkout-web-usando-a-sua-tela#obter-token-de-cartao)
```javascript
payment.sendTransaction({
   method: String, //'boleto' ou 'creditCard'
   credit_card_token: String, //token do cartão de crédito
   value: Number,
   installments: Number, //opcional, padrão 1
   extra_amount: Number, //opcional, padrão 0
   hash: String          //senderHash gerado pela biblioteca do PagSeguro
}, function(err, data) {

});
```
### Consultar status da transação  
```javascript
payment.transactionStatus(code: String, function(err, data) {

});
```

### Consultar status da notificação  
```javascript
payment.transactionStatus(notificationCode: String, function(err, data) {

});
```
