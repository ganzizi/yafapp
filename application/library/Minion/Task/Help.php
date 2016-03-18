<?php defined('APP_PATH') or die('No direct script access.');
/**
 * Help task to display general instructons and list all tasks
 *
 * @package    Kohana
 * @category   Helpers
 * @author     Kohana Team
 * @copyright  (c) 2009-2011 Kohana Team
 * @license    http://kohanaframework.org/license
 */
class Task_Help extends Minion_Task
{
    /**
     * Generates a help list for all tasks
     *
     * @return null
     */
    protected function _execute(array $params)
    {
        $tasks = $this->_compile_task_list(Ept::list_files('/Task'));

        foreach ($tasks as $key => $task) {

            echo ' * ' . $task . "\n";

        }
    }
}
