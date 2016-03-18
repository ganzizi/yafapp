<?php
/**
 * User 
 *
 * @author jacky<isme.jac@gmail.com>
 * @copyright Copyright (c) 2916 (http://www.elephant.net)
 */
use Yaf\Response\Http;

class UserController extends AdminController {

    public function indexAction() {
        
        $this->yafAutoRender = 0;

        $array = array(

            'name' => '邓小平',
            'job'  => '中国共产党第二代领导集体核心人物',
            'intro' =>  '邓小平（1904～1997），四川广安人，1904年8月22日生，原名邓先圣，学名邓希贤。邓小平是中国共产党第二代领导核心领导者，伟大的马克思主义者，无产阶级革命家、政治家、军事家、外交家，中国共产党、中国人民解放军、中华人民共和国的主要领导人之一，中国社会主义改革开放和现代化建设的总设计师，邓小平理论的创立者。'
        );

        Widget::factory('Upload')
            ->args('user', 'jacky')
            ->exexute(1, 2, 3, 4);

    }



}