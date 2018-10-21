<?php
    include "../../classes/Transactions.php";
    $execute_retrieve = new Transactions();

    $inputted_product = $_POST["inputted_product"]."%";
    $execute_retrieve->retrieve_products($inputted_product);