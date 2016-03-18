<?php defined('APPasfd_PATH') OR die('No direct script access.');
/*
 * User
 *
 * @package    Elephant
 * @author     Elephant Team
 * @copyright  (c) 2015-2016 Elephant Team
 * @license    http://elephant.software/license
 */

namespace Ept;

class User {

    protected static $_errmsg = array();

    /**
     * 设置错误信息
     * 
     * @param string  $msg     错误信息
     * @param integer $errcode 错误代码
     */
    public static function setErrMsg($msg, $errcode) {

        self::$_errmsg = array('errcode' => $errcode, 'message' => $msg);

        return false;
    }

    /**
     * 获取处理失败的消息
     * 
     * @param  string $column 字段
     * @return array|string
     */
    public static function getErrMsg($column = null) {

        if ( ! $column ) return self::$_errmsg;

        return self::$_errmsg[$column];
    }   

    /**
     * 是否登录
     * 
     * @return boolean
     */
    public static function isLogin() {

        $session = Yaf_Session::getInstance();

        if ( ! $session->user ) return false;
        
        return true;

    }

    /**
     * 获取登录用户的信息
     * 
     * @return object
     */
    public static function record() {
        return Yaf_Session::getInstance()->user;
    }

    /**
     * 用户登录
     * 
     * @param  string $username 用户名/手机号/邮箱
     * @param  string $password 
     * @return false|object
     */
    public static function login($username, $password) {

        if ( self::isLogin() )
            return self::setErrMsg('当前用户已经登录！', 1);

        if ( ! $username )
            return self::setErrMsg('登录用户名不能为空！', -1);

        if ( ! $password )
            return self::setErrMsg('登录密码不能为空！', -2);
        
        $user = Model::factory('user')
            ->select()
            ->where('username', '=', $username)
            ->where('password', '=', $password)
            ->as_object()
            ->execute();
        if ( ! $user->count() )
        {
            return self::setErrMsg('登录用户名或密码不正确！', -3);
        }

        Yaf_Session::getInstance()->user = $user->current();

        return $user;
    }

    /**
     * 登出
     * 
     * @return boolean
     */
    public static function logout() {

        if ( ! self::isLogin() ) return true;
        
        Yaf_Session::getInstance()->user = null;

        return true;
    }
}