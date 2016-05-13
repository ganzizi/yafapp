<?php
/**
 * view
 *
 * @author jacky<isme.jac@gmail.com>
 * @copyright Copyright (c) 2916 (http://www.elephant.net)
 */
namespace Output;

use Yaf\View_Interface;
use Yaf\Dispatcher;

class View implements View_Interface {

    /**
     * 模板对象
     * 
     * @var object
     */
    protected $_view;

    /**
     * 模板目录
     * 
     * @var string
     */
    protected $_tpl_dir;

    /**
     * 模板的根目录
     * 
     * @var NULL
     */
    protected $_tpl_root_dir;

    /**
     * 模板变量
     * 
     * @var NULL
     */
    protected $_tpl_vars = array();

    /**
     * 模板类型 Yaf_View_Simple、Smarty
     * 
     * @var string
     */
    protected $_tpl_type = 'Yaf_View_Simple';

    public function __construct($tpl_dir = NULL, array $tpl_config = array()) {

        $this->_instance($tpl_dir, $tpl_config);
    }
    
    protected function _instance($tpl_dir = NULL, array $tpl_config = array()) {
        
        $this->_tpl_root_dir = $tpl_config['template_dir'];
    }
    
    public function display($name, $tpl_vars = array()) { }

    public function assign($spec, $value = NULL) { }

    public function render($name, $tpl_vars = NULL) {

        if ( ! $this->_tpl_dir )
        {
            $this->setScriptPath();
        }
    }

    /**
     * setScriptPath
     * 
     * @param  string  $tpl_dir  模板目录
     * @return object  $this 
     */
    public function setScriptPath($tpl_dir = '') {

        if ( ! $tpl_dir )
        {
            $request = Dispatcher::getInstance()->getRequest();

            if ( $request->module == 'Index' )
            {
                $tpl_dir = '';
            }
            else
            {
                $tpl_dir = 'modules' . DS . $request->module; 
            }
        }

        if ( is_readable($tpl_dir) )
        {
            $this->_tpl_dir = $tpl_dir;
        }
        else
        {
            $this->_tpl_dir = rtrim($this->_tpl_root_dir . DS . $tpl_dir, DS) ;


            if ( ! is_readable($this->_tpl_dir) )
            {
                throw new \Core_Exception('Invalid path provided ' . $this->_tpl_dir);
            }
        }

        return $this;
    }

    /**
     * getScriptPath
     * 
     * @return string
     */
    public function getScriptPath() {

        return $this->_tpl_dir;
    }
}