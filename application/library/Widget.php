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

    /**
     * 实例对象
     * 
     * @var array
     */
    protected static $_instance = array();

    /**
     * 参数
     * 
     * @var array
     */
    protected $_args = array();

    /**
     * 自动渲染模板
     * 
     * @var boolean
     */
    protected $_auto_render = true;

    /**
     * 模板引用值
     * 
     * @var array
     */
    protected $_assign = array();
    
    /**
     * @uses 
     *     Widget::factory('User')
     *         ->arg('name'=>'jacky')
     *         ->arg('type'=>'single')
     *         ->execute('sync', $arg1, $arg2, $arg3);
     * 
     * @param  string $class_name 类名称
     * @return object
     */
    public static function factory($class_name) {

        if ( ! isset(Widget::$_instance[$class_name]) )
        {

            Core::loader('widget', 'classes' . DS . $class_name);

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

    public function args($key, $value = NULL) {

        if ( is_array($key) )
        {
            foreach ($key as $_key => $_value) {

                $this->_args[$_key] = $_value;
            }

        }
        else
        {
            $this->_args[$key] = $value;
        }

        return $this;
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
    public function display($tpl_file = null, $tpl_dir = null) {

        // 库文件目录
        $_libary_path = Yaf_Application::app()->getConfig()->application->library;

        // widget 模板根目录
        $widget_view_path = $_libary_path . DIRECTORY_SEPARATOR . 'Widget' . DIRECTORY_SEPARATOR . 'views';

        if ( null === $tpl_dir )
        {
            $tpl_dir = ltrim(get_class($this), 'Widget_');
            $tpl_dir = strtolower(str_replace('_', DIRECTORY_SEPARATOR, $tpl_dir));
        }

        $tpl_file = $tpl_dir . DIRECTORY_SEPARATOR . $tpl_file;

        View::factory('Smarty', $tpl_dir)->display($tpl_file, $this->_assign, $widget_view_path);
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
        $data = array();
        if (is_array($key)) {
            foreach ($key as $k => $value) {
                $data[$k] = $value;
            }
        } else {
            $data = array(
                $key => $value
            );
        }
        
        $this->_assign = array_merge($this->_assign, $data);
    }


}