<?php

    include "../../classes/ProductsFunctions.php";
    $execute_display = new Products_functions_home();

    $currentPage = $_POST['currentPage'];
    $pageLimit = $_POST['pageLimit'];

    $execute_display->display_products($currentPage, $pageLimit);