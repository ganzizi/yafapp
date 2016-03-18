<?php
/**
 * Yaf.app 
 *
 * 程序入口（普通请求、API请求）
 *
 * @author jacky<isme.jac@gmail.com>
 * @copyright Copyright (c) 2916 (http://www.elephant.net)
 */

use Yaf\Application;

define("DS", DIRECTORY_SEPARATOR);

define('ROOT_PATH', realpath(dirname(__FILE__).'/../'));

// try
// {
    $app  = new Application(ROOT_PATH . DS ."conf" . DS . "application.ini");

    $app->bootstrap()->run();
// }
// catch(Exception $e)
// {

//     print_r($e->getMessage());
// }


