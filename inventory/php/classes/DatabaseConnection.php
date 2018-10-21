<?php
    class DatabaseConnection {

		private $db_host =  "mysql:host=localhost;";
		private $db_name = "dbname=inventory";
		private $db_user = "root";
		private $db_pass = "";
        protected $db_holder;

        protected function open_connection() {
            $this->db_holder = new PDO($this->db_host.$this->db_name, $this->db_user, $this->db_pass);
        }

        protected function close_connection() {
            $this->db_holder = null;
        }

    }