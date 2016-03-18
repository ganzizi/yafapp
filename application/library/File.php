<?php
/**
 * File system
 * 
 * @package    Elephant
 * @author     Elephant Team
 * @copyright  (c) 2015-2016 Elephant Team
 * @license    http://elephant.software/license
 */
class File {

    public static function createDir($sub_directory, $root_directory = NULL) {

        if ( NULL === $root_directory )
        {
            $root_directory = '/';
        }
        else
        {
            if ( ! is_dir($root_directory) )
            {
                throw new Ept_Exception("对不起，根目录不可写，无法完成创建。:root_directory", array(
                    ':root_directory' => $root_directory
                ), E_ERROR);
            }
        }

        $sub_directorys = explode('/', $sub_directory);

        // 处理目录
        $_hdir = $root_directory;

        foreach ($sub_directorys as $ex_dir) {

            $_hdir .= DIRECTORY_SEPARATOR . $ex_dir;

            if ( is_dir($_hdir) ) continue;

            if ( ! @mkdir($_hdir) ) throw new Ept_Exception("对不起，目录无法完成创建，可能是目录不可写。:directory", array(
                ':directory' => $_hdir
            ), E_ERROR);
        }

        return true;
    }




}