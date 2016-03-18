<?php
/**
 * Widget Upload
 *
 * @author jacky<isme.jac@gmail.com>
 * @copyright Copyright (c) 2916 (http://www.elephant.net)
 */
namespace Widget;

class Upload extends \Widget {

    public function editor($filename = null, $input_name = 'filename', $thumb_width = 200, $thumb_height = 200) {

        if ( $filename )
        {
            $rs = Model::factory('Sys_Attachment')
                ->select('name')
                ->where('filename', '=', $filename)
                ->as_object()
                ->limit(1)
                ->execute()
                ->current();

            $name = $rs->name;    
        }

        $this->assign(array(
            'thumb_width'  => (int) $thumb_width,
            'thumb_height' => (int) $thumb_height,
            'input_name'   => $input_name,
            'filename'     => $filename,
            'name'         => isset($name) ? $name : ''
        ));
    }

    /**
     * 单文件上传
     * 
     * @param  integer $thumb_width  缩略图宽度
     * @param  integer $thumb_height 缩略图高度
     * @param  string  $input_name   表单名称
     * @return void
     */
    public function single($filename = null, $input_name = 'filename', $thumb_width = 200, $thumb_height = 200) {

        echo $filename . "\n";

        echo $input_name . "\n";

        echo $thumb_width . "\n";

        echo $thumb_height . "\n";

    }

    public function __distruct() {

        echo "Asdf";
    }
}
?>