<?php

    include_once "DatabaseConnection.php";
    class Products_functions_home extends DatabaseConnection {

        function check_if_product_to_add_already_exist($product_name, $description, $product_id) {
            $this->open_connection();
            if($product_id == "") {
                $select_statement = $this->db_holder->prepare("SELECT * FROM products WHERE product_name = ?;");
                $select_statement->execute(array(trim($product_name)));
                if($select_statement->fetch()) {
                    echo "true";
                }

            } else {
                $select_statement = $this->db_holder->prepare("SELECT * FROM products WHERE product_name = ? AND description = ? AND product_id != ?;");
                $select_statement->execute(array($product_name, $description, $product_id));

                if($select_statement->fetch()) {
                    echo "true";
                }
            }
            $this->close_connection();
        }

        function add_product($product_name, $productDescription, $originalPrice, $sellingPrice, $number_of_stocks, $stock_unit) {
            $this->open_connection();

            $insert_statement = $this->db_holder->prepare("INSERT INTO products VALUES (null, ?, ?, ?, ?, ?, ?);");
            $insert_statement->execute(array($product_name, $productDescription, $originalPrice, $sellingPrice, $number_of_stocks, $stock_unit));

            $this->close_connection();
        }

        function display_products($currentPage, $pageLimit) {
            $this->open_connection();

            $select_statement = $this->db_holder->query("SELECT * FROM products
                                                           ORDER BY product_name, description
                                                           LIMIT $currentPage, $pageLimit;");
            while($content = $select_statement->fetch()) {
                $originalPrice = $this->moneyFormat($content[3]);
                $sellingPrice = $this->moneyFormat($content[4]);

                // ================== check first product name if characters are greater than 15 ====
                $product_name_length = strlen($content[1]);
                if($product_name_length > 15) {
                    $product_name = "<span>".substr($content[1], 0, 15)."</span><span onmouseover = 'show_complete_product_name(".$content[0].")' class = 'label label-info pointer'> ></span>";
                } else {
                    $product_name = "<span>".$content[1]."</span>";
                }
                echo "<tr id = '".$content[0]."'>";
                echo    "<td ondblclick = 'edit_products_name(".$content[0].")'>".$product_name."<br /><span class='productsDescription'>".$content[2]."</span></td>";
                echo    "<td ondblclick = 'editOriginalPrice(".$content[0].")'>&#8369;<span id = 'product_price_span'>".$originalPrice."</span></td>";
                echo    "<td ondblclick = 'editSellingPrice(".$content[0].")'>&#8369;<span id = 'product_price_span'>".$sellingPrice."</span></td>";
                echo    "<td ><span id='stock".$content[0]."'>".$content[5]."</span>&nbsp;<button class = 'btn btn-info' id='addStocksButton' title='add stocks' onclick='addStocks(".$content[0].")'>+</button></td>";
                echo    "<td ondblclick = 'edit_products_stock_unit(".$content[0].")'>".$content[6]."</td>";
                echo    "<td class = 'product_delete_action'><input title='delete' type = 'checkbox' class = 'mark_this' id = 'product_check_box_".$content[0]."' /></td>";
                echo "</tr>";
            }
            $this->close_connection();
        }

        function delete_product($id) {
            $this->open_connection();

            $delete_statement = $this->db_holder->prepare("DELETE FROM products WHERE product_id = ?;");
            $delete_statement->execute(array($id));

            $this->close_connection();
        }

        function search_product($product_name_to_search) {
            $this->open_connection();

            $select_statement = $this->db_holder->prepare("SELECT * FROM products
                                                           WHERE product_name LIKE ?
                                                           ORDER BY product_name;");
            $select_statement->execute(array($product_name_to_search));

            while($content = $select_statement->fetch()) {
                $position = strpos($content[3], ".");
                if($position != "") {
                    // ========= With decimal prices greater than 0 ============
                    $whole_number = substr($content[3], 0, $position - 1);
                    $formatted_whole_number = number_format($whole_number);
                    $decimal = substr($content[3], $position);
                    $product_price = $formatted_whole_number.$decimal;
                } else {
                    $product_price = number_format($content[3]).".00";
                }
                // ================== check first product name if characters are greater than 15 ====
                $product_name_length = strlen($content[1]);
                if($product_name_length > 15) {
                    $product_name = "<span>".substr($content[1], 0, 15)."</span><span onmouseover = 'show_complete_product_name(".$content[0].")' class = 'label label-info pointer'> ></span>";
                } else {
                    $product_name = "<span>".$content[1]."</span>";
                }
                echo "<tr id = '".$content[0]."'>";
                echo    "<td ondblclick = 'edit_products_name(".$content[0].")'>".$product_name."<br /><span class='productsDescription'>".$content[2]."</span></td>";
                echo    "<td ondblclick = 'editOriginalPrice(".$content[0].")'>&#8369;<span id = 'product_price_span'>".$originalPrice."</span></td>";
                echo    "<td ondblclick = 'editSellingPrice(".$content[0].")'>&#8369;<span id = 'product_price_span'>".$sellingPrice."</span></td>";
                echo    "<td ><span id='stock".$content[0]."'>".$content[5]."</span>&nbsp;<button class = 'btn btn-info' id='addStocksButton' title='add stocks' onclick='addStocks(".$content[0].")'>+</button></td>";
                echo    "<td ondblclick = 'edit_products_stock_unit(".$content[0].")'>".$content[6]."</td>";
                echo    "<td class = 'product_delete_action'><input title='delete' type = 'checkbox' class = 'mark_this' id = 'product_check_box_".$content[0]."' /></td>";
                echo "</tr>";
            }

            $this->close_connection();
        }

        function getProductTotalPages($productName){
            $this->open_connection();

            $sql = "SELECT COUNT(product_id) FROM products
                        WHERE product_name LIKE ?;";
            $stmt = $this->db_holder->prepare($sql);
            $stmt -> bindParam(1, $productName);
            $stmt -> execute();
            $this->close_connection();
            $totalPages = $stmt->fetch();
            return $totalPages[0];

        }

        function addStocks($productID, $stocksToAdd) {
            $this->open_connection();
            $updateStatement = $this->db_holder->prepare("UPDATE products SET number_of_stocks = (SELECT SUM(number_of_stocks+?))
                                                            WHERE product_id = ?;");
            $updateStatement->execute(array($stocksToAdd, $productID));
            $this->close_connection();
        }

    function moneyFormat($amount) {
        $position = strpos($amount, ".");
        if($position != "") {
            // ========= With decimal prices greater than 0 ============
            $whole_number = substr($amount, 0, $position);
            $whole_number = (double) $whole_number;
            $formatted_whole_number = number_format($whole_number);
            $decimal = substr($amount, $position);
            return $formatted_whole_number.$decimal;
        } else {
            return number_format($amount).".00";
        }
    }

    }