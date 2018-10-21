$(document).ready(function() {

    displayProducts();
    getProductTotalPages();

    $("#add_product_form").submit(function() {
        return false;
    });

    $("#newTransaction").click(function() {
        $("#transactionContainerDiv").dialog({
            title: "Happy Transaction",
            top: 0,
            modal: true,
            resizable: false,
            draggable: false,
            height: 890,
            width: 890,
            show: {effect: 'slide', direction: 'up'},
            hide: {effect: 'slide', direction: 'up'}
        });
    });

    $("#showTransactionRecord").click(function() {
       $("#transactionRecordDiv").dialog({
           title: "Sales Record",
           top: 0,
           modal: true,
           resizable: false,
           draggable: false,
           height: 890,
           width: 890,
           show: {effect: 'slide', direction: 'up'},
           hide: {effect: 'slide', direction: 'up'}
       });
    });

   $("#add_product_button").click(function() {
       addProduct();
   });

    $("#search_product_input_field").keyup(function() {
        $.ajax({
            type: "POST",
            url: "php/objects/products/searchProduct.php",
            data: {"product_name_to_search": $("#search_product_input_field").val()},
            success: function(data) {
                if(data != "") {
                    $("#display_products_table_tbody").html(data);
                } else {
                    $("#display_products_table_tbody").html("<tr class = 'alert alert-block alert-danger'><td>No results for '<b>" + $("#search_product_input_field").val() + "</b>'.</td></tr>");
                }
            },
            error: function(data) {
                console.log("There's an error in searching product. It says " + JSON.stringify(data));
            }
        });

        if($("#search_product_input_field").val() == "") {
            displayProducts();
        }
    });

    $('#pager_ul').on('click','li a',function(){
        var maxPage = parseInt($('#product_total_pages').val());
        var pageSelected = parseInt($(this).html());
        var liIndex = $($(this).context.parentNode).index();
        var lilength = parseInt($('#pager_ul li').length)-1;
        var newSetOfPages = 0;
        if(regexInt.test(pageSelected)){
            $('#pager_ul li').removeClass('active');
            if(liIndex == 6){

                newSetOfPages = pageSelected+4;
                if(newSetOfPages <= maxPage){
                    displayProductsPager(pageSelected, newSetOfPages)
                }else{
                    newSetOfPages = maxPage-4;
                    displayProductsPager(newSetOfPages, maxPage)
                }
            }else if(liIndex == 2){
                newSetOfPages = pageSelected-4;
                if(newSetOfPages>0){
                    displayProductsPager(newSetOfPages, pageSelected)
                }else{
                    if( maxPage < 5 ){
                        displayProductsPager(1, maxPage)
                    }else{
                        displayProductsPager(1, 5)
                    }
                }
            }
            $('#current_page_tracker_span').html(pageSelected);
            $('#page_'+pageSelected).addClass('active');
        }else if(liIndex == 0){ //first pager
            $('#pager_ul li').removeClass('active');
            if(maxPage <= 5 ){
                displayProductsPager(1, maxPage);
            }else{
                displayProductsPager(1, 5);
            }

            $('#pager_ul li:eq(2)').addClass('active');
            $('#current_page_tracker_span').html(1);
        }else if(liIndex == lilength){ //last pager
            $('#pager_ul li').removeClass('active');
            newSetOfPages = maxPage-4;
            if(maxPage<=5){
                newSetOfPages = maxPage+1;
                displayProductsPager(1, maxPage)
                $("#pager_ul li:eq("+newSetOfPages +")").addClass('active');
            }else{
                displayProductsPager(newSetOfPages, maxPage)
                $("#pager_ul li:eq(6)").addClass('active');

            }

            $('#current_page_tracker_span').html(maxPage);
        }
        displayProducts();
    });

    $('#product_pageLimit_form').submit(function(){
        displayProducts();
        getProductTotalPages();
        return false;
    });


});

var numeric_pattern = /^[0-9, .]*$/;

function addProduct() {
    var product_name = $.trim($("#product_name").val());
    var originalPrice = $.trim($("#originalPrice").val());
    var sellingPrice = $.trim($("#sellingPrice").val());
    var number_of_stocks = $.trim($("#number_of_stocks").val());
    var stock_unit = $("#stock_unit").val();

    var originalPriceValid = numeric_pattern.test(originalPrice);
    var sellingPriceValid = numeric_pattern.test(sellingPrice);
    var number_of_stocks_valid = numeric_pattern.test(number_of_stocks);

    if(product_name != "" ) {
        if(originalPrice != "" && originalPriceValid) {
            if(sellingPrice != "" && sellingPriceValid) {
                if(number_of_stocks != "" && number_of_stocks_valid) {
                    $.ajax({
                        type: "POST",
                        url: "php/objects/products/checkIfProductToAddAlreadyExist.php",
                        data: {"execute": "check_product_name_to_add", "product_data": JSON.stringify($("#add_product_form").serializeArray())},
                        success: function(data) {
                            if(data == "true") {
                                console.log("worked here4");
                                $("#add_product_confirmation_div").dialog({
                                    title: "PRODUCT EXIST",
                                    show: {effect: "slide", direction: "up"},
                                    hide: {effect: "slide", direction: "up"},
                                    modal: true,
                                    draggable: false,
                                    resizable: false,
                                    buttons: {
                                        "YES": function() {
                                            // ================= UPDATES THE NUMBER OF STOCK OF A PRODUCT =================
                                            $.ajax({
                                                type: "POST",
                                                url: "php/objects/products/addProduct.php",
                                                data: {"products_data": JSON.stringify($("#add_product_form").serializeArray()), "update": "yes"},
                                                success: function() {
                                                    $("#add_product_confirmation_div").dialog("close");
                                                    $("#stock_unit_dd").html("<select name = 'stock_unit' id = 'stock_unit'><option>pieces</option><option>packs</option><option>klg</option><option>g</option> <option>lbs</option><option>others</option></select>");
                                                },
                                                error: function(data) {
                                                    console.log("There's an error in adding a product. It says " + JSON.stringify(data));
                                                }
                                            });
                                        },
                                        "NO THANKS": function() {
                                            $("#add_product_confirmation_div").dialog("close");
                                        }
                                    }
                                })
                            } else {
                                //--- adding nre product
                                $.ajax({
                                    type: "POST",
                                    url: "php/objects/products/addProduct.php",
                                    data: {"products_data": JSON.stringify($("#add_product_form").serializeArray()), "update": "no"},
                                    success: function(data) {
                                        displayProducts();
                                        $("#stock_unit_dd").html("<select name = 'stock_unit' id = 'stock_unit'><option>piece</option><option>packs</option><option>klg</option><option>g</option> <option>lbs</option><option>others</option></select>");
                                        $("#number_of_stocks_dd").removeClass("control-group error");
                                        $("#product_price_dd").removeClass("control-group error");
                                        $("#sellingPriceDD").removeClass("control-group error");
                                        $("#bar_code_dd").removeClass("control-group error");
                                        $("#product_name_dd").removeClass("control-group error");
                                        $("#add_product_form input").not(':input[type = reset]').val('');
                                    },
                                    error: function(data) {
                                        console.log("There's an error in adding a product. It says " + JSON.stringify(data));
                                    }
                                });
                            }
                        },
                        error: function(data) {
                            console.log("There's an error in checking products. It says " + JSON.stringify(data));
                        }
                    }); // ============ END of AJAX Request in cheking if product exist ========

                } else {
                    //number of stocks warning
                    $("#number_of_stocks_dd").addClass("control-group error");
                }
            } else {
                $("#sellingPriceDD").addClass("control-group error");
            }
        } else {
            //product original warning
            $("#product_price_dd").addClass("control-group error");
        }
    } else {
        //product name warning
        $("#product_name_dd").addClass("control-group error");
    }
}

function displayProducts() {
    var currentPage = parseInt($('#current_page_tracker_span').html())-1;
    var pageLimit = $("#product_pageLimit_input").val();
    if(pageLimit == "") pageLimit = 10;
    else pageLimit = parseInt(pageLimit);
    $.ajax({
        type: "POST",
        url: "php/objects/products/displayProducts.php",
        data: {"currentPage": currentPage, "pageLimit": pageLimit},
        success: function(data) {
            $("#display_products_table_tbody").html(data);
        },
        error: function(data) {
            console.log("There's an error in displaying products : " + JSON.stringify(data));
        }
    });
    getProductTotalPages();
}

function delete_products() {
    var product_ids_to_delete = new Array();
    var product_table = document.getElementById("display_products_table");
    var table_rows = product_table.getElementsByTagName("tr");
    var counter = 1;
    while(counter < table_rows.length) {
        var check_box = document.getElementById('product_check_box_' + table_rows[counter].id);
        if(check_box.checked) {
            product_ids_to_delete.push(table_rows[counter].id);
        }
        counter++;
    }

    if(product_ids_to_delete == "") {
        alert("Nothing to delete!");
    } else {
        $("#delete_product_confirmation_div").dialog({
            title: "DELETE CONFIRMATION",
            show: {effect: 'slide', direction: 'up'},
            hide: {effect: 'slide', direction: 'up'},
            modal: true,
            resizable: false,
            draggable: false,
            buttons: {
                "YES": function() {
                    $.ajax({
                        type: "POST",
                        url: "php/objects/products/deleteProduct.php",
                        data: {"product_ids_to_delete": product_ids_to_delete},
                        success: function() {
                            $("#delete_product_confirmation_div").dialog("close");
                            for(var counter = 0; counter < product_ids_to_delete.length; counter++) {
                                $('#' + product_ids_to_delete[counter]).remove();
                            }

                        },
                        error: function(data) {
                            console.log("There's an error in deleting products. It says " + JSON.stringify(data));
                        }
                    });
                },
                "CANCEL": function() {
                    $("#delete_product_confirmation_div").dialog("close");
                }
            }
        });
    }
}
var regexInt = /^[0-9]+$/;
function getProductTotalPages(){
    var productName = $('#search_product_input_field').val();
    var pageLimit = $('#product_pageLimit_input').val();
    var totalPages = 0;
    if(!regexInt.test(pageLimit)){
        pageLimit = 5;
    }
    pageLimit = parseInt(pageLimit);
    $.ajax({
        type:'POST',
        url: 'php/objects/products/retrieveProductTotalPages.php',
        data: {productName:productName},
        success:function(data){
            totalPages = Math.ceil(parseInt(data)/pageLimit)
            $('#product_total_pages').val(totalPages);
            $('#total_page_span').html(totalPages);
            $('#current_page_tracker_span').html(1);
            if(totalPages < 5){
                displayProductsPager(1,totalPages);
            }else{
                displayProductsPager(1,5);
            }
            $('#pager_ul li:eq(2)').addClass('active')
        },
        error:function(data){
            console.log(data['statusText'])
        }
    })
}


function displayProductsPager(pages, offset){
    var maxPage = parseInt($('#product_total_pages').val());
    var productsPager = "";

    if(maxPage > 1){
        productsPager += " <li ><a href='#'>&laquo; first</a></li> <li onclick='previousProductPager()'><a href='#'>&lsaquo; prev</a></li>";
        for(var ctr=pages; ctr<=offset; ctr++){
            productsPager += "<li id=page_"+ctr+"><a href='javascript:void(0)'>"+ctr+"</a></li>";
        }
        productsPager += " <li onclick='nextProductPager()' ><a href='#'>next &rsaquo;</a></li> <li><a href='#'>last &raquo;</a></li>";
    }else{
        productsPager = "--------------------------------------------------------";
    }
    $('#pager_ul').html(productsPager);
}

function nextProductPager(){
    var maxPage = parseInt($('#product_total_pages').val());
    var currentPage = parseInt($('#current_page_tracker_span').html())+1;
    var liActive = $('#pager_ul li.active').index();
    if(currentPage <= maxPage && liActive != 6){
        $('#pager_ul li').removeClass('active');
        $('#current_page_tracker_span').html(currentPage);
        $('#page_'+currentPage).addClass('active');
        displayProducts();
    }
}

function previousProductPager(){
    var liActive = $('#pager_ul li.active').index();
    var currentPage = parseInt($('#current_page_tracker_span').html())-1;
    if(liActive != 2){
        $('#pager_ul li').removeClass('active');
        $('#current_page_tracker_span').html(currentPage);
        $('#page_'+currentPage).addClass('active');
        displayProducts();
    }
}

function addStocks(productID) {
    var stocksToAdd = prompt("Enter number of stocks to add: ");
    if(stocksToAdd != "" && numeric_pattern.test(stocksToAdd)) {
        stocksToAdd = parseInt(stocksToAdd);
        var currentStock = $("#stock"+productID).html();
        currentStock = parseInt(currentStock);
        $("#stock"+productID).html(currentStock+stocksToAdd);
        $.ajax({
           type: "POST",
            data: {"productID": productID, "stocksToAdd": stocksToAdd},
            url: "php/objects/products/addStocks.php",
            error: function(data) {
                console.log("There's an error in adding stocks: " + JSON.stringify(data));
            }
        });
    } else {
        alert("Invalid input!");
    }
}