<?php
/*
 * 错误异常页面
 *
 * @package    Elephant
 * @author     Elephant Team
 * @copyright  (c) 2015-2016 Elephant Team
 * @license    http://elephant.software/license
 */
use Core\Controller_Core;

class ErrorController extends Controller_Core {
    
    public function errorAction($exception) {

            Output::factory('View')
            ->assign(array(
                'title' => '温馨提示',
                'msg'    => $exception->getMessage(),
            ))
            ->display();
            die();
        
        if ( (int) E_ERROR == $exception->getCode() )
        {
            $msg = '系统内部错误...';
        }
        else if ( (int) E_USER_ERROR == $exception->getCode() )
        {
            $msg = '程序调用错误...';
        }
        else if ( (int) E_WARNING == $exception->getCode() )
        {
            $msg = '系统应用错误异常...';
        }
        else if ( (int) E_USER_WARNING == $exception->getCode() )
        {

            if ( $this->request->isXmlHttpRequest() ) {

                // Json 形式返回

            }

        }
        else
        {
            $msg = '其他类型异常错误';
        }

        echo $msg;


        echo Debug::vars($exception);

        // $this->getView()->assign("exception", $exception);
    }

    
}
?>