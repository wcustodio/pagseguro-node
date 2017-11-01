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
   cpf: String,
   area_code: String,
   phone: String
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

### Enviar Transação
```javascript
payment.sendTransaction({
   method: String,
   value: Number
}, function(err, data) {

});
```
