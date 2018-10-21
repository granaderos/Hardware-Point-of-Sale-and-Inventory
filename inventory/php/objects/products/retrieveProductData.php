<?php
    include "../../classes/ProductsFunctions.php";
    $execute_retrieve = new Products_functions_home();

    $id = $_POST["id"];
    $data_to_retrieve = $_POST["data_to_retrieve"];
    $execute_retrieve->retrieve_product_data($id, $data_to_retrieve);