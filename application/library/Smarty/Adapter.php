<?php
/**
 * Adapter
 *
 * @author jacky<isme.jac@gmail.com>
 * @copyright Copyright (c) 2916 (http://www.elephant.net)
 */
use Yaf\Loader;
use Yaf\Dispatcher;
use Output\View;
class Smarty_Adapter extends View {

	protected $_view;

	protected $_tpl_type = 'Smarty';

	public function __construct($tpl_dir = NULL, $tpl_config = array()) {

		parent::__construct($tpl_dir, $tpl_config);

		$lib_dir = dirname(__FILE__);
		Loader::import($lib_dir . '/Smarty.class.php');
		Loader::import($lib_dir . '/sysplugins/smarty_internal_templatecompilerbase.php');
		Loader::import($lib_dir . '/sysplugins/smarty_internal_templatelexer.php');
		Loader::import($lib_dir . '/sysplugins/smarty_internal_templateparser.php');
		Loader::import($lib_dir . '/sysplugins/smarty_internal_compilebase.php');
		Loader::import($lib_dir . '/sysplugins/smarty_internal_write_file.php');
		Loader::import($lib_dir . '/sysplugins/smarty_internal_compile_block.php');
		Loader::import($lib_dir . '/sysplugins/smarty_internal_resource_string.php');

		$this->_view = new Smarty;
		
		if ( NULL !== $tpl_config )
		{
			foreach ($tpl_config as $key => $value)
			{
				if ($key == 'plugins_dir')
					$this->_view->$key = array_merge($this->_view->$key, array($value));
				else
					$this->_view->$key = $value;
			}
		}
	}

	public function setScriptPath($tpl_dir = NULL) {

		parent::setScriptPath($tpl_dir);

		$this->_view->template_dir = $this->getScriptPath();

		return $this;
	}

	
	public function __set($key, $val) {
		$this->_view->assign($key, $val);
	}

	public function __get($key) {
		return $this->_view->getTemplateVars($key);
	}

	public function __isset($key) {
		return ($this->_view->getTemplateVars($key) !== NULL);
	}

	public function __unset($key) {
		$this->_view->clearAssign($key);
	}

	public function clearVars() {
		$this->_view->clearAllAssign();
	}

	public function cleanCache($name) {
		if (!empty($name))
		{
			$this->_view->clearCache($name);
			$this->_view->clearCompiledTemplate($name);
		}
		else
		{
			$this->_view->clearAllCache();
			$this->_view->clearCompiledTemplate();
		}
	}

	public function display($tpl_name = NULL, $tpl_dir = NULL, $tpl_root_dir = NULL) {

		if ( NULL === $tpl_root_dir )
		{
			$tpl_root_dir = $this->setScriptPath()->getScriptPath();
		}
		
		if ( NULL === $tpl_name || NULL === $tpl_dir )
		{
			$request = Dispatcher::getInstance()->getRequest();

			if ( NULL === $tpl_dir )
			{
				$tpl_dir = strtolower($request->controller);

			}

			if ( NULL === $tpl_name )
			{
				$tpl_name = strtolower($request->action);
			}
		}

		$tpl_name = $tpl_root_dir . DS . $tpl_dir . DS . 'views' . DS . $tpl_name . '.html';

		echo $this->_view->display($tpl_name);
	}

	public function assign($spec, $value = NULL) {

		if (is_array($spec))
		{
			$this->_view->assign($spec);
		}
		else
		{		
			$this->_view->assign($spec, $value);	
		}
		return $this;
	}

	public function render($file_name, $tpl_vars = array(), $tpl_root_dir = NULL) {
		
		// 根目录
		if ( NULL === $tpl_root_dir )
			$tpl_root_dir = $this->setScriptPath()->getScriptPath();

		$file_name = $tpl_root_dir . DS . $file_name;

		if (!empty($tpl_vars))
		{
			$this->assign($tpl_vars);
		}

		return $this->_view->fetch($file_name);
	}

	public function registerFunction($type, $function, $params) {
		if (!in_array($type, array('function', 'modifier')))
			return false;
		$this->_view->registerPlugin($type, $function, $params);
	}
  
}
