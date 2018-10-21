<?php

    include "../../classes/ProductsFunctions.php";
    $execute_delete = new Products_functions_home();

    $product_ids_to_delete = $_POST['product_ids_to_delete'];
    $id_size = count($product_ids_to_delete);
    $counter = 0;

    while($counter < $id_size) {
        $execute_delete->delete_product($product_ids_to_delete[$counter]);
        $counter++;
    }