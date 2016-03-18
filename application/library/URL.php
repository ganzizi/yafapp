<?php
/*
 * URL
 *
 * @package    Elephant
 * @author     Elephant Team
 * @copyright  (c) 2015-2016 Elephant Team
 * @license    http://elephant.software/license
 */
class Url extends Ept_URL{

    /**
     * URL 的基本路径
     * @param  string  $protocol 协议
     * @param  boolean $index    默认
     * @return string            
     */
    public static function base($protocol = NULL, $index = FALSE) {
        
        return 'http://' . $_SERVER['SERVER_NAME'] . '/';
    }

    // public static function site($uri = NULL) {
    //     return URL::base() . '/' . ltrim($uri, '/');
    // }

    public static function media($uri) {

        return URL::base() . '/media/' . ltrim($uri, '/');
    }

    public static function store($uri) {

        return URL::base() . '/store/' . ltrim($uri, '/');

    }

    public static function blog($uri = null) {

        return URL::base() . '/blog' . ltrim($uri, '/');
    }

    public static function admin($uri) {

        return URL::base() . '/admin/' . ltrim($uri, '/');
    }

    public static function sys($uri) {

        return URL::base() . '/sys/' . ltrim($uri, '/');
    }
}
?>