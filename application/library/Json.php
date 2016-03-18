<?php
/*
 * Json
 *
 * @package    Elephant
 * @author     Elephant Team
 * @copyright  (c) 2015-2016 Elephant Team
 * @license    http://elephant.software/license
 */
class Json
{
    /**
     * 由于 php 的 json 扩展自带的函数 json_encode 会将汉字转换成 unicode 码
     * 所以我们在这里用自定义的 json_encode，这个函数不会将汉字转换为 unicode 码
     *
     * @param  array $arr
     * @return json
     */
    public static function encode($a = false) {
        if (is_null ( $a ) || (is_string($a) && strtoupper($a) == 'NULL'))
            return "\"\"";      
        if ($a === false)
            return 'false';
        if ($a === true)
            return 'true';
        if (is_scalar ( $a )) {
            if (is_float ( $a )) {
                // Always use "." for floats.
                return floatval ( str_replace ( ",", ".", strval ( $a ) ) );
            }
            
            if (is_string ( $a )) {
                static $jsonReplaces = array (array ("\\", "/", "\n", "\t", "\r", "\b", "\f", '"' ), array ('\\\\', '\\/', '\\n', '\\t', '\\r', '\\b', '\\f', '\"' ) );
                return '"' . str_replace ( $jsonReplaces [0], $jsonReplaces [1], $a ) . '"';
            } else {
                return $a;
            }
        }
        
        $isList = true;
        for($i = 0, reset ( $a ); $i < count ( $a ); $i ++, next ( $a )) {
            if (key ( $a ) !== $i) {
                $isList = false;
                break;
            }
        }
        
        $result = array ();
        if ($isList) {
            foreach ( $a as $v )
                $result [] = Json::encode ( $v );
            return '[' . join ( ',', $result ) . ']';
        } else {
            foreach ( $a as $k => $v )
                $result [] = Json::encode ( $k ) . ':' . Json::encode ( $v );
            return '{' . join ( ',', $result ) . '}';
        }
    }

}