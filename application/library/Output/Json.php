<?php
/**
 * Json
 *
 * @author jacky<isme.jac@gmail.com>
 * @copyright Copyright (c) 2916 (http://www.elephant.net)
 */
namespace Output;

use Yaf\Response_Abstract;

class Json extends \Output{

    public function render($errcode = 0) {

        $this->assign('errcode', $errcode);

        $this->setHeader('Content-Type', 'application/json; charset=utf8');

        return $this->setBody(\Json::encode($this->_vars));
    }

    public function display($errcode = 0) {
        
        $this->render($errcode)->response();
        die();
    }
}