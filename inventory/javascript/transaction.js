
$('#overlay_div').show();
$(function(){
     $('#overlay_div').hide();
     displayDateAndTime();

	 /*------------TRIGGER FOR SEARCHING PRODUCTS----------------*/
	 $('#product_to_transact_form').submit(function(){
	 	getProduct();
	 	return false;
	 });

	 /*--------------------Editing Quantity at the Shopping List--------------------*/
	 $('#shopping_list_tbody').on('click','td img',function(){
	 	var row_id = $(this).context.parentNode.parentNode.id;
	 	var cell_id = document.getElementById(row_id).getElementsByTagName('td')[2];
	 	var quantity =cell_id.getElementsByTagName('span')[0].innerHTML;
	 	$(cell_id).html("<input type='text' id='edited_quantity' class='input-small' value='"+quantity+"'/><input type='hidden' id='cell_id' value='"+row_id+"'>");
	 	$('#edited_quantity').focus();
	 })

	 $('#shopping_list_tbody').on('blur','input',function(){
	 	var regexInt = /^[0-9]+$/;
	 	var newQuantity = $(this).val();
        var cashInHand = parseFloat($('#cash_in_hand_input').val());
        var newChange = 0;
	 	if(regexInt.test(newQuantity) && newQuantity > 0){
	 		var row_id = $('#cell_id').val();
		 	var cell_id = document.getElementById(row_id).getElementsByTagName('td')[2];
		 	$(cell_id).html("<span>"+newQuantity +"</span>"+"<img src='css/img_tbls/editShoppingList.png' class =edit_quantity_img alt = edit quanity title=edit quantity/>");
		 	var cost = parseFloat($(cell_id).prev('td').find('span').html());
		 	var subTotal = $(cell_id).next().find('span').html();
            subTotal = parseFloat(subTotal.replace(/\,/g,""));
		 	var newsubTotal = (cost * parseInt(newQuantity)).toFixed(2);
            totalPayment = parseFloat(newsubTotal)+(totalPayment - subTotal);
            totalPayment = totalPayment.toFixed(2);
            newsubTotal = changeToMoneyFormat(newsubTotal.toString());
            var totalPayment2 = changeToMoneyFormat(totalPayment.toString());
		 	$(cell_id).next().find('span').html(newsubTotal);
			$('#shopping_list_total_tfoot td:last span').html(totalPayment2)
			$('#edited_quantity').removeClass('error');
			$('#payment_tbody tr th:first').html("&#8369; "+totalPayment2);
            totalPayment = parseFloat(totalPayment);
            newChange = cashInHand-totalPayment;
            if(regexInt.test(newChange) && newChange!=0){
                newChange = newChange.toFixed(2);
                $('#payment_tbody tr th:last').html("&#8369; "+changeToMoneyFormat(newChange)).css('color','#000');
                $('#payment_btn').removeAttr('disabled');
            }else{
                $('#payment_tbody tr th:last').html("&#8369; 00.00").css('color','#f00');
                $('#payment_btn').attr('disabled','disabled');
            }

	 	}else{
	 		$('#edited_quantity').css({"border-color":"red", "box-shadow":"0 0 1px 2px pink", "color":"#f00"});
	 	}

	 })
	 /*----------------------Removing Item on the shopping-------------*/
	 $('#shopping_list_tbody').on('click','th img',function(){
	 	var row_id = $(this).context.parentNode.parentNode.parentNode.id;
        var selectedProductId = row_id.split("_");
        var productIDindex = $.inArray(selectedProductId[3], selectedProduct_ID);//$.inArray => used to determine the numeric index of a particular array element
	 	var cashInHand = parseFloat($('#cash_in_hand_input').val());
	 	var listLength = $('#shopping_list_tbody tr').length;
        var newChange = 0;
	 	$('#'+row_id).addClass('error');
	 	$('#dialog_div').html('Remove From Product List');
	 	$('#dialog_div').dialog({
			title:'Remove',
			modal:true,
			show:'blind',
			hide:'blind',
			buttons:{
				"Remove" : function(){
				 	var subTotal =  $('#'+row_id).find('td:last span').html();
                    subTotal = subTotal.replace(/\,/g,"");
                    subTotal =  parseFloat(subTotal);
                    subTotal = subTotal.toFixed(2);
				 	totalPayment = totalPayment - subTotal
                    totalPayment = totalPayment.toFixed(2);
                    newChange = cashInHand - totalPayment;
                    newChange = newChange.toFixed(2);
				 	$('#shopping_list_total_tfoot').find('td:last span').html(changeToMoneyFormat(totalPayment));
				 	$('#'+row_id).remove();
				 	$('#'+row_id).removeClass('error');
                    selectedProduct_ID.splice(productIDindex,1); // removing id from array of product IDs
				 	$('#tr_transact_search_'+row_id.substring(15)).css('text-decoration','none');
    				$('#payment_tbody tr th:first').html("&#8369; "+changeToMoneyFormat(totalPayment));
    				if(newChange > 0 && listLength > 2){
                    	$('#payment_tbody tr th:last').css('color','#000').html("&#8369; "+changeToMoneyFormat(newChange));
                        $('#payment_btn').removeAttr('disabled');
               		}else{
			 			$('#payment_tbody tr th:last').css('color','#f00').html("&#8369; 00.00");
			 			$('#cash_in_hand_input').attr('disabled','disabled');
               		}
                    totalPayment = parseFloat(totalPayment); //to make totalPayment a floating point number                   
				 	$(this).dialog('close');
				},
				"Cancel" : function(){
					$(this).dialog('close');
					$('#'+row_id).removeClass('error');
				}
			},
            close: function (){
                $('#'+row_id).removeClass('error');
            }
		});

	 });

	 /*---------------------TRANSACTION OF ITEMS [saving to database]-------------------*/
	 $('#payment_btn').click(function(){
         var tbody = $('#shopping_list_tbody tr').length;
         if(tbody>1){
		    confirmationDialogForTransaction();
         }
	 })

	 $('#cash_in_hand_input').keyup(function(){
	 	var regexFloat = /^[0-9,.]+$/;
	 	if(regexFloat.test($(this).val())){
	 		var payment = parseFloat($(this).val());
		 	if(payment >= totalPayment){
		 		var change = payment-totalPayment;
			 	change = change.toFixed(2);
			 	$('#payment_tbody tr th:last').html("&#8369; "+changeToMoneyFormat(change));
			 	$('#payment_tbody tr th:last').css('color','#000');
			 	$('#payment_btn').removeAttr('disabled');
			 	$(this).css('color','#000');
			 }else{
			 	$('#payment_tbody tr th:last').css('color','#f00').html("&#8369; 00.00");
			 	$('#payment_btn').attr('disabled','disabled');
			 }
		}else{
			$('#payment_tbody tr th:last').css('color','#f00').html("&#8369; 00.00");
			$('#payment_btn').attr('disabled','disabled');
		}
	 }).click(function(){
           var payment = parseFloat($(this).val());
           if(payment == 0){
               $(this).val("");
           }
       });

    $("#productToBuy").keyup(function() {
        $.ajax({
            type: "POST",
            url: "php/objects/transaction/retrieveProducts.php",
            data: {"inputted_product": $("#productToBuy").val()},
            success: function(data) {
                var data = JSON.parse(data);
                $("#product_name").typeahead({
                    source: data
                });
            },
            error: function(data) {
                console.log("Error in retrieving all products = " + data);
            }
        });
    });

})

 var totalPayment = 0; //Global variable for the total payment of the products bought...

 var selectedProduct_ID = new Array(); //Global array variable used to store all product id that has been already selected...
 var regexInt = /^[0-9]+$/;

 /*-----------FUNCTION FOR Getting PRODUCTS to transact----------*/
 function getProduct(){
 	var existMsg_error = "That product is already in the list.";
 	var inputsMsg_error = "Oops.. Quantity must be a numeric greater than zero (0).";
 	var notfoundMsg_error = "Oops.. Product doesn't exist!";
    var cashInHand = parseFloat($('#cash_in_hand_input').val());
    var newChange = 0;
    var productName = $('#productToBuy').val();
    var obj = {"identifier_val":productName};

     var quantity = $('#product_quantity').val();
	if(regexInt.test(quantity) && quantity > 0 ){
		$.ajax({
			type:"GET",
			data: obj,
			url: "php/objects/transaction/getProduct.php",
			success:function(data){
				if(data != ""){
					var prodObj = JSON.parse(data);
					if(prodObj.stocks >= parseInt($("#product_quantity").val())) {
                        if(checkIfProductHasntSelected(prodObj.prodID)){
                            displayToShoppingList(prodObj.prodID, prodObj.prodName, prodObj.prodPrice ,prodObj.prodUnit, quantity);
                            selectedProduct_ID.push(prodObj.prodID);
                            newChange = cashInHand - totalPayment;
                            if(newChange > 0){
                                newChange = newChange.toFixed(2);
                                $('#payment_tbody tr th:last').html("&#8369; "+changeToMoneyFormat(newChange)).css('color','#000');
                                $('#payment_btn').removeAttr('disabled');
                            }else{
                                $('#payment_tbody tr th:last').html("&#8369; 00.00").css('color','#f00');
                                $('#payment_btn').attr('disabled','disabled');
                            }
                            $('#default_alert_div').hide();
                            $('#alert_productExist_div').fadeOut();
                            $('#alert_error_msg_p').html("");
                            $('#success_alert_div').fadeIn();
                        }else{
                            $('#default_alert_div').hide();
                            $('#success_alert_div').hide();
                            $('#alert_error_msg_p').html(existMsg_error+" Product Name : <a href='#tr_to_transact_"+prodObj.prodID+"' onclick='markSelectedProduct("+prodObj.prodID+")'>["+prodObj.prodName+"]</a> ");
                            $('#alert_productExist_div').fadeIn();
                        }
                    } else alert("Insufficient stocks of " + prodObj.prodName + "!\nCurrent stock is only " + prodObj.stocks + ".");
				}else{
					$('#default_alert_div').hide();
					$('#success_alert_div').hide();
					$('#alert_error_msg_p').html(notfoundMsg_error);
                    $('#product_code').focus();
					$('#alert_productExist_div').fadeIn();
				}

			},
			error:function(data){
				alert("Error on Getting product => [ "+ data['status'] + " ] " + data['statusText']);
			}

		})
	}else{
		$('#default_alert_div').hide();
		$('#success_alert_div').hide();
		$('#alert_error_msg_p').html(inputsMsg_error);
		$('#alert_productExist_div').fadeIn();
	}
	
}

/*-----------------Function for checking at the selected product if it is already at shopping list--------------*/
function checkIfProductHasntSelected(productID){

	var not_selected = true;	
	for(var ctr=0; ctr<selectedProduct_ID.length;ctr++){	
		if(selectedProduct_ID[ctr] == productID){
			not_selected = false;
			break;
		}
	}
	return not_selected;
}


function displayToShoppingList(prodId,prodName,prodPrice,prodUnit,productQuantity){

	var subTotal = (parseFloat(prodPrice)*parseInt(productQuantity)).toFixed(2);

	totalPayment = totalPayment + parseFloat(subTotal); /*-global totalPayment variable to compute for the total payment-*/
    totalPayment = parseFloat(totalPayment);

    subTotal = changeToMoneyFormat(subTotal.toString());
    var totalPayment2 = changeToMoneyFormat((totalPayment.toFixed(2)).toString());

    var newId = "tr_to_transact_"+prodId;
	var tbody = "<tr  id='"+newId+"'>"+
				"<th><a href='Javascript:void(0)'><img src='css/img_tbls/deleteShoppingList.png' class ='delete_list_img' alt = 'remove row' title='remove' /></a></th>"+
				"<td>"+prodName+"</td>"+
				"<td>&#8369; <span>"+prodPrice+"</span> / "+prodUnit+"</td>"+
				"<td><span>"+productQuantity+"</span><img src='css/img_tbls/editShoppingList.png' class =edit_quantity_img alt = edit quanity title=edit quantity/></td>"+
				"<td>&#8369; <span>"+subTotal+"</span></td>"+
				"</tr>";
	var tfoot = "<tr  class='totalpayment_tr'>"+
				"<td colspan='5'>TOTAL &nbsp;&nbsp; <i class='icon-hand-right'></i></td>"+
				"<td>&#8369; <span>"+totalPayment2+"</span></td>"+
				"</tr>";
	
	$('#shopping_list_tbody').append(tbody);
	$('#shopping_list_total_tfoot').html(tfoot);
	$('#shopping_list_table').show('blind',1000);
    $('#product_quantity').val("");
    $('#payment_tbody tr th:first').html("&#8369; "+totalPayment2);
    $('#cash_in_hand_input').removeAttr('disabled');
    $('#productToBuy').val("").focus();
}

function saveTransaction(){
    var productIDs = new Array();
    var productQuantities = new Array();
    var row = $('#shopping_list_tbody tr');

    for(var ctr=1; ctr<row.length;ctr++){
        var row_id = row[ctr].id;
        var quantity = $('#'+row_id+ " td span");
        row_id = row_id.substring(15);
        quantity = quantity[1].innerHTML;
        productIDs.push(row_id);
        productQuantities.push(quantity);
    }

    var obj = {'productIDs': productIDs, 'quantities': productQuantities};
    $.ajax({
        type:"POST",
        url: "php/objects/transaction/saveTransaction.php",
        data: obj,
        beforeSend:(function(){
           $('#overlay_div').show();
        }),
        success: function() {
            window.location.href = 'index.php';
        },
        error:function(data){
            console.log("Error on saving transaction => "+ JSON.stringify(data));
        }
    })
}

function markSelectedProduct(prodID){
    var rowID = "tr_to_transact_"+prodID;
    $('#'+rowID).addClass('info');
    var markedProduct=setInterval(function(){
        $('#'+rowID).removeClass('info');
        clearInterval(markedProduct);
    },3000);
}

function confirmationDialogForTransaction(){
	$('#dialog_div').html("Everything will be recorded <br/>Do you want to continue?");
 	$('#dialog_div').dialog({
		title:'Confirmation',
		modal:true,
        show: {effect: 'slide', direction: 'up'},
        hide: {effect: 'slide', direction: 'up'},
		buttons:{
			"Continue" : function(){
			 	saveTransaction();
			 	$(this).dialog('close');
			},
			"Cancel" : function(){
				$(this).dialog('close');
			}
		}
	});
}

function changeToMoneyFormat(toConvert){
    var toConvertLength = toConvert.indexOf('.');
    var floatingPoint = true;
    if(toConvertLength < 0){
        toConvertLength = toConvert.length;
        floatingPoint = false;
    }
    var floatingValue = toConvert.substring(toConvertLength+1);
    var substrBase = toConvertLength;
    var arrayNumbers = new Array();
    toConvertLength = toConvertLength/3;
    var newtoConvert = "";
    var lastNumber = "";
    if(substrBase % 1 != 0){
        substrBase = substrBase+1;
    }if(toConvertLength % 1 != 0){
        toConvertLength = toConvertLength+1;
    }
    toConvertLength = parseInt(toConvertLength);
    substrBase = parseInt(substrBase);

    for(var ctr=1;ctr<toConvertLength+1;ctr++){
        if(substrBase-(ctr*3) > 0){
            newtoConvert = toConvert.substr(substrBase-(ctr*3),3);
            lastNumber = toConvert.substr(0,substrBase-(ctr*3));
            arrayNumbers[toConvertLength-(ctr)] = newtoConvert;
        }else{
            if(lastNumber == ""){
                arrayNumbers[toConvertLength-(ctr)] = parseInt(toConvert);
            }else{
                arrayNumbers[toConvertLength-(ctr)] = lastNumber;
            }
        }
    }
    if(floatingPoint){
        toConvert = arrayNumbers.join(',')+"."+floatingValue;
    }else{
        if(arrayNumbers != null){
            toConvert = arrayNumbers.join(',');
        }
    }

    return toConvert;

}

function displayDateAndTime(){
    var months = new Array("January", "February", "March",
                           "April", "May", "June", "July",
                           "August", "September", "October",
                           "November", "December");
    setInterval(function(){
        var curDateTime = new Date();
        var yr = curDateTime.getFullYear();
        var mnth = curDateTime.getMonth();
        mnth = months[mnth];
        var dt = curDateTime.getDate();
        var hr = curDateTime.getHours();
        var mn = curDateTime.getMinutes();
        var extension = "AM";

        if(hr > 12) {
            hr = hr - 12;
            extension = "PM";
        }
        if(hr == 0) hr = 12;
        if(hr <= 9) hr = "0" + hr;

        if(mn <= 9) mn = "0" + mn;

        var dateTime = mnth+" "+dt+", "+yr+" | "+hr+":" + mn + " " + extension;
        $("#curDateTime").html(dateTime);
    },1000)
}
