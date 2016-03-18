<?php
class Task_Test extends Task {

    protected $_options = array(
        'limit' => 4,
        'table' => NULL,
    );
    
    protected function _execute(array $params) {

        print_r($params);

        die();
    }
}
?>