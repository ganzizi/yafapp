<?php
/**
 * Test 
 *
 * @author jacky
 * @copyright Copyright (c) 2916 (http://yafapp.elephant.software)
 */
use Core\Controller_Core;

use Database\Db;

class DbController extends Controller_Core {

    public function indexAction() {
        
        $this->yafAutoRender = false;



        $rs = DB::select()
            ->from('user')
            ->execute();

        print_r($rs);


    }
   
}