<?php defined('APP_PATH') OR die('No direct script access.');
/*
 * 管理平台核心基类
 *
 * @package    Elephant
 * @author     Elephant Team
 * @copyright  (c) 2015-2016 Elephant Team
 * @license    http://elephant.software/license
 */
class Ept_Store_Controller_Basic extends Ept_Core {

    /**
     * 用户信息
     * 
     * @var object
     */
    protected $_user = null;

    /**
     * 登录耦合
     * 
     * @var boolean
     */
    protected $_login_coupling = true;

    public function before() {

        parent::before();
        $this->_user = new stdClass();
        $this->__couplingForUser();
    }

    /**
     * 当前登录的用户信息
     * 
     * @return object 
     */
    public function getUser() {
        return $this->_user;
    }

    /**
     * 验证用户耦合
     */
    private function __couplingForUser() {

        if ( ! $this->_login_coupling )
            return ;

        if ( ! User::isLogin() )
        {
            $attribute = array(
                'redirect' => URL::site('login.html')
            );
            $this->prompt('-1', '对不起，您还没有登录哦，请先进行登录吧~', $attribute);
            die();
        }
        
        if ( ! count(get_object_vars($this->_user)) )
            $this->_user = User::record();

        $this->_view->assign('user', $this->_user);
    }
}

?>