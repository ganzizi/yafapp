<?php
/**
 * view
 *
 * @author jacky<isme.jac@gmail.com>
 * @copyright Copyright (c) 2916 (http://www.elephant.net)
 */
use Yaf\Registry;
use Yaf\Dispatcher;
use Yaf\Response\Http;
use Yaf\Response_Abstract;

class Output extends Http {

    protected static $_initialize = array();

    protected $_output_type = NULL;

    protected $_vars = NULL;

    public static function factory($output_type = NULL, $tpl_dir = NULL, array $tpl_config = array()) {
        
        if ( NUll === $output_type )
        {
            $request = Dispatcher::getInstance()
                ->getRequest();

            if ( $request->isXmlHttpRequest() )
            {
                $output_type = 'Json';
            }
        }

        if ( ! isset( Output::$_initialize[$output_type] ) )
        {
            if ( count($tpl_config) == 0 )
            {
                $tpl_config = Registry::get("config")->get("view")->toArray();
            }
            
            if ( $output_type == 'Smarty' || $output_type == 'View')
            {
                $initialize = new Smarty_Adapter($tpl_dir, $tpl_config);
            }
            else
            {
                $class = '\Output\\' . $output_type;
                $initialize = new $class($tpl_dir, $tpl_config);
            }

            $s = Output::$_initialize[$output_type] = $initialize;
            
        }

        return Output::$_initialize[$output_type];
    }

    public function __construct() {

        if ( NULL === $this->_output_type )
        {
            $this->_output_type = substr(get_class($this), strlen(get_class()) + 1);    
        }

        parent::__construct();
    }   

    public function assign($key, $value = NULL) {

        if ( is_array($key) )
        {
            foreach ($key as $_key => $_value) {
                $this->_vars[$_key] = $_value;
            }
        }
        else
        {
            $this->_vars[$key] = $value;
        }

        return $this;
    }
 
}