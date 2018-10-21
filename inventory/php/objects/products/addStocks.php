<?php
    include "../../classes/ProductsFunctions.php";

    $productID = $_POST['productID'];
    $stocksToAdd = $_POST['stocksToAdd'];

    $action = new Products_functions_home();
    $action -> addStocks($productID, $stocksToAdd);