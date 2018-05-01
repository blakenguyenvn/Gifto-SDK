/*1508540788,,JIT Construction: v3389191,en_US*/

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
(function(window) {
	//== Define Gifto SDK API
	function GiftoSDKApi () {
		var _GiftoApi = {};

    	_GiftoApi.apiHost = 'https://wallet.gifto.io/apiv2/v2/';

		_GiftoApi.wallet = {
			apikey: null
		};

		_GiftoApi.currencyCode = 'Gifto';
		_GiftoApi.currencyName = 'Gifto';
		/**
		 *	Init: API key
		 */
		_GiftoApi.init = function (data) {
			_GiftoApi.wallet.apikey = data.apikey;
		}
		/**
		*	SDK Excute API
		*/
		_GiftoApi.executeApi = function (api_method, api_url, api_request, callback_function) {

			var xhttp = new XMLHttpRequest();
		    
		    xhttp.open(api_method, api_url, true);
		    
		    xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
		    xhttp.setRequestHeader("Authorization", _GiftoApi.wallet.apikey);

			//== Bind HTTP state change
			xhttp.onreadystatechange = function (Event) {
				
				if ( xhttp.readyState === XMLHttpRequest.DONE ) {
					
					var httpResponse = null;
					var response = null;

					//== Status: 201
			    	if ( xhttp.status == 201 && xhttp.responseText != '') {
			    		httpResponse = JSON.parse(xhttp.response);
			    	} else if (xhttp.status == 201 && xhttp.statusText != '') {
			    		response = {'msg': xhttp.statusText};
			    	}

			    	//== Status: 202
			    	if ( xhttp.status == 202 && xhttp.response != '' ) {
			    		httpResponse = JSON.parse(xhttp.response);
			    	} else if (xhttp.status == 202) {
			    		response = {'msg': 'Transfer Accepted'};
			    	}
			    
			    	//== Status: 400
			    	if ( xhttp.status == 400 && xhttp.response != '' ) {
						httpResponse = JSON.parse(xhttp.response);

						//== Status: 400001
				    	if ( httpResponse.code == "400001" ) {
							response = {'msg' : 'Error: json is not valid'};
				    	}
				    	//== Status: 400002
				    	if ( httpResponse.code == "400002" ) {
							response = {'msg' : 'Error: missing required data'};
				    	}
				    	//== Status: 400003
				    	if ( httpResponse.code == "400003" ) {
							response = {'msg' : 'Error: not support currencyCode'};
				    	}
				    	//== Status: 400004
				    	if ( httpResponse.code == "400004" ) {
							response = {'msg' : 'Error: invalid max length data ( plus body for fields )'};
				    	}
				    	//== Status: 400005
				    	if ( httpResponse.code == "400005" ) {
							response = {'msg' : 'Error: minimum coin required ( >= 0.00001)'};
				    	}
				    	//== Status: 400006
				    	if ( httpResponse.code == "400006" ) {
							response = {'msg' : 'Error: balance is not enough'};
				    	}
				    	//== Status: 400007
				    	if ( httpResponse.code == "400007" ) {
							response = {'msg' : 'Error: invalid amount'};
				    	}
				    	//== Status: 400008
				    	if ( httpResponse.code == "400008" ) {
							response = {'msg' : 'Error: transferFeeType is not support'};
				    	}
				    	//== Status: 400009
				    	if ( httpResponse.code == "400009" ) {
							response = {'msg' : 'Error: transfer type is not support'};
				    	}
				    	//== Status: 400010
				    	if ( httpResponse.code == "400010" ) {
							response = {'msg' : 'Error: transfer mode is not support'};
				    	}
			    	}
			    	
			    	//== Status: 401
			    	if ( xhttp.status == 401 && xhttp.response != '' ) {
						httpResponse = JSON.parse(xhttp.response);
						
				    	//== Status: 401001
				    	if ( httpResponse.code == "401001" ) {
							response = {'msg' : 'Error: invalid token'};
				    	}
				    	//== Status: 401002
				    	if ( httpResponse.code == "401002" ) {
							response = {'msg' : 'Error: passphrase is not correct'};
				    	}
			    	}
			    	
			    	//== Status: 404
			    	if ( xhttp.status == 404 && xhttp.response != '' ) {
			    		if ( xhttp.response != null ) {
							httpResponse = JSON.parse(xhttp.response);
						}

						//== Status: 404001
				    	if ( httpResponse.code == "404001" ) {
							response = {'msg' : 'Error: senderIdentityData is not found'};
				    	}
				    	//== Status: 404002
				    	if ( httpResponse.code == "404002" ) {
							response = {'msg' : 'Error: receiverIdentityData is not found'};
				    	}
			    	}
			    	
			    	//== Status: 405
			    	if ( xhttp.status == 405 && xhttp.response != '' ) {
			    		if ( xhttp.response != null ) {
							httpResponse = JSON.parse(xhttp.response);
						}
			    	}
			    	
			    	//== Status: 409
			    	if ( xhttp.status == 409 && xhttp.response != '' ) {
			    		if ( xhttp.response != null ) {
			    			httpResponse = JSON.parse(xhttp.response);
			    		}
			    	}

			    	//== Status: 200
					if(xhttp.status == 200 && xhttp.response != '') {
						if ( xhttp.response != null ) {
							httpResponse = JSON.parse(xhttp.response);	
						}
				    	
				    }

			    	if (typeof callback_function == 'function') { 
			    		
			    		if ( response != null ) {
			    			callback_function(response); 	
			    		} else {
			    			callback_function(httpResponse); 	
			    		}
					  	
					}
				}
				
			};

		    xhttp.send(JSON.stringify(api_request));
		   	
		}

		/**
		*	SDK Verify response
		*/
		_GiftoApi.verifyResponse = function (apiResponse) {

			return apiResponse;
		}

		/**
		*	SDK Init
		*/
		_GiftoApi.init = function (options) {
			_GiftoApi.wallet.identityData = options.email;
			_GiftoApi.wallet.passphrase = options.password;
			_GiftoApi.wallet.apikey = options.apikey;
		}

		/**
		*	SDK Create Wallet
		*/
		 _GiftoApi.createWallet = function (data, callback) {
		 	var apiMethod = 'POST';

		 	var apiURL = this.apiHost + 'wallets/create';
		 	
		 	var apiRequest = {
		 		"identityData": data.identityData,
				"firstname": data.firstname, 
				"lastname": data.lastname,
				"passphrase": data.passphrase,
				"currencyCode": _GiftoApi.currencyCode 
		 	};

		 	var apiResult = this.executeApi(apiMethod, apiURL, apiRequest, callback);

		 	return apiResult;

		}

		/**
		*	SDK Wallet Detail
		*/
		_GiftoApi.detailWallet = function (data, callback) {

		 	var apiMethod = 'POST';

		 	var apiURL = _GiftoApi.apiHost + 'wallets/detail';
		 	
		 	var apiRequest = {
		 		"identityData": data.identityData
		 	};

		 	var apiResult = _GiftoApi.executeApi(apiMethod, apiURL, apiRequest, callback);

		 	return apiResult;

		}

		/**
		*	SDK Coin Transfer
		*/
		_GiftoApi.transferCoin = function (data, callback) {
		 	
		 	var apiMethod = 'POST';

		 	var apiURL = this.apiHost + 'payments/transfer';
		 	
		 	var apiRequest = {
		 		"identityData": data.identityData,
				"currencyCode": data.currencyCode,
				"passphrase": data.passphrase,

				"toWalletAddress": data.toWalletAddress,
				"amount": data.amount,
				"referenceId": data.referenceId,
				"note": data.note,
				"transferFeeType": data.transferFeeType,
				"type": data.type
		 	};

		 	var apiResult = this.executeApi(apiMethod, apiURL, apiRequest, callback);

		 	return apiResult;

		}

		/**
		*	SDK Transactions History
		*/
		_GiftoApi.listTransactions = function (data, callback) {
		 	var offset = data.offset != null ? data.offset : 0;
		 	var limit = data.limit != null ? data.limit : 50;

		 	var apiMethod = 'POST';

		 	var apiURL = this.apiHost + 'payments/transactions/transfer/list';
		 	
		 	var apiRequest = {
		 		"identityData": data.identityData,
		 		"offset": offset,
    			"limit": limit,
    			"transactionType": data.transactionType, //Supported type : all/tranfer/tip/withdraw
    			"transactionMode": data.transactionMode // Supported mode " send/receive
		 	};

		 	var apiResult = this.executeApi(apiMethod, apiURL, apiRequest, callback);

		 	return apiResult;

		}

		/**
		 *	Gifto API: Check exiting wallet	
		 */
		 _GiftoApi.gwCheckExistWallet = function (email) {
		 	var requestApi = {
				identityData: email
			};
			
			var result = this.giftoAPI.detailWallet(requestApi, function(response){
				
			});
		 }
		/**
		 *	Gifto API: Check password wallet	
		 */
		 _GiftoApi.gwVerifyPassword = function (email, password) {
		 	var requestApi = {
				identityData: email
			};
			
			var result = this.giftoAPI.detailWallet(requestApi, function(response){
				
			});
		 }
		/**
		 *	Gifto API: Check password wallet	
		 */
		 _GiftoApi.gwCheckWalletBalance = function (email) {
		 	var requestApi = {
				identityData: email
			};
			
			var result = this.giftoAPI.detailWallet(requestApi, function(response){
				
			});
		 }

    	return _GiftoApi;
	}

	// Create globally accesible in the window
	if(typeof(window.GiftoSDKApi) === 'undefined'){
		window.GiftoSDKApi = GiftoSDKApi();
	}

})(window);