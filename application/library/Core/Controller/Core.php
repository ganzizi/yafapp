<?php
/**
 * Controller_Core 
 *
 * @author jacky<isme.jac@gmail.com>
 * @copyright Copyright (c) 2016 (http://www.elephant.net)
 */
namespace Core;

use Yaf\Controller_Abstract;
use Yaf\Application;

class Controller_Core extends Controller_Abstract {

    /**
     * output type
     * 
     * @var string View|Json|Xml
     */
    protected $_output_type = NULL;

    /**
     * init
     */
    public function init() {

        $this->_initialize();
    }

    public function before() {

    }

    /**
     * _initialize
     */
    protected function _initialize() {

        $this->before();


        // if ( $this->getRequest()->isXmlHttpRequest() )
        // {
        //     $this->yafAutoRender = false;
        // }
        // else
        // {
        // 
            $this->_assign();

        // }
    }


    protected function _assign() {

        $this->_view->assign('request', $this->getRequest());
    }

    /**
     * failure
     *
     * @param  string        $msg    错误信息
     * @param  array|string  $attribute 附加信息
     * @return mix
     */
    public function failure($msg, $title = NULL, $output_type = NULL)
    {
        echo $this->tips($msg, $title, 1, $output_type);
        exit();
    }

    /**
     * succeed
     * 
     * @param  string $msg       返回信息
     * @param  array  $response     附加信息
     * @param  string $output_type  输出类型
     * @return void
     */
    public function succeed($msg = NULL, $attribute = NULL, $output_type = NULL) {
        
        echo $this->output($msg, $attribute, 0, $output_type);
        exit();
    }

    /**
     * 操作提示与输出
     *
     * $this->tips('姓名不能为空', '')
     * 
     * @param  array      $msg         处理结果
     * @param  array|NULL $attribute   附加数据
     * @param  boolean    $redirect    跳转
     * @param  string     $output_type 输出类型
     * @return string
     */
    public function tips($msg = NULL, $title = NULL, $errcode = 0, $output_type = NULL) {

        // Output type
        if ( ! $output_type )
        {
            // Output type
            if ( ! $this->_output_type )
            {
                if ( $this->getRequest()->isXmlHttpRequest() )
                {
                    $output_type = 'Json';
                }
                else
                {
                    $output_type = 'Smarty';
                }
            }
            else
            {
                $output_type = $this->_output_type;
            }
        }

        // output data
        // -----------------------------------
        $assign = array(
            'errcode' => $errcode
        );

        if ( $msg )
            $assign['msg'] = $msg;      

        if ( $title )
            $assign['title'] = $title;
        // -----------------------------------

        \Output::factory($output_type)
            ->assign($assign)
            ->display('error/error', NULL, Application::app()->getConfig()->view->template_dir);
    }

    public function __get($name) {
        
        if ( $name == 'yafAutoRender' )
        {
            $this->yafAutoRender = true;
        }

        if ( isset($this->$name) )
        {
            return $this->$name;
        }
        
        $_name = '_' . $name;

        if ( isset($this->$_name))
        {
            return $this->$_name;
        }

        $_name = '_' . $_name;
        if ( isset($this->$_name))
        {
            return $this->$_name;
        }
    }
}

?>