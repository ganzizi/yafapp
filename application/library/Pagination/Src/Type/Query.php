<?php
/*
 * Tyep Query
 *
 * @package    Elephant
 * @author     Elephant Team
 * @copyright  (c) 2015-2016 Elephant Team
 * @license    http://elephant.software/license
 */
class Pagination_Src_Type_Query extends Pagination
{
    protected function _get_count ()
    {
        if ($this->_count == null) {
            $object = clone $this->_object_list;
            $object->select(array(
                DB::expr('count(*)'),
                'count'
            ));
            $this->_count = $object->execute()->get('count');
        }
        return $this->_count;
    }
}


<?php defined('APP_PATH') or die('No direct script access.');
/**
 * select
 * 
 * @package    Elephant
 * @author     Elephant Team
 * @copyright  (c) 2015-2016 Elephant Team
 * @license    http://elephant.software/license
 */
class Pagination_Type_Select extends Pagination
{
    protected function _get_count () {
       
        $sql = str_replace('from', ', count(*) as count from ', $this->_object_list->lastSql());

        $list = DB::Query(Database::SELECT, $sql)->as_object()->execute()->current();

        return $list->count;
    }
    
}