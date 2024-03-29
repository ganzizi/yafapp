<?php
/**
 * Pagination
 * 
 * @package    Elephant
 * @author     Elephant Team
 * @copyright  (c) 2015-2016 Elephant Team
 * @license    http://elephant.software/license
 */
abstract class Pagination_Pagination
{

    /**
     * @var string 分页对象的类型
     */
    protected $_type;

    /**
     * @var object 分页目标对象
     */
    protected $_object_list;

    /**
     * @var integer 总数量
     */
    protected $_count;

    /**
     * @var integer 分页数量
     */
    protected $_num_pages;

    /**
     * 
     * @var array 页码范围
     */
    protected $_page_range = array();

    /**
     * @var array 缺省配置
     */
    protected $_config = array(
        'key'      => 'page',    // 分页参数
        'theme'    => 'default', // 导航皮肤
        'strict'   => false,     // 页码数严格检查
        'per_page' => 15,        // 每页数量
        'orphans'  => 5,         // 孤儿数量
        'allow_empty_first_page' => TRUE // 太长了，为了向django致敬，留着吧
    );

    /**
     * 创建一个分页实列
     * 
     *       // DB select build
     *       $query = DB::select()->from('articles')
     *               ->where('is_published', '=', 1)
     *               ->where('category_id', '=', '2');
     *   
     *       // 实例化可分页对象
     *       $Pagination = Pagination::factory($query, 15);
     *   
     *       $page = $Pagination->page(3);
     *   
     *       // 遍历
     *       foreach($page as $row) {
     *           echo $page['title'].'<br />';
     *       }
     *   
     *       // 输出导航
     *       echo $page;
     *   
     * @param   mix  $object_list          分页目标对象
     * @param   integer $per_page          每页数量
     * @param   string $type = 'query'     分页目标对象类型， 默认 'query'
     * @return  Pagination_Page
     */
    public static function factory ($object, $per_page = null, $type = 'select', $config=null)
    {
        $class_type = 'Pagination_Src_Type_' . ucfirst(strtolower($type));
        return new $class_type($object, $per_page, $config);
    }

    /**
     * 构造函数 
     * 
     * @param mix $object_list
     * @param integer $per_page
     */
    protected function __construct ($object_list, $per_page, $config)
    {
        $config = $config == null? 'default': $config;

        $configs = Yaf_Loader::import('Pagination/config/pagination.php');
        $config = $configs['pagination'];

        $per_page !== null and $config['per_page'] = $per_page;
        $this->config($config);
        $_class_arr = explode('_', strtolower(get_class($this)));
        $this->_type = end($_class_arr);
        $this->_object_list = $object_list;
    }
    
    /**
     * 配置设置,及获取
     *
     * @param string $key            
     * @param string $value            
     */
    public function config ($key = null, $value = null)
    {
        if ($key == null and $value == null) {
            return $this->_config;
        }
        
        if (is_array($key)) {
            foreach ($key as $_key => $_value) {
                $this->config($_key, $_value);
            }
            return $this;
        }
        
        if (is_string($key)) {
            if ($value == null) {
                return $this->$key;
            } elseif (array_key_exists($key, $this->_config)) {
                $this->_config[$key] = $value;
                if ($key == 'per_page') {
                    $this->_num_pages = null;
                    $this->_page_range = array();
                }
            }
        }
        
        return $this;
    }

    /**
     * 
     * @param integer $number
     * @throws Pagination_ValidPage
     * @return integer number
     */
    public function validate_number($number)
    {
        if ( !is_numeric($number) ) {
            throw new Ept_Exception('That page number is not an integer', null, E_USER_ERROR);
        }
        
        if ($number < 1) {
            throw new Ept_Exception('That page number is less than 1', null, E_USER_ERROR);
        }
        
        if ($number > $this->num_pages) {
            if ($number != 1 or !$this->allow_empty_first_page) {
                throw new Ept_Exception('That page contains no results', null, E_USER_ERROR);
            }
        }
        
        return $number;
    }

    /**
     * 得到分页对象
     */
    public function page ($number=null)
    {
        if ($number == null ) {
            $number = Arr::get($_GET, $this->key, 1);
        }

        try {
            $number = $this->validate_number($number);
        } catch (Pagination_ValidPage $e) {
            if ($this->strict == true) throw $e;
            $number = 1;
        }
        
        $limit = $this->per_page;
        if ($this->orphans != 0 and $number == $this->num_pages) {
            $limit += $this->orphans;            
        }
        $offset = ($number - 1) * $this->per_page;
        $class_page = 'Pagination_Src_Page_' . ucfirst($this->_type);
        return new $class_page(clone $this, $number, $limit, $offset);
    }

    /**
     * 得到对象总数目
     */
    abstract protected function _get_count ();

    /**
     * 得到总页数量
     */
    protected function _get_num_pages ()
    {
        if ($this->_num_pages == null) {
            
            if ($this->count == 0 and !$this->allow_empty_first_page) {
                $this->_num_pages = 0;
            } else {
                $this->orphans >= $this->per_page and 
                      $this->orphans = floor($this->per_page/3);
                $_count = max(array(1, $this->count - $this->orphans)); 
                $this->_num_pages = (int) ceil($_count / $this->per_page);
            }
        }
        return $this->_num_pages;
    }

    /**
     * 得到基于1的页码范围数组
     */
    protected function _get_page_range ()
    {
        if (empty($this->_page_range) and $this->num_pages !=0 )
            $this->_page_range = range(1, $this->num_pages);
        return $this->_page_range;
    }

    /**
     * @param string $name            
     */
    public function __get ($name)
    {
        $is_attr = in_array($name, array(
            'type',
            'object_list',
            'config'
        ));
        if ($is_attr) {
            $attr_name = '_' . $name;
            return $this->$attr_name;
        }
        
        $is_config = array_key_exists($name, $this->_config);
        
        if ($is_config) {
            return $this->_config[$name];
        }
        $is_method = in_array($name, array(
            'count',
            'page_range',
            'num_pages'
        ));
        
        if ($is_method) {
            $method = '_get_' . $name;
            return $this->$method();
        }
        
        throw new Ept_Exception('Pagination not has attr: :var',
            array(':var' => $name), E_USER_ERROR);
    }
}
