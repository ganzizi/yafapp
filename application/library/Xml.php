<?php
/**
 * Xml 
 *
 * @author jacky<isme.jac@gmail.com>
 * @copyright Copyright (c) 2916 (http://www.elephant.net)
 */
class Xml {

    /**
     * 允许操作的成员
     * 
     * @var array
     */
    protected $_vars = array(
        '_prefix'
    );

    /**
     * 前缀
     * 
     * @var array
     */
    protected $_prefix = array(
        'encoding' => 'ISO-8859-1',
        'version'  => '1.0'
    );

    /**
     * 实例
     * 
     * @var object
     */
    protected static $_instance = NULL;

    public static function factory() {

        if ( NULL === Xml::$_instance )
        {   
            Xml::$_instance = new Xml;
        }

        return Xml::$_instance;
    }

    public function __set($column, $value) {
        $this->set($column, $value);
        return $this;
    }   

    public function set($column, $value) {
        
        $length = count($this->_vars);
        
        for ( $i=0; $i < $length; $i++ )
        {
            $_vars = $this->_vars[$i];
            $_var  = $this->$_vars;

            if ( ! isset($_var[$column]) )
                continue;

            $_var[$column] = $value;

            $this->$_vars = $_var;

            return $this;
        }

        throw new Exception(" Sorry，could not set the member attribute you specify! ");
    }

    public function __get($column) {
        return $this->get($column);
    }

    public function get($column) {

        $length = count($this->_vars);
        for ( $i=0; $i < $length; $i++ )
        {
            $_vars = $this->_vars[$i];
            $_var  = $this->$_vars;

            if ( ! isset($_var[$column]) )
                continue;

            return $_var[$column];
        }

        throw new Exception(" Sorry，could not find the member attribute you specify! ");
    }

    public function xml_prefix($encoding = NULL, $version = NULL) {

        $xml = '<?xml version="%s" encoding="%s"?>';

        if ( NULL === $encoding )
            $encoding = $this->encoding;
        
        if ( NULL === $version )
            $version = $this->version;
        
        return sprintf($xml, $version, $encoding);
    }

    public function array_to_xml($array, $encoding = NULL, $version = NULL) {

        return $this->xml_prefix($encoding, $version) . $this->_array_to_xml($array);
    }

    /**
     * 将数组转换为 xml
     * 
     * @param  array $array 需要转换的数组
     * @return string       
     */
    protected function _array_to_xml($array) {

        $xml = '';

        if ( count($array) == 0 ) return $xml;
        
        foreach ($array as $key => $value) {

            if ( is_array($value) )
            {
                $xml .= sprintf('<%s>%s</%s>',
                    $key,
                    $this->_array_to_xml($value),
                    $key   
                );
            }
            else
            {
                $xml .= sprintf(
                    '<%s>%s</%s>',
                    $key,
                    $value,
                    $key
                );  
            }
        }  

        return $xml;
    }

    public function xmlstr_to_array ($xmlstr, $path = NULL ) {

        $doc = new DOMDocument();
        $doc->loadXML($xmlstr);
        $root = $doc->documentElement;
        $output = $this->domnode_to_array($root);
        $output['@root'] = $root->tagName;

        if ( NULL === $path )
        {
            return $output;
        }

        $paths = explode('.', $path);
        foreach ($paths as $key => $value) {
            $output = $output[$value];
        }
        return $output;
    }

    public function domnode_to_array($node) {
        $output = array();
        switch ($node->nodeType) {
        case XML_CDATA_SECTION_NODE:
        case XML_TEXT_NODE:
            $output = trim($node->textContent);
            break;
        case XML_ELEMENT_NODE:
            for ( $i=0, $m=$node->childNodes->length; $i<$m; $i++ ) {
                $child = $node->childNodes->item($i);
                $v     = $this->domnode_to_array($child);
                
                if( isset($child->tagName) )
                {
                    $t = $child->tagName;

                    if(!isset($output[$t]))
                    {
                        $output[$t] = array();
                    }
                    
                    $output[$t][] = $v;
                }
                elseif($v || $v === '0')
                {
                    $output = (string) $v;
                }
            }
          
            if ( $node->attributes->length && ! is_array($output) )
            {
                // Has attributes but isn't an array
                // Change output into an array.
                $output = array('@content'=>$output);

            }
            if ( is_array($output) )
            {
                if ( $node->attributes->length )
                {
                    $a = array();
                    foreach ( $node->attributes as $attrName => $attrNode )
                    {
                       $a[$attrName] = (string) $attrNode->value;
                    }
                    $output['@attributes'] = $a;
                }

                foreach ( $output as $t => $v )
                {
                    if(is_array($v) && count($v)==1 && $t!='@attributes')
                    {
                        $output[$t] = $v[0];
                    }
                }
            }
            break;
        }
        return $output;
    }




    /**
     * 将xml转换为数组
     * 
     * @param  string $xml    xml
     * @param  array  $filter 过滤字段
     * @return string
     */
    public function xml_simple_to_array($xml, $filter = array()) {

        $_filter = array();
        foreach ($filter as $key => $value) {
            $_filter[] = strtolower($value);
        }

        $xml_parse = xml_parser_create();
        xml_parse_into_struct($xml_parse, $xml, $array, $index);
        xml_parser_free($xml_parse);

        $return = array();
        foreach ( $array as $key => $value )
        {
            $_tag = strtolower($value['tag']);

            if ( in_array($_tag, $_filter))
            {
                continue;
            }
            
            if ( ! empty($value['attributes']) )
            {
                $_arr = array();
                foreach ($value['attributes'] as $k => $val) {
                    $_arr[strtolower($k)] = $val;
                }

                $return[$_tag] = $_arr;
            }
            else
            {
                $return[$_tag] = isset($value['value']) ? $value['value'] : '';
            }
        }

        return $return;
    }

    /**
     * 设置附加属性
     * 
     * @param  array  $array 
     * @return string
     */
    public function attribute($array, $prefix_key = NULL) {

        $_attribute = '';
        foreach ($array as $key => $value) {

            if ( is_array($value) )
            {
                $_attribute .= sprintf(
                    '%s',
                    $this->attribute($value, $key)
                ); 
            }
            else
            {

                if ( NULL !== $prefix_key )
                {
                    $_attribute .= sprintf('%s:%s="%s" ',
                        $prefix_key,
                        $key,
                        $value
                    );
                }
                else
                {
                    $_attribute .= sprintf('%s="%s" ',
                        $key,
                        $value
                    );
                }

                
            }

        }
        return $_attribute;
    }
}