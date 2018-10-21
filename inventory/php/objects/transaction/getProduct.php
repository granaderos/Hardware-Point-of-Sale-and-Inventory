<?php
		
	include_once "../../classes/Transactions.php";

    $identifier_val = $_GET['identifier_val'];

	$action = new Transactions();
	$action -> getProductForTransaction($identifier_val);