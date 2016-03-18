<?php
/*
 * http request entrance file
 *
 * @package    Elephant
 * @author     Elephant Team
 * @copyright  (c) 2015-2016 Elephant Team
 * @license    http://elephant.software/license
 */

define("APP_PATH",  realpath('../'));


$app  = new Yaf_Application(APP_PATH . "/conf/application.ini");
$app->bootstrap()->run();