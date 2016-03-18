<?php
/*
 * User
 *
 * @package    Elephant
 * @author     Jacky 2015-10-10 17:30:06 星期六
 * @copyright  (c) 2015-2016 Elephant Team
 * @license    http://elephant.software/license
 */
class Model_Store extends Model {

    protected $_created_column = array(
        'column' => 'created',
        'format' => 'Y-m-d H:i:s'
    );

    protected $_updated_column = array(
        'column' => 'updated',
        'format' => 'Y-m-d H:i:s'
    );
    
}