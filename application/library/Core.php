<?php
/**
 * Core 
 *
 * @author jacky<isme.jac@gmail.com>
 * @copyright Copyright (c) 2916 (http://www.elephant.net)
 */

use Yaf\Loader;
use Yaf\Application;

class Core {

    public static $charset   = 'UTF-8';

    /**
     * @var  boolean  Whether to enable [profiling](kohana/profiling). Set by [Kohana::init]
     */
    public static $profiling = TRUE;


    /**
     * @var  boolean  Whether to use internal caching for [Kohana::find_file], does not apply to [Kohana::cache]. Set by [Kohana::init]
     */
    public static $caching = FALSE;

    /**
     * @var  array   File path cache, used when caching is true in [Kohana::init]
     */
    protected static $_files = array();

    /**
     * @var  array   Include paths that are used to find files
     */
    protected static $_paths = array();

    public static function factory($class, $args = null) {

        $class_name = "Core_" . ucwords($class);

        return new $class_name($args);
    }

    public static function loader($dir, $file, $ext = NULL) {

        if ( false === ( $find_file = Core::find_file($dir, $file, $ext) ) )
        {
            throw new Core_Exception("Loaded file you not found :file ", array(':file' => $find_file));
        }

        Loader::import($find_file);
    }

    /**
     * Recursively finds all of the files in the specified directory at any
     * location in the [Cascading Filesystem](kohana/files), and returns an
     * array of all the files found, sorted alphabetically.
     *
     *     // Find all view files.
     *     $views = Kohana::list_files('views');
     *
     * @param   string  $directory  directory name
     * @param   array   $paths      list of paths to search
     * @return  array
     */
    public static function list_files($directory = NULL, array $paths = NULL)
    {
        if ($directory !== NULL)
        {
            // Add the directory separator
            $directory .= DIRECTORY_SEPARATOR;
        }

        if ($paths === NULL)
        {
            // Use the default paths
            $paths = array(Loader::getInstance()->getLibraryPath());
        }

        // Create an array for the files
        $found = array();

        foreach ($paths as $path)
        {
            if (is_dir($path.$directory))
            {
                // Create a new directory iterator
                $dir = new DirectoryIterator($path.$directory);

                foreach ($dir as $file)
                {
                    // Get the file name
                    $filename = $file->getFilename();

                    if ($filename[0] === '.' OR $filename[strlen($filename)-1] === '~')
                    {
                        // Skip all hidden files and UNIX backup files
                        continue;
                    }

                    // Relative filename is the array key
                    $key = $directory.$filename;

                    if ($file->isDir())
                    {
                        if ($sub_dir = Core::list_files($key, $paths))
                        {
                            if (isset($found[$key]))
                            {
                                // Append the sub-directory list
                                $found[$key] += $sub_dir;
                            }
                            else
                            {
                                // Create a new sub-directory list
                                $found[$key] = $sub_dir;
                            }
                        }
                    }
                    else
                    {
                        if ( ! isset($found[$key]))
                        {
                            // Add new files to the list
                            $found[$key] = realpath($file->getPathName());
                        }
                    }
                }
            }
        }

        // Sort the results alphabetically
        ksort($found);

        return $found;
    }

    /**
     * Searches for a file in the [Cascading Filesystem](kohana/files), and
     * returns the path to the file that has the highest precedence, so that it
     * can be included.
     *
     * When searching the "config", "messages", or "i18n" directories, or when
     * the `$array` flag is set to true, an array of all the files that match
     * that path in the [Cascading Filesystem](kohana/files) will be returned.
     * These files will return arrays which must be merged together.
     *
     * If no extension is given, the default extension (`EXT` set in
     * `index.php`) will be used.
     *
     *     // Returns an absolute path to views/template.php
     *     Kohana::find_file('views', 'template');
     *
     *     // Returns an absolute path to media/css/style.css
     *     Kohana::find_file('media', 'css/style', 'css');
     *
     *     // Returns an array of all the "mimes" configuration files
     *     Kohana::find_file('config', 'mimes');
     *
     * @param   string  $dir    directory name (views, i18n, classes, extensions, etc.)
     * @param   string  $file   filename with subdirectory
     * @param   string  $ext    extension to search for
     * @param   boolean $array  return an array of files?
     * @return  array   a list of files when $array is TRUE
     * @return  string  single file path
     */
    public static function find_file($dir, $file, $ext = NULL, $array = FALSE)
    {
        $dir = str_replace('/', DS, $dir);

        if ( count(Core::$_paths) == 0 ) return FALSE;

        if ($ext === NULL)
        {
            // Use the default extension
            $ext = '.php';
        }
        elseif ($ext)
        {
            // Prefix the extension with a period
            $ext = ".{$ext}";
        }
        else
        {
            // Use no extension
            $ext = '';
        }

        // Create a partial path of the filename
        $path = $dir.DIRECTORY_SEPARATOR.$file.$ext;

        if (Core::$caching === TRUE AND isset(Core::$_files[$path.($array ? '_array' : '_path')]))
        {
            // This path has been cached
            return Core::$_files[$path.($array ? '_array' : '_path')];
        }

        if (Core::$profiling === TRUE AND class_exists('Profiler', FALSE))
        {
            // Start a new benchmark
            $benchmark = Profiler::start('Kohana', __FUNCTION__);
        }

        if ( $array OR $dir === 'Config' OR $dir === 'I18n' OR $dir === 'Messages' )
        {
            // Include paths must be searched in reverse
            $paths = array_reverse(Core::$_paths);

            // Array of files that have been found
            $found = array();

            foreach ($paths as $dir)
            {
                if (is_file($dir . $path))
                {
                    // This path has a file, add it to the list
                    $found[] = $dir.$path;
                }
            }
        }
        else
        {
            // The file has not been found yet
            $found = FALSE;

            foreach (Core::$_paths as $dir)
            {
                if (is_file( $dir . DIRECTORY_SEPARATOR . $path ) )
                {
                    // A path has been found
                    $found = $dir.$path;

                    // Stop searching
                    break;
                }
            }
        }

        if (Core::$caching === TRUE)
        {
            // Add the path to the cache
            Core::$_files[$path.($array ? '_array' : '_path')] = $found;

            // Files have been changed
            Core::$_files_changed = TRUE;
        }

        if (isset($benchmark))
        {
            // Stop the benchmark
            Profiler::stop($benchmark);
        }

        return $found;
    }

    /**
     * Changes the currently enabled modules. Module paths may be relative
     * or absolute, but must point to a directory:
     *
     *     Core::paths(array('modules/foo', MODPATH.'bar'));
     *
     * @param   array   $modules    list of module paths
     * @return  array   enabled modules
     */
    public static function paths(array $_paths = NULL)
    {
        if ($_paths === NULL)
        {
            // Not changing modules, just return the current set
            return Core::$_paths;
        }

        if ( isset($_paths['Index']) ) unset($_paths['Index']);

        // Start a new list of include paths, APPPATH first
        $paths = array(ROOT_PATH);

        foreach ($_paths as $name => $path)
        {

            if (is_dir($path))
            {
                // Add the module to include paths
                $paths[] = $modules[$name] = realpath($path).DIRECTORY_SEPARATOR;
            }
            else
            {

                throw new Core_Exception("config for application.modules :module does not exist", array(
                        ':module' => $path
                ));
            }
        }

        // Set the new include paths
        Core::$_paths = $paths;

        foreach (Core::$_paths as $path)
        {
            $init = $path . 'init.php';

            if (is_file($init))
            {
                // Include the module initialization file once
                require_once $init;
            }
        }

        return Core::$_paths;
    }
}