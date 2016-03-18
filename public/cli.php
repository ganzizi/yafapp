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

$app  = new Yaf_Application(APP_PATH . "/conf/application.ini");
$app->bootstrap()->run();


$request = new Yaf_Request_Simple("CLI", "Index", "Controller", "Hello", array("para" => 2));
print_r($request);

?>