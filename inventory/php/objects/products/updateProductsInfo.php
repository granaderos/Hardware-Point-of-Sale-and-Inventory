<?php

    include "../../classes/ProductsFunctions.php";
    $execute_update = new Products_functions_home();

    $product_name = $_POST['product_name'];
    $product_price = $_POST['product_price'];
    $products_number_of_stocks = $_POST['products_number_of_stocks'];
    $stock_unit = $_POST['stock_unit'];
    $id = $_POST['id'];

    $execute_update->edit_products_data($id, $product_name, $product_price, $products_number_of_stocks, $stock_unit);