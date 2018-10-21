<?php
    include "../../classes/ProductsFunctions.php";
    $execute_show = new Products_functions_home();

    $id = $_POST["id"];
    $execute_show->show_complete_product_name($id);