<?php
/*
 * Tyep Select
 *
 * @package    Elephant
 * @author     Elephant Team
 * @copyright  (c) 2015-2016 Elephant Team
 * @license    http://elephant.software/license
 */
class Pagination_Src_Type_Select extends Pagination_Pagination
{
    protected function _get_count ()
    {
        if ( null === $this->_count ) {

            $count_object = clone $this->_object_list;
            $count_object->select(array(
                DB::expr('count(*)'),
                'count'
            ));

            $this->_count = $count_object->execute()->get('count');
        }

        return $this->_count;
    }
}