<?php
/**
 * bootstrap 
 *
 * @author jacky
 * @copyright Copyright (c) 2916 (http://www.elephant.net)
 */
use Yaf\Bootstrap_Abstract;
use Yaf\Application;
use Yaf\Registry;
use Yaf\Dispatcher;
use Yaf\Loader;

class Bootstrap extends Bootstrap_Abstract{
    

    public function _initConfig() {


        $config = Application::app()->getConfig();
        Registry::set('config', $config);
    

        if ( ! function_exists('__'))
        {
           
            function __($string, array $values = NULL, $lang = 'en-us')
            {
                if ($lang !== I18n::$lang)
                {
                    $string = I18n::get($string);
                }

                return empty($values) ? $string : strtr($string, $values);
            }
        }
    }

    public function _initRoute(Dispatcher $dispatcher) {
        
    }
    
    public function _initPlugin(Dispatcher $dispatcher) {

    }

    public function _initView(Dispatcher $dispatcher) {
        

        // print_r($dispatcher);

        // die();

        $dispatcher->setView(Output::factory('Smarty'));
    }
    
    protected function _init_core($params) {

    }

    public function _initDatabase() {
        
    }

    public function _initPaths() {

        $application = Application::app()->getConfig()->application;

        $modules  = explode(',', $application->modules);

        foreach ($modules as $module) {

            if ( $module == 'Index' )
                continue;

            $paths[] = $application->module . DS . $module;
        }
        Core::paths($paths);
    }
}
