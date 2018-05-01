/**
 * Copyright (c) 2017-present, Gifto Wallet, Inc. All rights reserved.

 *	Features
 	-	GUI Home
 	-	Create Wallet
 	-	View Wallet address
 	-	Transfer Gifto
 	-	View transactin History

 *	APIs List:
 	-	Create Gifto Wallet using identity data and password
	-	Get Gifto Wallet Detail of an account using identity data
	-	Transfer Gifto from an account to another account using wallet address
	-	Transfer Gifto from an account to another account using identity data (Tipping)
	-	Get History of Transferring Gifto (Sent and Received, include Transfer and Tipping)
 */
function GiftoWallet (options) {
	this.giftoAPI = {};
	this.Validation = {
		walletCreate: function() { return true; },
		walletDetail: function() { return true; },
		walletTransfer: function() { return true; },
		walletListTransaction: function() { return true; }
	};

	/**
	 *	Validation: Messages
	 */
	 this.messages = {
	 	required: "<b>@field_name</b> is required.",
	 	email: "<b>@field_name:</b> please enter with the right email.",
	 	password: "<b>@field_name:</b> The length must be greater than 5.",
	 	maximum: "<b>@field_name:</b> The length must be smaller than 15."
	 };

	if( typeof(window.GiftoSDKApi) != 'undefined' ) {
		this.giftoAPI = window.GiftoSDKApi;
		
		if ( options != null && typeof options.apikey === 'string' && options.apikey.trim().length > 0 ) {
			this.giftoAPI.init({
				apikey: options.apikey
			});
		} else {
			console.error('Missing apikey to init.')	
		}

	} else {
		console.error('Missing gifto-sdk-api.')
	}

}
/**
 *	Gifto Callback for Demo Site
 */
 GiftoWallet.prototype.gwCallbackForDemo = function (form_id, response) {
 	(function($){
 		var body = $('body');
 		if ( body.hasClass('gw-demo') ) {
 			var wrapper = $('#' + form_id);
 			var codeElement = wrapper.find('.code-result');

 			if ( codeElement.length == 0) {
 				codeElement = $('<pre class="code-result"></pre>');
 				wrapper.append(codeElement);
 			}

 			var formatted = renderjson(response);
 			
 			codeElement.html(formatted);
			
 		}

 	}(jQuery));
 }
/**
 *	Create Wallet
 */
GiftoWallet.prototype.gwCreateWallet = function (form_id) {
	
	var $this = this;

	if ( form_id == undefined || form_id == null ) {
				
		console.error('Create new wallet missing formId');
		return false;

	} else {

		var FormApi = document.getElementById(form_id);
		var formData = new FormData(FormApi);
		
		//== Validate form data
		var validationResult = this.createWalletValidation(formData);
		if ( validationResult.length > 0 ) {
			this.showValidateError(validationResult);
			return false;
		}

		var requestApi = {
			identityData: formData.get('gw_identityData'),
			firstname: formData.get('gw_firstname'),
			lastname: formData.get('gw_lastname'),
			passphrase: formData.get('gw_passphrase')
		};
		
		var result = this.giftoAPI.createWallet(requestApi, function(response){
			$this.gwCallbackForDemo(form_id, response);
			FormApi.reset();
		});
	}	
}

//== Validate Create Wallet Form
GiftoWallet.prototype.createWalletValidation = function (form_data) {
	var errors = [];

	//== Identity Data
	var identityData = form_data.get('gw_identityData');
	if ( !this.gwValidateRequired( identityData ) ) {
		errors.push( GiftoWallet.validateGenerateError('required', 'Email') );
	} else if ( !this.gwValidateEmail( identityData) ) {
		errors.push( GiftoWallet.validateGenerateError('email', 'Email') );
	}

	//== Firstname
	var firstname = form_data.get('gw_firstname');
	if ( !this.gwValidateRequired(firstname) ) {
		errors.push( GiftoWallet.validateGenerateError('required', 'Firstname') );
	} else if ( !this.gwValidateMax( firstname, 15) ) {
		errors.push( GiftoWallet.validateGenerateError('maximum', 'Firstname') );
	}

	//== Firstname
	var lastname = form_data.get('gw_lastname');
	if ( !this.gwValidateRequired(lastname) ) {
		errors.push( GiftoWallet.validateGenerateError('required', 'Lastname') );
	} else if ( !this.gwValidateMax( lastname, 15) ) {
		errors.push( GiftoWallet.validateGenerateError('maximum', 'Lastname') );
	}

	//== Passphrase
	var passphrase = form_data.get('gw_passphrase');
	if ( !this.gwValidateRequired(passphrase) ) {
		errors.push( GiftoWallet.validateGenerateError('required', 'Passphrase') );
	} else if ( !this.gwValidatePassword( passphrase) ) {
		errors.push( GiftoWallet.validateGenerateError('password', 'Passphrase') );
	}

	return errors;
}

/**
 *	Get Wallet Detail
 */
GiftoWallet.prototype.gwGetWalletDetail = function (form_id) {
	
	var $this = this;

	if ( form_id == undefined || form_id == null ) {
				
		console.error('Detail wallet missing formId');
		return false;

	} else {

		var FormApi = document.getElementById(form_id);
		var formData = new FormData(FormApi);

		//== Validate form data
		var validationResult = this.detailWalletValidation(formData);
		if ( validationResult.length > 0 ) {
			this.showValidateError(validationResult);
			return false;
		}
		
		var requestApi = {
			identityData: formData.get('gw_identityData')
		};
		
		var result = this.giftoAPI.detailWallet(requestApi, function(response){
			$this.gwCallbackForDemo(form_id, response);
			FormApi.reset();
		});

		return true;
	}
}

//== Validate Detail Wallet Form Validation
GiftoWallet.prototype.detailWalletValidation = function (form_data) {
	var errors = [];

	//== Identity Data
	var identityData = form_data.get('gw_identityData');
	if ( !this.gwValidateRequired( identityData ) ) {
		errors.push( GiftoWallet.validateGenerateError('required', 'Email') );
	} else if ( !this.gwValidateEmail( identityData) ) {
		errors.push( GiftoWallet.validateGenerateError('email', 'Email') );
	}

	return errors;
}
/**
 *	Get Transfer Gifto
 */
GiftoWallet.prototype.gwTransferGifto = function (form_id) {
	
	var $this = this;

	if ( form_id == undefined || form_id == null ) {
				
		console.error('Tranfer Gifto missing formId');
		return false;

	} else {

		var FormApi = document.getElementById(form_id);
		var formData = new FormData(FormApi);

		//== Validate form data
		var validationResult = this.transferWalletValidation(formData);
		if ( validationResult.length > 0 ) {
			this.showValidateError(validationResult);
			return false;
		}
		
		var requestApi = {
			identityData: formData.get('gw_identityData'),
			currencyCode: formData.get('gw_currencyCode'),
			passphrase: formData.get('gw_passphrase'), 

			toWalletAddress: formData.get('gw_toWalletAddress'),
			amount: formData.get('gw_amount'),
			referenceId: formData.get('gw_referenceId'),
			note: formData.get('gw_note'),

			transferFeeType: formData.get('gw_transferFeeType'), 
			type: formData.get('gw_type'),
		};
		
		var result = this.giftoAPI.transferCoin(requestApi, function(response){
			$this.gwCallbackForDemo(form_id, response);
			FormApi.reset();
		});

		return true;
	}
}
//== Validate Transfer Gifto Wallet Form validation
GiftoWallet.prototype.transferWalletValidation = function (form_data) {
	var errors = [];

	//== Identity Data
	var identityData = form_data.get('gw_identityData');
	if ( !this.gwValidateRequired( identityData ) ) {
		errors.push( GiftoWallet.validateGenerateError('required', 'Email') );
	} else if ( !this.gwValidateEmail( identityData) ) {
		errors.push( GiftoWallet.validateGenerateError('email', 'Email') );
	}

	//== Amount
	var amount = form_data.get('gw_amount');
	if ( !this.gwValidateRequired(amount) ) {
		errors.push( GiftoWallet.validateGenerateError('required', 'Amount') );
	}

	//== Currency Code
	var currencyCode = form_data.get('gw_currencyCode');
	if ( !this.gwValidateRequired(currencyCode) ) {
		errors.push( GiftoWallet.validateGenerateError('required', 'Currency Code') );
	}

	//== Passphrase
	var passphrase = form_data.get('gw_passphrase');
	if ( !this.gwValidateRequired(passphrase) ) {
		errors.push( GiftoWallet.validateGenerateError('required', 'Passphrase') );
	} else if ( !this.gwValidatePassword( passphrase) ) {
		errors.push( GiftoWallet.validateGenerateError('password', 'Passphrase') );
	}

	//== Wallet Address
	var walletAddress = form_data.get('gw_toWalletAddress');
	if ( !this.gwValidateRequired(walletAddress) ) {
		errors.push( GiftoWallet.validateGenerateError('required', "Wallet Address") );
	}

	return errors;
}
/**
 *	Get List Transaction
 */
GiftoWallet.prototype.gwListTransactions = function (form_id) {
	
	var $this = this;

	if ( form_id == undefined  || form_id == null ) {
				
		console.error('Get list transactions formId');
		return false;

	} else {

		var FormApi = document.getElementById(form_id);
		var formData = new FormData(FormApi);

		//== Validate form data
		var validationResult = this.listTransactionValidation(formData);
		if ( validationResult.length > 0 ) {
			this.showValidateError(validationResult);
			return false;
		}
		
		var requestApi = {
			identityData: formData.get('gw_identityData'),
			offset: formData.get('gw_offset'),
			limit: formData.get('gw_limit'),
			transactionType: formData.get('gw_transactionType'),
			transactionMode: formData.get('gw_transactionMode')
		};
		
		var result = this.giftoAPI.listTransactions(requestApi, function(response){
			$this.gwCallbackForDemo(form_id, response);
			FormApi.reset();
		});
		
	}
}
//== Validate Transfer Gifto Wallet Form validation
GiftoWallet.prototype.listTransactionValidation = function (form_data) {
	var errors = [];

	//== Identity Data
	var identityData = form_data.get('gw_identityData');
	if ( !this.gwValidateRequired( identityData ) ) {
		errors.push( GiftoWallet.validateGenerateError('required', 'Email') );
	} else if ( !this.gwValidateEmail( identityData) ) {
		errors.push( GiftoWallet.validateGenerateError('email', 'Email') );
	}

	return errors;
}	

 /**
  *	Validation: Generate Error
  */
 GiftoWallet.prototype.validateGenerateError = function (error, field_name) {
 	var msg = this.messages[error];
 	msg = msg.replace('@field_name', field_name);
 	return msg;
}

 /**
  *	Validation: Generate Error
  */
 GiftoWallet.prototype.showValidateError = function (errors) {
 	var iLoop = 0;
 	var messages = '';
 	for (iLoop = 0; iLoop < errors.length; iLoop++) {
 		messages += '<p>';
 		messages += errors[iLoop];
 		messages += '</p>';
 	}
 	
 	UIkit.notification(messages, 'danger');
}
/**
 *	Validation: Required Validate
 */
GiftoWallet.prototype.gwValidateRequired = function (value) {
 	if ( value == undefined || value == null || (typeof value == "string" && value.trim().length == 0 ) ) {
 		return false;
 	} else {
 		return true;
 	}
}
/**
 *	Validation: Gifto Email
 */
GiftoWallet.prototype.gwValidateEmail = function (email) {
 	
 	var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    
    return re.test(email);
}
/**
 *	Validation: Gifto Password
 */

 GiftoWallet.prototype.gwValidatePassword = function (password) {
  	return password.length > 5;
 }
/**
 *	Validate Maximum
 */
 GiftoWallet.prototype.gwValidateMax = function (text, number) {
  	return text.length < number;
 }