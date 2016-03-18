<?php
/*
 * Ept_Upload
 *
 * @package    Elephant
 * @author     Elephant Team
 * @copyright  (c) 2015-2016 Elephant Team
 * @license    http://elephant.software/license
 */
class Ept_Upload extends Upload {

    /**
     * 上传保存
     * 
     * @param  array  $file          上传的文件
     * @param  string $filename      文件名
     * @param  string $sub_directory 上传文件的子目录
     * @return string filename
     */
    public function save(Array $file, $filename = NULL, $sub_directory = NULL) {

        $filename = parent::save($file, $filename, $sub_directory);

        $filepath = Upload::getFilePath($filename);

        // 获取文件类型
        $size = filesize($filepath);

        $variables = array(
            'size'      => filesize($filepath),
            'type'      => filetype($filepath),
            'mine_type' => mime_content_type($filepath),
            'name'      => $file['name'],
            'filename'  => $filename,
            'using'     => 0
        );

        $rs = Model::factory('Sys_Attachment')
            ->insert($variables)
            ->execute();

        return $filename;
    }
    
    /**
     * 更新附件状态为正常使用状态
     * 
     * @param  string  $filename 文件名
     * @return boolean
     */
    public static function using($filename) {

        return !! Model::factory('Sys_Attachment')
            ->update(array('using' => 1))
            ->where('filename', '=', $filename)
            ->execute();
    }

    public static function del() {
        
        
    }


}