<?php
/*
 * Area
 *
 * @package    Elephant
 * @author     Jacky 2015-10-20 11:02:11 星期二
 * @copyright  (c) 2015-2016 Elephant Team
 * @license    http://elephant.software/license
 */
class Model_Area extends Model {

    
    public function hasChild($upid) {

        $result = $this->select(DB::expr('count(*) as count'))
            ->where('upid', '=', $upid)
            ->as_object()
            ->execute()
            ->current();

        return (boolean) $result->count;

    }
    
}