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
(function(window){
	function GiftoSdkHTML () {
		var _myGiftoSdkHTML = {};

		_myGiftoSdkHTML.walletApi =  window.GiftoSDKApi;

    	_myGiftoSdkHTML.initWallet = function (data) {

			_myGiftoSdkHTML.walletApi.init({
				apiKey: data.apiKey
			});
			
    	}

    	/**
    	 *	Render result
    	 */
	 	_myGiftoSdkHTML.renderResultObject = function (id, result) {
	 		var wrapper = document.getElementById(id);
	 		
	 		//== Remove old result
	 		var oldResult = wrapper.getElementsByClassName('renderjson');

	 		if (oldResult.length > 0) {
	 			oldResult[0].parentNode.removeChild(oldResult[0]);
	 		}

	 		//== Add new result
	 		wrapper.appendChild(
		        renderjson(result)
		    );
	 	}
		/**
		*	Generate HTML for Create Wallet Form
		*/
		_myGiftoSdkHTML.createNewWallet = function (formId) {
			
			if ( formId == undefined || formId == null ) {
				
				console.error('Create new wallet missing formId');
				return false;

			} else {

				var FormApi = document.getElementById(formId);
				var formData = new FormData(FormApi);
				
				var requestApi = {
					identityData: formData.get('gw_identityData'),
					firstname: formData.get('gw_firstname'),
					lastname: formData.get('gw_lastname'),
					passphrase: formData.get('gw_passphrase')
				};
				
				var result = _myGiftoSdkHTML.walletApi.createWallet(requestApi, function(response){
					_myGiftoSdkHTML.renderResultObject(formId, response);
					FormApi.reset();
				});
			}

		}

		/**
		*	Generate HTML for View Wallet Info
		*/
		_myGiftoSdkHTML.getWalletDetail = function (formId) {
			if ( formId == undefined || formId == null ) {
				
				console.error('Detail wallet missing formId');
				return false;

			} else {

				var FormApi = document.getElementById(formId);
				var formData = new FormData(FormApi);
				
				var requestApi = {
					identityData: formData.get('gw_identityData')
				};
				
				var result = _myGiftoSdkHTML.walletApi.detailWallet(requestApi, function(response){
					_myGiftoSdkHTML.renderResultObject(formId, response);
					FormApi.reset();
				});

				return true;
			}
		}

		/**
		*	Generate HTML for Transfer Gifto
		*/
		_myGiftoSdkHTML.transferGiftoCoin = function (formId) {
			if ( formId == undefined || formId == null ) {
				
				console.error('Tranfer Gifto missing formId');
				return false;

			} else {

				var FormApi = document.getElementById(formId);
				var formData = new FormData(FormApi);
				
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
				
				var result = _myGiftoSdkHTML.walletApi.transferCoin(requestApi, function(response){
					_myGiftoSdkHTML.renderResultObject(formId, response);
					FormApi.reset();
				});

				return true;
			}
		}

		/**
		*	Generate HTML for View transactions list
		*/
		_myGiftoSdkHTML.walletListTransactions = function (formId) {
			if ( formId == undefined  || formId == null ) {
				
				console.error('Get list transactions formId');
				return false;

			} else {

				var FormApi = document.getElementById(formId);
				var formData = new FormData(FormApi);
				
				var requestApi = {
					identityData: formData.get('gw_identityData'),
					offset: formData.get('gw_offset'),
					limit: formData.get('gw_limit'),
					transactionType: formData.get('gw_transactionType'),
					transactionMode: formData.get('gw_transactionMode')
				};
				
				var result = _myGiftoSdkHTML.walletApi.listTransactions(requestApi, function(response){
					_myGiftoSdkHTML.renderResultObject(formId, response);
					FormApi.reset();
				});
				
			}
		}



	
    	return _myGiftoSdkHTML;
	}

	// Create globally accesible in the window
	if(typeof(window.GiftoWalletHtml) === 'undefined'){
		window.GiftoWalletHtml = GiftoSdkHTML();
	}

})(window);