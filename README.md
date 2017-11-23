# pagseguro-node
Biblioteca de integração PagSeguro UOL com checkout transparente para Node.js

## Instalação
`npm install node-pagseguro`

## Como Usar

### Modo Produção
```javascript
var PagSeguro = require('node-pagseguro');

var payment = new PagSeguro({
   email: 'email@account.com',
   token: 'ABCDEFGH12345678ABCDEFGH12345678',
   currency: '' //opcional - default BRL
})
```

### Modo Sandbox
Para utilizar o modo Sandbox é necessário configurar com o e-mail obtido nas configurações do [PagSeguro Sandbox](https://sandbox.pagseguro.uol.com.br).
```javascript
var payment = new PagSeguro({
   email: 'email@account.com',
   token: 'ABCDEFGH12345678ABCDEFGH12345678',
   sandbox: true,
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
```javascript
payment.sendTransaction({
   method: String, //'boleto' ou 'creditCard'
   value: Number,
   installments: Number, //opcional, padrão 1
   hash: String //senderHash gerado pela biblioteca do PagSeguro
}, function(err, data) {

});
```
