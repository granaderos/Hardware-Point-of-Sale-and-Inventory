<?php
    include "../../classes/ProductsFunctions.php";
    $execute_search = new Products_functions_home();

    $product_name_to_search = $_POST["product_name_to_search"];
    $product_name_to_search = $product_name_to_search."%";
    $execute_search->search_product($product_name_to_search);