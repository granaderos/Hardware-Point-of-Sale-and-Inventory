<?php

    include "../../classes/ProductsFunctions.php";
    $execute_add = new Products_functions_home();

    $products_data = $_POST["products_data"];
    $decoded_products_data = json_decode($products_data, true);

    foreach($decoded_products_data as $content) {
        $$content['name'] = $content['value'];
    }


    $execute_add->add_product($product_name, $productDescription, $originalPrice, $sellingPrice, $number_of_stocks, $stock_unit);

