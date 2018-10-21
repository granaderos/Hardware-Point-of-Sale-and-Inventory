<?php

    include "DatabaseConnection.php";
    
    class Transactions extends DatabaseConnection {
        /*------------FOR TRANSACTIONS-----------*/

    	function getProductForTransaction($product_name){

    		$this->open_connection();

    			$sql= "SELECT product_id, product_name, sellingPrice, stock_unit, number_of_stocks
                        FROM products
                        WHERE product_name = ?";
                $stmt = $this->db_holder->prepare($sql);
                $stmt->bindParam(1, $product_name);
                $stmt->execute();

    		$this->close_connection();


            $row = $stmt->fetch();
            if($row[0] != null){
                $prodObj = array('prodID' => $row[0], 'prodName' => $row[1], 'prodPrice' => $row[2], 'prodUnit' => $row[3], 'stocks'=>$row[4]);
                $encoded = json_encode($prodObj);
                echo $encoded;

            }
    	}

        function saveTransaction($productIDs, $quantities){

            $this->open_connection();

                $sql1 = "SELECT CURDATE() AS c_date,CURTIME() AS c_time";
                $stmt1 = $this->db_holder->query($sql1);
                $dateTime = $stmt1->fetch(PDO::FETCH_ASSOC);
                for($ctr=0; $ctr < sizeof($productIDs); $ctr++){
                    $prodID = $productIDs[$ctr];
                    $quantity = $quantities[$ctr];
                    $sql2 = "SELECT transaction_id
                             FROM sales
                             WHERE product_id = ?
                             AND transaction_date = ?";

                    $stmt2  = $this->db_holder->prepare($sql2);
                    $stmt2 -> execute(array($prodID, $dateTime['c_date']));
                    $transactionID = $stmt2->fetch();

                    if($transactionID[0] == ""){
                        $transactionID[0]=$this->addToTransactionsRecord($prodID, $dateTime['c_date'], $quantity);
                    }else{
                        $this->updateTransactionsInfo($transactionID[0],$quantity);
                    }

                    $sql3 = "UPDATE products AS p, sales AS t
                            SET p.number_of_stocks = p.number_of_stocks - ?
                            WHERE p.product_id = t.product_id
                            AND t.transaction_id = ?";
                    $stmt3  = $this->db_holder->prepare($sql3);
                    $stmt3 -> execute(array($quantity,$transactionID[0]));

                }
            $this->close_connection();
        }

        function addToTransactionsRecord($prodID, $datee, $quantity){

            $sql1 = "INSERT INTO sales
                    VALUES(null,?,?)";
            $stmt1  = $this->db_holder->prepare($sql1);
            $stmt1 -> execute(array($prodID, $datee));

            $transactionID = $this->db_holder->lastInsertId();

            $sql2 = "INSERT INTO transactions_info
                    VALUES(?,?)";
            $stmt2  = $this->db_holder->prepare($sql2);
            $stmt2 -> execute(array($transactionID, $quantity));

            return $transactionID;
        }

        function updateTransactionsInfo($transactionID,$quantity){
            $sql = "UPDATE transactions_info
                    SET number_of_items = number_of_items + ?
                    WHERE transaction_id = ?";
            $stmt  = $this->db_holder->prepare($sql);
            $stmt -> execute(array($quantity,$transactionID));
        }

        /*------------END OF TRANSACTIONS-----------*/

        /*-----------FOR TRANSACTION RECORDS---------*/

        function displayTransactionRecords($currentPage,$pageLimit){

            $this->open_connection();

                $sql1 = "SELECT DISTINCT transaction_date
                        FROM sales
                        ORDER BY transaction_date DESC
                        LIMIT $currentPage,$pageLimit"; 
                $stmt1 = $this->db_holder->query($sql1);

                while($date = $stmt1->fetch()){
                    
                    $records = "";
                    $totalIncome = 0;

                    $sql2 = "SELECT p.product_name, CONCAT(ti.number_of_items, ' ' , p.stock_unit),ti.number_of_items*p.sellingPrice
                            FROM products AS p, sales AS t, transactions_info AS ti
                            WHERE p.product_id = t.product_id
                            AND t.transaction_id = ti.transaction_id
                            AND t.transaction_date = ?";                            

                    $stmt2 = $this->db_holder->prepare($sql2);
                    $stmt2 -> execute(array($date[0]));

                    $recLength = 1;
                    while($rec = $stmt2->fetch()){
                        $records .= "<tr >";
                        $records .= "<td>".ucwords($rec[0])."</td>";
                        $records .= "<td>".$rec[1]."</td>";
                        $records .= "<td>".$rec[2]."</td>";
                        //$records .= "<td>&#8369; ".$rec[3]."</td>";
                        $records .= "</tr>";
                        $recLength++;   
                        $totalIncome = $totalIncome+$rec[2];
                    }

                    echo "<tr><th rowspan=".$recLength.">".$date[0]."</th></tr>".$records;
                    echo "<tr class='info totalIncome_tr'><td colspan='5'>Daily Income <i class='icon-hand-right'></i></td><td>&#8369; ".$totalIncome."</td></tr>";
                    
                }

            $this->close_connection();           
        }
        
        function displayPager($pageLimit){

            $pagerLI = "";
            $pagerContent = "";
            $this->open_connection();

                $sql = "SELECT COUNT(DISTINCT t.transaction_date) AS pages
                         FROM sales AS t, products AS p
                         WHERE p.product_id = t.product_id";
                $stmt = $this->db_holder->prepare($sql);
                $stmt -> execute();
                $pages = $stmt->fetch(PDO::FETCH_ASSOC);

                $pages['pages'] = $pages['pages'] / intval($pageLimit);
                $pages['pages'] = ceil($pages['pages']);
                $n_pages = $pages['pages'];
                if($pages['pages'] > 1){

                    if($pages['pages'] > 7){
                        $pages['pages'] = 7;
                    }

                    for($ctr=1;$ctr<=$pages['pages'];$ctr++){
                        if($ctr == 1){
                             $pagerLI .= "<li id=page_".$ctr." class='active'><a href='Javascript:void(0)'>".$ctr."</a></li>";
                        }else{
                             $pagerLI .= "<li id=page_".$ctr." ><a href='Javascript:void(0)'>".$ctr."</a></li>";
                        }                
                    }
                    $pagerContent .="<button class='btn-primary' id='pager_prev'>prev</button>";
                    $pagerContent .="<ul>";
                    $pagerContent .=    $pagerLI;                 
                    $pagerContent .= "</ul>";
                    $pagerContent .= "<button class='btn-primary' id='pager_next'>next</button>";
                }


                $obj = array("pager" => $pagerContent, "n_pages" => $n_pages);
                $encoded = json_encode($obj);
                echo $encoded;

            $this->close_connection();
        }

        function displayMonthlySales($yearSelected){

            $this->open_connection();

                $sql = "SELECT month( t.transaction_date ) , SUM( p.product_price * ti.number_of_items ) AS total
                        FROM products AS p, sales AS t, transactions_info AS ti
                        WHERE p.product_id = t.product_id
                        AND t.transaction_id = ti.transaction_id
                        AND year( t.transaction_date ) = ?
                        GROUP BY month( t.transaction_date )";
                $stmt = $this->db_holder->prepare($sql);
                $stmt -> execute(array($yearSelected));

                $monthlySales = $stmt->fetchAll();

            $this->close_connection();

            $this->close_connection();

            if($monthlySales == null){
                echo "";
            }else{
                $encoded = json_encode($monthlySales);
                echo $encoded;
            }


        }

        function searchTransactionRecords($currentPage, $pageLimit, $toSearch){

            $this->open_connection();

                $sql1 = "SELECT DISTINCT t.transaction_date AS tdate
                            FROM sales AS t, products AS p, employees AS e
                            WHERE p.product_id = t.product_id
                            ORDER BY t.transaction_date DESC
                            LIMIT $currentPage,$pageLimit";
                $stmt1 = $this->db_holder->prepare($sql1);
                $stmt1 -> execute(array($toSearch));
                $found = false;
                while($transaction = $stmt1->fetch(PDO::FETCH_ASSOC)){

                    $records = "";
                    $totalIncome = 0;

                    $sql2 = "SELECT t.transaction_time, CONCAT(e.firstname ,' ', e.lastname), p.product_name, CONCAT(ti.number_of_items, ' ' , p.stock_unit),ti.number_of_items*p.product_price
                                FROM employees AS e, products AS p, sales AS t, transactions_info AS ti
                                WHERE p.product_id = t.product_id
                                AND e.employee_id = t.employee_id
                                AND t.transaction_id = ti.transaction_id
                                AND $searchBy LIKE ?
                                AND t.transaction_date = ?";

                    $stmt2 = $this->db_holder->prepare($sql2);
                    $stmt2 -> execute(array($toSearch, $transaction['tdate']));

                    $recLength = 1;
                    while($rec = $stmt2->fetch()){
                        $records .= "<tr >";
                        $records .= "<td><i class='icon-time'></i> ".$rec[0]."</td>";
                        $records .= "<td>".ucwords($rec[1])."</td>";
                        $records .= "<td>".$rec[2]."</td>";
                        $records .= "<td>".$rec[3]."</td>";
                        $records .= "<td>&#8369; ".money_format('%!.2n', $rec[4])."</td>";
                        $records .= "</tr>";
                        $recLength++;
                        $totalIncome = $totalIncome+$rec[4];
                        $found = true;
                    }
                
                    echo "<tr><th rowspan=".$recLength.">".$transaction['tdate']."</th></tr>".$records;
                    echo "<tr class='info totalIncome_tr'><td colspan='5'>Daily Total Income <i class='icon-hand-right'></i></td><td>&#8369; ".money_format('%!.2n',$totalIncome)."</td></tr>";
                }

            $this->close_connection();

            if(!$found){
                 echo "<tr class='error'><td colspan='6'><span class='text-error'><i class='icon-minus-sign'></i><strong>No Records Found!</strong></span></td></tr>";
            }
        }

            function retrieve_products($inputted_product) {
                $this->open_connection();

                $select_statement = $this->db_holder->prepare("SELECT product_name FROM products WHERE product_name LIKE ?;");
                $select_statement->execute(array($inputted_product));

                $product_array = array();
                while($product = $select_statement->fetch()) {
                    array_push($product_array, $product[0]);
                }

                echo json_encode($product_array);


                $this->close_connection();

            }


        /*-----------END OF TRANSACTION RECORDS---------*/

    }
