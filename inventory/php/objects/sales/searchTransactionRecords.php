<?php

    include_once '../../classes/Transactions.php';

    $currentPage = $_POST['currentPage'];
    $pageLimit = $_POST['pageLimit'];
    $toSearch = $_POST['toSearch'].'%';
    $action = new Transactions();
    $action -> searchTransactionRecords($currentPage, $pageLimit, $toSearch);
