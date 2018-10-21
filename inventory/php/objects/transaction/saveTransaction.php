<?php

    include_once '../../classes/Transactions.php';

    $productIDs = $_POST['productIDs']; //array of product id
    $quantities = $_POST['quantities'];	//array of quantity
    $action = new Transactions();
    $action -> saveTransaction($productIDs, $quantities);