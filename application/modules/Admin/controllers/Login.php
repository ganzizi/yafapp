<?php
/**
 * Test 
 *
 * @author jacky
 * @copyright Copyright (c) 2916 (http://yafapp.elephant.software)
 */
use Core\Controller_Core;

use Yaf\Application;

class LoginController extends Controller_Core {

    public function indexAction() {

    }
    
    public function registerAction() {      

        $post = $this->request->getPost();

        if ( $this->request->isPost() )
        {

            $this->output_type = 'Json';

            $post = $this->request->getPost();

            $validation = Validation::factory($post)
                ->rules(
                    'nickname',
                    array(
                        array('not_empty'),
                        array('min_length', array(':value', 2)),
                        array('max_length', array(':value', 30))
                    )
                )
                ->rules(
                    'password',
                    array(
                        array('not_empty'),
                        array('min_length', array(':value', 6))
                    )
                )
                ->rules(
                    'signup_confirm',
                    array(
                        array('not_empty')
                    )
                )
                ->rules(
                    'email',
                    array(
                        array('not_empty'),
                        array('email')
                    )
                );

            $validation->labels(
                array(
                    'nickname' => '手机号',
                    'email'    => '邮箱',
                    'password' => '密码',
                    'signup_confirm' => '服务条款'
                )
            );

            if ( ! $validation->check() )
            {
                $this->failure($validation->errors());
            }
        }

        
    }
}