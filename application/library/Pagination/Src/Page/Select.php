<?php
/*
 * Page Select
 *
 * @package    Elephant
 * @author     Elephant Team
 * @copyright  (c) 2015-2016 Elephant Team
 * @license    http://elephant.software/license
 */
class Pagination_Src_Page_Select extends Pagination_Src_Page
{

    protected function get_object_list ()
    {
        $query = clone $this->paginator->object_list;
        $query->limit($this->_limit)->offset($this->_offset);
        $result = $query->execute();
        return $result->as_array();
    }
}
