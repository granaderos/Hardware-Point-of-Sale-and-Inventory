<?php


    include "../../classes/ProductsFunctions.php";
    $execute_check = new Products_functions_home();

    $bar_code = $_POST["bar_code"];
    $spaceless_bar_code = preg_replace('/\s+/', '', $bar_code);
    $execute_check->check_bar_code($spaceless_bar_code);

