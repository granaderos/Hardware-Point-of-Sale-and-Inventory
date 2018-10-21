<?php
    include "../../classes/ProductsFunctions.php";
    $execute_display = new Products_functions_home();

    $selected_letter = $_POST['selected_letter'];
    $selected_letter = $selected_letter."%";
    $execute_display->display_products_by_select_letter($selected_letter);