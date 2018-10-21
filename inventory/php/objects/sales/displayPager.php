<?php
	
	include_once '../../classes/Transactions.php';

	$pageLimit = $_POST['pageLimit'];
	$action = new Transactions();
	$action -> displayPager($pageLimit);