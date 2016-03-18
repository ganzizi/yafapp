<?php
/*
 * cli entrance file
 *
 * @package    Elephant
 * @author     Elephant Team
 * @copyright  (c) 2015-2016 Elephant Team
 * @license    http://elephant.software/license
 */
define("APP_PATH",  realpath('../'));


function main($argc, $argv) {

    print_r($argc);

    echo "\n-----------\n";

    print_r($argv);

    echo "\n ----------- \n";
}

$config = array(
    "application" => array(
        "directory" => APP_PATH . "/application",
    ),
);

/** Yaf_Application */
$application = new Yaf_Application($config);

$argc = 'argc s';

$argv = 'argv s';

$application->execute("main", $argc,  $argv);

?>