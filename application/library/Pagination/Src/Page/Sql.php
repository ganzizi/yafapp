<?php defined('SYSPATH') or die('No direct script access.');

class Mysite_Paginator_Page_Sql extends Mysite_Paginator_Page
{

    protected function get_object_list ()
    {

        $query = clone $this->paginator->object_list;

        $sql = $this->paginator->object_list->lastSql();
        $sql .= sprintf(' limit %d offset %d ', $this->_limit, $this->_offset);

        $rs = DB::Query(Database::SELECT, $sql)
            ->execute();

        return $rs->as_array();
    }
}
