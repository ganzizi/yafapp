<?php
/**
 * Test View
 *
 * @author jacky
 * @copyright Copyright (c) 2916 (http://yafapp.elephant.software)
 */
use Core\Controller_Core;

class ViewController extends Controller_Core {

    public function autorenderAction() {
        
        $this->view->assign(array(
            'username' => 'jacky',
            'intro'    => 'yafapp'
        ));

        $this->view->assign('job', 'phper');
    }

    public function renderAction() {
        
        $this->yafAutoRender = 0;

        Output::factory('Smarty')
            ->assign(array(
                'username' => 'jacky',
                'intro'    => 'yafapp',
                'job'      => 'phper'
            ))
            ->display();
    }

    public function jsonAction() {

        $this->yafAutoRender = 0;

        Output::factory('Json')
            ->assign(array(
                'username' => 'jacky',
                'intro'    => 'yafapp',
                'job'      => 'phper'
            ))
            ->display(0, 'ok');
    }

    public function xmlAction() {

        $this->yafAutoRender = 0;

        Output::factory('Xml')
            ->assign(array(
                'username' => 'jacky',
                'intro'    => 'yafapp',
                'job'      => 'phper'
            ))
            ->display(0, 'ok');
    }
}