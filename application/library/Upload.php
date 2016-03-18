<?php
/*
 * Upload
 *
 * @package    Elephant
 * @author     Elephant Team
 * @copyright  (c) 2015-2016 Elephant Team
 * @license    http://elephant.software/license
 */
class Upload {

    /**
     * 上传的最大文件
     * 
     * @var string
     */
    protected $_upload_max_size = 1000000;

    /**
     * 默认上传根路径
     * 
     * @var string
     */
    public static $root_directory = 'uploads';

    /**
     * 初始化
     *
     * @param integer $upload_max_size 最大字节
     * @param void
     */
    public function __construct($upload_max_size = NULL, $root_directory = NULL) {

        if ( NULL !== $upload_max_size )
            $this->_upload_max_size = (int) $upload_max_size;

        // 文件根目录
        $this->setRootDirectory($root_directory);
    }

    /**
     * 设置上传根目录
     *
     * @param  string $root_directory 上传根目相对路径
     * @return $this/Ept_Exception
     */
    public function setRootDirectory($root_directory = null) {

        if ( ! $root_directory )
            $root_directory = Upload::$root_directory;

        // 真实路径
        Upload::$root_directory = realpath($root_directory);

        $variables = array(
            ':directory' => Upload::$root_directory
        ); 

        // 上传根目录不存在
        if ( ! is_dir(Upload::$root_directory) )
            throw new Ept_Exception("对不起，上传根目录不存在。:directory", $variables, E_ERROR);
        
        // 上传根目录不可写
        if ( ! is_writable(Upload::$root_directory) )
            throw new Ept_Exception("对不起，上传根目录不可写。:directory", $variables, E_ERROR);

        return $this;
    }

    /**
     * 保存上传文件
     * 
     * @param  Array  $file          上传的文件
     * @param  string $filename      文件名称
     * @param  string $sub_directory 上传文件的子目录
     * @return string                文件名
     */
    public function save(Array $file, $filename = NULL, $sub_directory = NULL) {

        $this->valid($file);

        // 上传文件名称
        if ( NULL === $filename )
            $filename = $this->createFilename($file);

        // 上传文件目录
        if ( NULL === $sub_directory )
            $sub_directory = Upload::getFileSubDir($filename);
        else
            $sub_directory = ltrim($sub_directory, '/');

        $directory = Upload::$root_directory . DIRECTORY_SEPARATOR . $sub_directory;

        if ( ! is_dir($directory) )
        {
            // 创建目录
            File::createDir($sub_directory, Upload::$root_directory);
        }

        if ( move_uploaded_file($file['tmp_name'], $directory . DIRECTORY_SEPARATOR . $filename) )
        {
            return $filename;
        }

        $variables = array(
            ':directory' => $directory,
            ':filename'  => $filename,
            'file'       => json_encode($file)
        );
        
        throw new Ept_Exception("对不起，保存上传文件失败。directory-:directory，filename-:filename，file-:file", $variables, E_ERROR);
    }   

    /**
     * 检测上传文件的合法性
     * 
     * @param  array $file 上传提交的文件
     * @return void
     */
    public function valid(Array $file) {

        if ( ! isset($file['tmp_name']) || ! is_uploaded_file($file['tmp_name']))
            throw new Ept_Exception("请选择您需要上传的文件", NULL, E_USER_WARNING);
        
        if ( $file['size'] > $this->_upload_max_size  )
        {
            $variables = array(
                ":maxsize" => Text::bytes($this->_upload_max_size),
                ":size"    => Text::bytes($file['size'])
            );

            throw new Ept_Exception("上传文件不能超过:maxsize", $variables, E_USER_WARNING);
        }

        if ( $file['size'] <= 0  )
        {
            throw new Ept_Exception("不能上传空文件", null, E_USER_WARNING);
        }
    }

    /**
     * 创建附件的名称
     * 
     * @param  Array  $file 上传的文件
     * @return string
     */
    public function createFilename(Array $file) {

        return date("ymdHis") . rand(1000, 9999) . '.' . $this->getExtension($file);
    }

    /**
     * 获取文件目录
     * 
     * @return 
     */
    public static function getFileSubDir($filename) {

        if ( strlen($filename) < 16 ) 
            return ;
        
        $filepath = '';
        for ($i = 0; $i < 8; $i++ )
        { 
            $filepath .= $filename{$i};

            if ( $i % 2 != 0 )
                $filepath .= DIRECTORY_SEPARATOR;
        }   

        return rtrim($filepath, DIRECTORY_SEPARATOR);  

    }
    
    /**
     * 获取文件的扩展名
     * 
     * @param  Array  $file 需要上传的文件
     * @return string
     */
    public function getExtension(Array $file) {

        if ( ! isset($file['name']) )
        {
            throw new Ept_Exception("对不起，所需文件不合法， 无法获取文件的扩展名", NULL, E_USER_WARNING);
        }

        return strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
    }

    /**
     * 获取文件路径
     * 
     * @param  string $filename       文件名称
     * @param  string $root_directory 文件根目录 upload、qrcode ...
     * @return string
     */
    public static function getFilePath($filename, $root_directory = NULL) {
        
        if ( NULL === $root_directory )
            $root_directory = Upload::$root_directory;
        
        return realpath($root_directory) . DIRECTORY_SEPARATOR . Upload::getFileSubDir($filename) . DIRECTORY_SEPARATOR . $filename;
    }

    public static function url ($filename, $root_directory = NULL) {

        if ( ! $filename ) return ;

        if ( NULL === $root_directory )
            $root_directory = Upload::$root_directory;

        $path = Upload::getFileSubDir($filename);


        return URL::base($root_directory) . 'uploads/' . str_replace(DIRECTORY_SEPARATOR, '/', $path)
            . '/' . $filename;

    }

    public function thubm() {


    }

}