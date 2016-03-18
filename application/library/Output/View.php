<?php
/**
 * view
 *
 * @author jacky<isme.jac@gmail.com>
 * @copyright Copyright (c) 2916 (http://www.elephant.net)
 */
namespace Output;

use Yaf\View_Interface;
use Yaf\Exception;
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
     * @var null
     */
    protected $_tpl_root_dir;

    /**
     * 模板变量
     * 
     * @var null
     */
    protected $_tpl_vars = array();

    /**
     * 模板类型 Yaf_View_Simple、Smarty
     * 
     * @var string
     */
    protected $_tpl_type = 'Yaf_View_Simple';

    public function __construct($tpl_dir = null, array $tpl_config = array()) {

        $this->_instance($tpl_dir, $tpl_config);
    }
    
    protected function _instance($tpl_dir = null, array $tpl_config = array()) {
        
        $this->_tpl_root_dir = $tpl_config['template_dir'];
    }
    
    public function display($name, $tpl_vars = array()) { }

    public function assign($spec, $value = null) { }

    public function render($name, $tpl_vars = null) {

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
    public function setScriptPath($tpl_dir = null) {

        if ( ! $tpl_dir )
        {
            $request = Dispatcher::getInstance()->getRequest();

            if ( $request->module == 'Index' )
                $tpl_dir = 'views';
            else
                $tpl_dir = 'modules' . DS . $request->module . DS . 'views'; 

        }
        else
        {
            $tpl_dir = substr_replace('/', DS, $tpl_dir);
        }

        if ( is_readable($tpl_dir) )
        {
            $this->_tpl_dir = $tpl_dir;
        }
        else
        {
            $this->_tpl_dir = $this->_tpl_root_dir . DS . $tpl_dir;

            if ( ! is_readable($this->_tpl_dir) )
            {
                throw new Exception('Invalid path provided' . $this->_tpl_dir);
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