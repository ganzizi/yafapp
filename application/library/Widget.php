<?php
/*
 * Widget
 *
 * @package    Elephant
 * @author     Jacky
 * @copyright  (c) 2015-2016 Elephant Team
 * @license    http://elephant.software/license
 */
class Widget {

   protected static $_instance = array();

    protected $_auto_render = TRUE;

    protected $_args = array();

    protected $_assign = array();
    
    public static function factory($class_name) {

        if ( ! isset(Widget::$_instance[$class_name]) )
        {
            Core::loader('widgets', 'classes' . DS . $class_name);

            $_class_name = 'Widget\\' . $class_name;

            Widget::$_instance[$class_name] = new $_class_name;
        }

        return Widget::$_instance[$class_name];
    }

    public function __call($method, $args) {
        throw new Core_Exception("class :class does not have a method :method", array(
            ':class'  => get_class($this),
            ':method' => $method
        ), E_USER_ERROR);
    }

    /**
     * execute
     * 
     * @param  string $method_name 方法名称
     * @return mix                
     */
    public function execute($method_name) {

        $params = func_get_args();
        unset($params[0]);

        $rs = call_user_func_array(array($this, $method_name), $params);

        if ( $this->_auto_render )
            $this->display($method_name);

        return $rs;
    }

    /**
     * 渲染模板显示
     * 
     * @param  string $tpl_file 模板文件
     * @param  string $tpl_dir  模板目录
     * @return void
     */
    public function display($tpl_file, $tpl_dir = null) {

        if ( NULL === $tpl_dir )
        {
            $tpl_dir = str_replace('\\', DS, strtolower(get_class($this)));
            $tpl_dir = substr($tpl_dir, strlen(get_class()) + 1);    
        }
        
        $tpl_file = $tpl_dir . DS . $tpl_file;

        Output::factory('Smarty')->assign($this->_assign)->display($tpl_file, 'widgets');
    }

    /**
     * 传值
     * 
     * @param  string/array $key    key/value
     * @param  string       $value  value
     * @return mix
     */
    public function assign($key, $value = NULL)
    {
        if ( is_array($key) )
        {
            foreach ($key as $_key => $_value) {

                $this->_assign[$_key] = $_value;
            }
        }
        else
        {
            $this->_assign[$key] = $value;
        }

        return $this;
    }
}