<?php
    include "../../classes/ProductsFunctions.php";
    $execute_check = new Products_functions_home();

    $execute = $_POST["execute"];

    if($execute == "check_edited_product_name") {
        // ========= Means, ig check ang new edited product name kay bangin magkapareho na ha iba. Need the ID!
        $execute_check->check_if_product_to_add_already_exist($_POST['product_name'], null, $_POST["product_id"]);
    } else {
        // ========= Check the product to add if it was already on the record.
        // ============== Product to add null ! Kainlangan pa ipasa na naka-object. TSK >.< ===========
        $product_data = $_POST["product_data"];
        $decoded_data = json_decode($product_data, true);
        foreach($decoded_data as $content) {
            $$content['name'] = $content['value'];
        }
        $execute_check->check_if_product_to_add_already_exist($product_name, $description, null);
    }


