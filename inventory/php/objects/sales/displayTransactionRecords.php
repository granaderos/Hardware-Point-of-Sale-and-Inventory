<?php
	include_once '../../classes/Transactions.php';

	$currentPage = $_POST['currentPage'];
	$pageLimit = $_POST['pageLimit'];
	$action = new Transactions();
	$action -> displayTransactionRecords($currentPage,$pageLimit);
