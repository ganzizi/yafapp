<?php
/**
 * Json
 *
 * @author jacky<isme.jac@gmail.com>
 * @copyright Copyright (c) 2916 (http://www.elephant.net)
 */
namespace Output;
class Xml extends \Output{

    public function render() {

        $this->setHeader('Content-Type', 'application/xml; charset=utf8');

        $xml = \Xml::factory('Soap')->array_to_xml(array('body' => $this->_vars));

        return $this->setBody($xml);
    }

    public function display() {
        $this->render()->response();
        die();
    }
}