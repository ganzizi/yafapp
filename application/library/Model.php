<?php
/**
 * Model 
 *
 * @author jacky<isme.jac@gmail.com>
 * @copyright Copyright (c) 2916 (http://www.elephant.net)
 */
use Database\DB;
class Model {

    protected $_aliases_table = NULL;

    protected $_created_column = NULL;

    protected $_updated_column = NULL;

    public static function factory($model, $id = NULL)
    {

        if ( is_array($model) )
        {
            $aliases_table = $model[1];
            $model         = $model[0];
        }
        else
        {
            $aliases_table = NULL;
        }

        // Set class name
        $model = $model.'Model';

        return new $model($id, $aliases_table);
    }

    // table name
    
    // Database instance
    protected $_database;

    /**
     * Loads the database.
     *
     *     $model = new Foo_Model($db);
     *
     * @param   mixed  $db  Database instance object or string
     * @return  void
     */
    public function __construct($db = NULL, $aliases_table = NULL)
    {

        $this->_initialize($aliases_table);

        if ($db)
        {
            // Set the instance or name
            $this->_database = $db;
        }
        elseif ( ! $this->_database)
        {
            // Use the default name
            $this->_database = Database::$default;
        }

        if (is_string($this->_database))
        {
            // Load the database
            $this->_database = Database::instance($this->_database);
        }
    }

    /**
     * initialize
     */
    protected function _initialize($aliases_table) {
        // Set the object name if none predefined
        if ( ! $this->_table_name )
        {
            $this->_table_name = strtolower(substr(get_class($this), 6));
        }

        if ( NULL === $aliases_table )
            $this->_aliases_table = $this->_table_name;
        else
            $this->_aliases_table = $aliases_table;
    }

    /**
     * Resource database
     * 
     * @return object
     */
    public function database () {
        return $this->_database;
    }

    /**
     * tablename
     * 
     * @return string
     */
    public function table_name() {
        return $this->_table_name;
    }

    public function list_columns($table_name = null) {

        if ( null === $table_name )
            $table_name = $this->_table_name;


        $result = Kohana::cache($table_name);
        if ( ! $result )
        {
            Kohana::cache($table_name, $this->_database->list_columns($table_name), 3600);
        }

        return Kohana::cache($table_name);

    }

    /**
     * Insert
     *
     * @uses Model::factory('Model Name')
     *           ->insert(array('name' => 'new name', 'filename' => 'filename.jpg'))
     *           ->execute();
     * 
     * @param  array $values 
     * @return object
     */
    public function insert($values) {

        if ( NULL !== $this->_created_column && ! isset($values[$this->_created_column['column']]) )
        {
            $values[$this->_created_column['column']] = date($this->_created_column['format']);
        }
        
        if ( NULL !== $this->_updated_column && ! isset($values[$this->_updated_column['column']]) )
        {
            $values[$this->_updated_column['column']] = date($this->_updated_column['format']);
        }

        $db_columns = array_keys($this->list_columns());

        $columns    = array_keys($values);

        foreach ($columns as $key => $value) {

            if ( ! in_array($value, $db_columns) )
            {
                unset($values[$value]);
            }
        }

        return DB::insert($this->_table_name)
            ->columns(array_keys($values))
            ->values(array_values($values));
    }

    /**
     * 回收站
     *
     * @uses Model::factory('Model Name')
     *           ->rubbish()
     *            ->where('id', '=', 1)
     *            ->execute();
     *                  
     * @param  string $column 删除字段标识
     * @return object
     */
    public function rubbish($column = 'status') {

        $columns = array(
            $column => 0
        );

        return $this->update($columns);
    }

    /**
     * 逻辑删除
     *
     * @uses Model::factory('Model Name')
     *           ->del()
     *            ->where('id', '=', 1)
     *            ->execute();
     * 
     * @param  string $column 删除字段标识
     * @return object
     */
    public function del($column = 'status') {

        $columns = array(
            $column => -1
        );

        return $this->update($columns);
    }

    /**
     * 更新
     *
     * @uses Model::factory('Model Name')
     *           ->update(array('name' => 'new name'))
     *           ->where('id', '=', 12)
     *           ->execute();
     * 
     * @param  array $columns 更新字段
     * @return object
     */
    public function update(Array $columns) {

        $db_columns = array_keys($this->list_columns());
        $_columns    = array_keys($columns);


        if ( NULL !== $this->_updated_column && ! isset($values[$this->_updated_column['column']]) )
        {
            $columns[$this->_updated_column['column']] = date($this->_updated_column['format']);
        }


        foreach ($_columns as $key => $value) {

            if ( ! in_array($value, $db_columns) )
            {
                unset($columns[$value]);
            }
        }

        
        return DB::update($this->_table_name)
            ->set($columns);
    }

    public function __call($action = NULL, $arguments = NULL) {

        // Update and delete
        if ( in_array($action, array('delete') ) )
        {
            return DB::$action($this->_table_name, Arr::get($arguments, 0));            
        }
        // Select and select_array
        else if ( in_array($action, array('select', 'select_array')) )
        {
            $columns = isset($arguments[0]) ? $arguments[0] : '*';
            return DB::$action($columns)->from(array($this->_table_name, $this->_aliases_table));
        }
        
        // Other
        return DB::$action(Arr::get($arguments, 0), Arr::get($arguments, 1));
    }  

    public function __get($name) {
        
        if ( isset($this->$name) )
        {
            return $this->$name;
        }
        
        $_name = '_' . $name;

        if ( isset($this->$_name))
        {
            return $this->$_name;
        }

        $_name = '_' . $_name;
        if ( isset($this->$_name))
        {
            return $this->$_name;
        }

        return null;
    }
}