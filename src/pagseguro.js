const request = require('request');
const xmlParser = require('xml2json');

const pagseguro = function(params) {
    this.email = params.email;
    this.token = params.token;
    this.mode = params.sandbox == true ? 'sandbox' : 'prod';
    this.currency = params.currency || 'BRL';
    this.sandbox_email = params.sandbox_email;

    switch (this.mode) {
        case 'prod': this.url = 'https://ws.pagseguro.uol.com.br/v2'; break;
        case 'sandbox': this.url = 'https://ws.sandbox.pagseguro.uol.com.br/v2'; break;
    }

    this.checkoutData = {
        email: this.email,
        token: this.token,
        mode: this.mode,
        currency: this.currency,
        url: this.url
    }

    this.items = [];
}

pagseguro.prototype.setSender = function(sender) {
    this.checkoutData.senderName = sender.name;
    this.checkoutData.senderAreaCode = sender.area_code;
    this.checkoutData.senderPhone = sender.phone;
    this.checkoutData.senderEmail = this.mode == 'sandbox' ? this.sandbox_email : sender.email;

    if (sender.cpf_cnpj.length == 11) {
        this.checkoutData.senderCPF = sender.cpf_cnpj;
    } else {
        this.checkoutData.senderCNPJ = sender.cpf_cnpj;
    }

    this.sender = sender;
}

pagseguro.prototype.setShipping = function(shipping) {
    this.checkoutData.shippingAddressStreet = shipping.street;
    this.checkoutData.shippingAddressNumber = shipping.number;
    this.checkoutData.shippingAddressDistrict = shipping.district;
    this.checkoutData.shippingAddressCity = shipping.city;
    this.checkoutData.shippingAddressState = shipping.state;
    this.checkoutData.shippingAddressPostalCode = shipping.postal_code;
    this.checkoutData.shippingAddressCountry = shipping.country || 'BRA';

    if (shipping.same_for_billing) {
        this.setBilling(shipping);
    }

    this.shipping = shipping;
}

pagseguro.prototype.setBilling = function(billing) {
    this.checkoutData.billingAddressStreet = billing.street;
    this.checkoutData.billingAddressNumber = billing.number;
    this.checkoutData.billingAddressDistrict = billing.district;
    this.checkoutData.billingAddressCity = billing.city;
    this.checkoutData.billingAddressState = billing.state;
    this.checkoutData.billingAddressPostalCode = billing.postal_code;
    this.checkoutData.billingAddressCountry = billing.country || 'BRA';

    this.billing = billing;
}

pagseguro.prototype.setCreditCardHolder = function(holder) {    
    this.holder = holder;
}

pagseguro.prototype.addItem = function(item) {
    this.items.push({
        qtde: item.qtde,
        value: item.value,
        description: item.description
    })

    this.checkoutData['itemQuantity' + (this.items.length)] = item.qtde;
    this.checkoutData['itemAmount' + (this.items.length)] = item.value.toFixed(2);
    this.checkoutData['itemId' + (this.items.length)] = this.items.length;
    this.checkoutData['itemDescription' + (this.items.length)] = item.description;
}

pagseguro.prototype.sendTransaction = function(transaction, cb) {
    this.checkoutData.paymentMethod = transaction.method;
    this.checkoutData.installmentQuantity = transaction.installments || 1;
    this.checkoutData.installmentValue = (transaction.value / transaction.installments).toFixed(2);
    this.checkoutData.senderHash = transaction.hash;

    if (transaction.installments && transaction.installments > 1) {
        this.checkoutData.noInterestInstallmentQuantity = transaction.installments;
    }

    if (this.checkoutData.paymentMethod == 'creditCard') {
        this.checkoutData.creditCardToken = transaction.credit_card_token;
        this.checkoutData.creditCardHolderName = this.holder ? this.holder.name : this.sender.name;
        this.checkoutData.creditCardHolderAreaCode = this.holder ? this.holder.area_code : this.sender.area_code;
        this.checkoutData.creditCardHolderPhone = this.holder ? this.holder.phone : this.sender.phone;
        this.checkoutData.creditCardHolderBirthDate = this.holder ? this.holder.birth_date : this.sender.birth_date;

        let cpf_cnpj = this.holder ? this.holder.cpf_cnpj : this.sender.cpf_cnpj
        if (cpf_cnpj.length == 11) {
            this.checkoutData.creditCardHolderCPF = cpf_cnpj;
        } else {
            this.checkoutData.creditCardHolderCNPJ = cpf_cnpj;
        }
    }

    const params = {
        url: this.url + '/transactions?token=' + this.token + '&email=' + this.email,
        form: this.checkoutData
    }

    request.post(params, function(err, response, body) {
        if (err) {
            return cb(err, false);
        } else if (response.statusCode == 200) {
            const json = JSON.parse(xmlParser.toJson(body));
            return cb(false, json.transaction);
        } else {
            const json = JSON.parse(xmlParser.toJson(body));
            if (json.errors && json.errors.error) {
                return cb(json.errors.error, false);
            }

            return cb(body, false);
        }
    })
}

pagseguro.prototype.sessionId = function(cb) {    
    const url = this.url + '/sessions?token=' + this.token + '&email=' + this.email;

    request.post({ url: url }, function(err, response, body) {
        if (err) {
            return cb(err, false);
        } else if (response.statusCode == 200) {
            const json = JSON.parse(xmlParser.toJson(body));
            return cb(false, json.session.id);
        } else {
            const json = JSON.parse(xmlParser.toJson(body));
            if (json.errors && json.errors.error) {
                return cb(json.errors.error, false);
            }

            return cb(body, false);
        }
    })
}

pagseguro.prototype.transactionStatus = function(code, cb) {
    request.get({ url: this.url + '/transactions/' + code + '?token=' + this.token + '&email=' + this.email }, function(err, response, body) {
        if (err) {
            return cb(err, false);
        } else if (response.statusCode == 200) {
            const json = JSON.parse(xmlParser.toJson(body));

            let status = '';
            switch (json.transaction.status) {
                case '1': status = 'Aguardando Pagamento'; break;
                case '2': status = 'Em Análise'; break;
                case '3': status = 'Paga'; break;
                case '4': status = 'Disponível'; break;
                case '5': status = 'Em Disputa'; break;
                case '6': status = 'Devolvida'; break;
                case '7': status = 'Cancelada'; break;
            }

            return cb(false, {
                code: json.transaction.status,
                status: status,
                date: json.transaction.date
            });
        } else {
            const json = JSON.parse(xmlParser.toJson(body));
            if (json.errors && json.errors.error) {
                return cb(json.errors.error, false);
            }

            return cb(body, false);
        }
    })
}

module.exports = pagseguro;