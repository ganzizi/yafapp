<?php
/**
 * Test 
 *
 * @author jacky
 * @copyright Copyright (c) 2016 (http://yaf.elephant.software)
 */
class TestController extends AdminController {


    /**
     * 普通页面渲染与传值
     */
    public function indexAction() {


        $this->_view->assign(array(
            'name'  => 'jacky',
            'intro' => 'this is the test file'
        ));


    }



}