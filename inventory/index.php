<!Doctype html>
<html>
<head>
    <title>Inventory</title>
    <link rel = "shortcut icon" href = "" />
    <link rel = "stylesheet" href = "css/bootstrap.min.css" />
    <link rel = "stylesheet" href = "css/jquery-ui.min.css" />
    <link rel = "stylesheet" href = "css/product_page.css" />
    <link rel = "stylesheet" href = "css/transaction_page.css" />
    <link rel = "stylesheet" href = "css/sales.css"
</head>
<body>
<div id = "products_main_div_container" class = "container">

    <div id = "display_products_div" class = "control-group">
        <h2>HARDWARE PRODUCTS</h2><br />
        <div id = "product_actions">
            <span class = 'add-on'><img src = "css/images/search_icon1.png"></span>
            <input type = "text" id = "search_product_input_field" class = 'search-query' placeholder = "Search product here" />
             <span class="pull-right">
                 <button id="newTransaction" class = "btn-mini btn-primary">New Transaction</button>
                <button id="showTransactionRecord" class = " btn-mini btn-primary">Sales Record</button>
            </span>
        </div><!-- ========  Product actions div ends ======== -->
        <table id = "display_products_table" class = "table table-hover">
            <thead>
            <tr>
                <th>NAME</th>
                <th>ORIGINAL</th>
                <th>SELLING</th>
                <th>STOCKS</th>
                <th>UNIT</th>
                <th class = 'product_delete_action'>
                    <img title = "delete selected products" src = 'css/images/trash_can.gif' id = 'delete_trash_icon' onclick = 'delete_products()' />
                </th>
            </tr>
            </thead>
            <tbody id = "display_products_table_tbody"></tbody>
        </table>
        <div id='pagination__products_div'>
            <div id='page_tracker_div' class='label label-info'>
                <i class='icon-bullhorn icon-white'></i> Page <span id='current_page_tracker_span'> 1 </span> of <span id='total_page_span'> 5 </span>
            </div><!--page_tracker_div-->
            <div id='pagination_pager_div' class='pagination pagination-centered pagination-mini'>
                <ul id='pager_ul'></ul>
            </div><!--pagination_pager_div-->
            <div id='pagination_pagelimiter_div'>
                <form id='product_pageLimit_form'>
                    <input type='text' id='product_pageLimit_input' placeholder='Limit' class='input-mini' required />
                </form>
            </div><!--pagination_pagelimiter_div-->
            <input type='hidden' id='product_total_pages' />
        </div>
    </div><!-- ======= display products div ends ======= -->
    <div id = "add_product_div">
        <form id = "add_product_form">
            <h4>Add Product here:<button title="reset product form" type = "reset" class = "btn btn-danger btn-mini pull-right"><img src="css/img_tbls/editShoppingList.png"/></button></h4>
            <input type = "hidden" id = "id" name = "id">
            <dl>
                <dt>Product Name:</dt>
                <dd id = 'product_name_dd'><input type = "text" name = "product_name" id = "product_name" /></dd>
                <dt>Description:</dt>
                <dd id = 'descriptionDD'><input type = "text" name = "productDescription" id = "productDescription" placeholder="optional" /></dd>
                <dt>Original &#8369;rice:</dt>
                <dd id = 'original_price_dd' class = "input-append btn-group"><span class = "add-on">&#8369;</span><input type = "text" name = "originalPrice" id = "originalPrice" class = "input-medium"/></dd>
                <dt>Selling &#8369;rice:</dt>
                <dd id = 'sellingPriceDD' class = "input-append btn-group"><span class = "add-on">&#8369;</span><input type = "text" name = "sellingPrice" id = "sellingPrice" class = "input-medium"/></dd>
                <dt>Initial Stock(s):</dt>
                <dd id = 'number_of_stocks_dd'><input type = "text" name = "number_of_stocks" id = "number_of_stocks" /></dd>
                <dt>Stock Unit:</dt>
                <dd id = "stock_unit_dd"><select name = "stock_unit" id = "stock_unit">
                        <option>piece</option>
                        <option>pack</option>
                        <option>kg</option>
                        <option>g</option>
                        <option>lbs</option>
                        <option>others</option>
                    </select></dd>
            </dl>
            <button id = "add_product_button" class = "btn btn-primary btn-small">ADD</button>
        </form><!-- ============ add product form ends ============-->
    </div><!-- ======= add products div ends ======== -->
    <div id="transactionContainerDiv">
        <span id='date_span'>
                <p class='label label-info' id="curDateTimePHolder"><i class='icon-calendar'></i> Date | <i class='icon-time'></i> Time:</p>&nbsp;<span class='text text-info text-right' id="curDateTime"></span>
        </span><br /><br /><br />

        <div id='alert_productExist_div' class='alert-error alerts_div'>
            <p id='alert_error_msg_p'></p>
        </div>

        <div id='success_alert_div' class='alert-success alerts_div'>
            Product Added
        </div>

        <div id='product_to_transact_div'>
            <form id='product_to_transact_form' class='form-horizontal'>
                <input type='text' id='productToBuy' class='input-xlarge' placeholder='Product Name' title='Product Name'/>
                <input type='text' id='product_quantity'  class='input-xlarge' placeholder='Quantity' required='required' /><br/>
                <input type='submit' id='product_displayer_btn' class='btn btn-primary' value='GO'>
            </form>
        </div>
        <div id='payment_div'>
            <table class='table'>
                <thead>
                <tr>
                    <th>&#8369; Total Cost</th>
                    <th>&#8369; Cash</th>
                    <th>&#8369; Change</th>
                </tr>
                </thead>
                <tbody id = 'payment_tbody'>
                <tr>
                    <th>&#8369; 00.00</th>
                    <th><input id = 'cash_in_hand_input' type='text' class='input-mini' value='00.00' disabled/></th>
                    <th>&#8369; 00.00</th>
                </tr>
                </tbody>
                <tfoot><tr><td colspan='3'><button id='payment_btn' type='button' class='btn btn-success btn-block' disabled>submit</button></td></tr></tfoot>
            </table>
        </div><!--payment_div-->

        <table id='shopping_list_table' class='table table-striped table-hover table-bordered'>
            <thead>
            <tr>
                <th></th>
                <th></th>
                <th>Product Name</th>
                <th>Product Cost</th>
                <th>Quantity</th>
                <th>Subtotal</th>
            </tr>
            </thead>
            <tbody id='shopping_list_tbody'><tr><th rowspan='1000'><i class='icon-th-list'></i> Product List</th></tr></tbody>
            <tfoot id='shopping_list_total_tfoot'></tfoot>
        </table>

        <div id='dialog_div'>
            Product Name: <br/>
            <input type='text' id='product_name_to_transact' readonly='readonly' /><br/>
            Product Cost: <br/>
            <input type='text' id='product_cost_to_transact' readonly='readonly' /> <br/>
            <div id='quantity_div' class="input-prepend">
                <label class='control-label' for='product_quantity' > Product Quantity:</label> <br/>
                <span class="add-on"></span>
                <input type='text' id='product_quantity' />
            </div>
        </div>
        <div id='dialog2_div'></div>
    </div><!--transactionContainerDiv ends-->
    <div id="transactionRecordDiv">
        <br/><br/>
        <span id='currentPage_info_span' class='pull-right label label-info'><i class='icon-bullhorn'></i> Page <span class='page_number'>1</span> out of <span class='max_page'></span></span>
        <div id='pager_info_div'>
            <div class='input-prepend' >

                <!-- searching-->
                <!--
                <div id='search_record_div' class='btn-group'>
                    <input type='hidden' id='searchBy_input' value='t.transaction_date'/>
                    <a type='button' id='searchBy_btn' class='btn dropdown-toggle' data-toggle = 'dropdown'>
                        <i class='icon-calendar'></i> Date &nbsp;<span class='caret'></span>
                    </a>
                    <ul class='dropdown-menu' id='searchBy_ul'>
                        <li><a href='#' tabindex="-1"><i class='icon-calendar'></i> Date <input type='hidden' value='t.transaction_date' /></a></li>
                        <li><a href='#' tabindex="-1"><i class='icon-briefcase'></i> Product Name <input type='hidden' value='p.product_name' /></a></li>
                    </ul>
                </div>

                <input type='text' id='search_record' class='input-xlarge' placeholder='Search record' />
                <!-- end search-->
            </div>
            <form id='pageLimit_form'>
                <span class='label label-info'>Page Limit :</span>
                <input type='text' id='pageLimit' class='input-small' value='5' />
            </form>
        </div><!--page_info_div-->
        <div id ='loading_div'>Loading... <img src='css/img_tbls/loading.gif' title='loading'></div>
        <table class='transaction_record_tbl table table-hover'>
            <thead>
            <tr>
                <th>Transaction Date</th>
                <th>Product</th>
                <th>Number of items</th>
                <th>Income</th>
            </tr>
            </thead>
            <tbody id='transaction_record_tbody'></tbody>
        </table>
        <div id='pagination_content'>
            <div class='pagination'></div><!-- ========= pagination ============= -->
            <input type='hidden' id='currentPage' value='0' />
        </div><!--pagination_content-->

    </div><!--transactionRecordDiv ends -->
</div><!-- main container div ends -->

<!-- ================ HIDDEN ELEMENTS ================== -->
<div id = "product_overlay_div_container"></div>
<div id = "delete_product_confirmation_div" class = "product_warning">
    Sure to delete the selected product(s)?
</div><!-- ================= delete product confirmation div ends ==================-->
<!-- ============ IMPORTS ===============-->
<script type = "text/javascript" src = "javascript/jquery-1.9.1.min.js"></script>
<script type = "text/javascript" src = "javascript/jquery-ui-1.10.2.min.js"></script>
<script type = "text/javascript" src = "javascript/products.js"></script>
<script type = "text/javascript" src = "javascript/transaction.js"></script>
<script type = "text/javascript" src = "javascript/sales.js"></script>
</body>
</html>