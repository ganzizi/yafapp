<?php
/*
 * 核心基类
 *
 * @package    Elephant
 * @author     Elephant Team
 * @copyright  (c) 2015-2016 Elephant Team
 * @license    http://elephant.software/license
 */
namespace Ept\Controller;

class Controller_Core extends Controller_Abstract {

    /**
     * output type
     * 
     * @var string text/html|json|xml
     */
    protected $_output_type = null;

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
     * @param  string        $result    错误信息
     * @param  array|string  $attribute 附加信息
     * @return mix
     */
    public function failure($result = null, array $attribute = null, $output_type = null)
    {
        echo $this->output($result, $attribute, 1, $output_type);
        exit();
    }

    /**
     * succeed
     * 
     * @param  string $result       返回信息
     * @param  array  $response     附加信息
     * @param  string $output_type  输出类型
     * @return void
     */
    public function succeed($result = null, array $attribute = null, $output_type = null) {
        
        echo $this->output($result, $attribute, 0, $output_type);
        exit();
    }

    public function processed($result, array $attribute = null, $output_type = null) {
        
        $result = (boolean) $result;

        if ( $result )
            $this->succeed($result, $attribute, $output_type);
        else
            $this->failure($result, $attribute, $output_type);

    }

    /**
     * 信息提示与输出
     * 
     * @param  array      $result      处理结果
     * @param  array|null $attribute   附加数据
     * @param  boolean    $redirect    跳转
     * @param  string     $output_type 输出类型
     * @return string
     */
        
    public function output($result = null, $attribute = null, $errcode = 1, $output_type = null) {

        // Output type
        if ( ! $output_type )
        {

            // Output type
            if ( ! $this->_output_type )
            {
                if ( $this->getRequest()->isXmlHttpRequest() )
                {
                    $output_type = 'json';
                }
                else
                {
                    $output_type = 'text/html';
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

        if ( $result )
            $assign['result'] = $result;      

        if ( $attribute )
            $assign['attribute'] = $attribute;
        // -----------------------------------

        // header
        $response = $this->getResponse();
        
        $response->setHeader('Content-Type', 'text/html; charset=utf8');

        // output format
        if ( "json" == $output_type )
        {
            $response->setBody(Json::encode($assign))->response();
        }
        else if ( "xml" == $output_type )
        {
            die("<h1>待开发...</h1>");
        }
        else
        {
            if ( isset($attribute['redirect']) )
            {
                $this->redirect($attribute['redirect']);
            }
            else
            {
                $this->_view->assign($assign);

                $response->setBody($output)->response();
            }
        }
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