<?php


/*
 * cli entrance file
 *
 * @package    Elephant
 * @author     Elephant Team
 * @copyright  (c) 2015-2016 Elephant Team
 * @license    http://elephant.software/license
 */
define("APP_PATH",  realpath('../') . DIRECTORY_SEPARATOR); 

$application = new Yaf_Application(APP_PATH . "conf/application.ini");
$application->bootstrap();


$application->execute(function()
    {
        class_exists('Minion_Task') OR die('Please enable the Minion module for CLI support.');
        set_exception_handler(array('Minion_Exception', 'handler'));
        Minion_Task::factory(Minion_CLI::options())->execute();
    }, null);

?>