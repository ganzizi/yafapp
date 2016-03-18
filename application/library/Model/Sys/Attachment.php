<?php defined('APP_PATH') OR die('No direct script access.');
/*
 * 核心基类
 *
 * @package    Elephant
 * @author     Elephant Team
 * @copyright  (c) 2015-2016 Elephant Team
 * @license    http://elephant.software/license
 */
class Model_Sys_Attachment extends Model {

    protected $_created_column = array(
        'column' => 'created',
        'format' => 'Y-m-d H:i:s'
    );

    protected $_updated_column = array(
        'column' => 'updated',
        'format' => 'Y-m-d H:i:s'
    );

}