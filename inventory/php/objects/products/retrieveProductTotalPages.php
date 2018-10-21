<?php
    include "../../classes/ProductsFunctions.php";

    $productName = $_POST['productName'].'%';

    $action = new Products_functions_home();
    $totalPages = $action -> getProductTotalPages($productName);

    echo $totalPages;