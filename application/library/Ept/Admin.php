<?php
/**
 * Admin 
 *
 * @author jacky<isme.jac@gmail.com>
 * @copyright Copyright (c) 2916 (http://www.elephant.net)
 */

namespace Ept;

class Admin {

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

    /**
     * 店铺耦合
     * 
     * @var boolean
     */
    protected $_store_coupling = true;

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

            $this->output('对不起，您还没有登录，无权操作~', $attribute, -1);

            die();
        }
        
        if ( ! count(get_object_vars($this->_user)) )
            $this->_user = User::record();

        $this->_view->assign('user', $this->_user);
    }

}