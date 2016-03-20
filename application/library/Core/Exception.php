<?php
/**
 * Core_Exception (from Kohana Framework) 
 *
 * @author jacky<isme.jac@gmail.com>
 * @copyright Copyright (c) 2016 (http://www.elephant.net)
 */
class Core_Exception extends Exception {

    /**
     * @var  array  PHP error code => human readable name
     */
    public static $php_errors = array(
        E_ERROR              => 'Fatal Error',          // 系统致命错误，硬盘不足。如：目录不可写、无法连接MySQL服务器、磁盘空间不足 ...
        E_USER_ERROR         => 'User Error',           // 致命错误，程序调用格式错误
        E_USER_WARNING       => 'User Warning',         // 用户使用调用错误
        E_PARSE              => 'Parse Error',          
        E_WARNING            => 'Warning',              // 普通系统应用错误。如：订单状态异常、对应门店不存在、保存用户信息失败、更新订单状态失败 ...
        E_STRICT             => 'Strict',               
        E_NOTICE             => 'Notice',               // 运行时提醒(这些经常是你代码中的bug引起的，也可能是有意的行为造成的。)
        E_RECOVERABLE_ERROR  => 'Recoverable Error',    
        E_DEPRECATED         => 'Deprecated',
    );

    /**
     * @var  string  error rendering view
     */
    public static $error_view = 'kohana/error';

    /**
     * @var  string  error view content type
     */
    public static $error_view_content_type = 'text/html';

    public $code = E_USER_ERROR;

    /**
     * Creates a new translated exception.
     *
     *     throw new Core_Exception('Something went terrible wrong, :user',
     *         array(':user' => $user));
     *
     * @param   string          $message    error message
     * @param   array           $variables  translation variables
     * @param   integer|string  $code       the exception code
     * @param   Exception       $previous   Previous exception
     * @return  void
     */
    public function __construct($message = "", array $variables = NULL, $code = null, Exception $previous = NULL)
    {
        // 默认用户调用错误
        if ( null === $code )
        {
            $code = $this->code;
        }

        if ( $code == E_ERROR )
        {
            // $message = '服务器内部错误，操作失败';
        }
        else if ( $code == E_USER_ERROR )
        {
            // $message = '系统异常，操作失败';
        }
        
        if ( ! empty($message) && null !== $variables )
            $message = strtr($message, $variables);

        // Pass the message and integer code to the parent
        parent::__construct($message, (int) $code, $previous);

        // Save the unmodified code
        // @link http://bugs.php.net/39615
        $this->code = $code;
    }

    /**
     * Magic object-to-string method.
     *
     *     echo $exception;
     *
     * @uses    Core_Exception::text
     * @return  string
     */
    public function __toString()
    {
        return Core_Exception::text($this);
    }

    /**
     * Inline exception handler, displays the error message, source of the
     * exception, and the stack trace of the error.
     *
     * @uses    Core_Exception::response
     * @param   Exception  $e
     * @return  void
     */
    public static function handler(Exception $e)
    {

        die("121212");

        $response = Core_Exception::_handler($e);

        // Send the response to the browser
        echo $response->send_headers()->body();

        exit(1);
    }

    /**
     * Exception handler, logs the exception and generates a Response object
     * for display.
     *
     * @uses    Core_Exception::response
     * @param   Exception  $e
     * @return  Response
     */
    public static function _handler(Exception $e)
    {
        try
        {
            // Log the exception
            Core_Exception::log($e);

            // Generate the response
            $response = Core_Exception::response($e);

            return $response;
        }
        catch (Exception $e)
        {
            /**
             * Things are going *really* badly for us, We now have no choice
             * but to bail. Hard.
             */
            // Clean the output buffer if one exists
            ob_get_level() AND ob_clean();

            // Set the Status code to 500, and Content-Type to text/plain.
            header('Content-Type: text/plain; charset='.Kohana::$charset, TRUE, 500);

            echo Core_Exception::text($e);

            exit(1);
        }
    }

    /**
     * Logs an exception.
     *
     * @uses    Core_Exception::text
     * @param   Exception  $e
     * @param   int        $level
     * @return  void
     */
    public static function log(Exception $e, $level = Log::EMERGENCY)
    {
        if (is_object(Kohana::$log))
        {
            // Create a text version of the exception
            $error = Core_Exception::text($e);

            // Add this exception to the log
            Kohana::$log->add($level, $error, NULL, array('exception' => $e));

            // Make sure the logs are written
            Kohana::$log->write();
        }
    }

    /**
     * Get a single line of text representing the exception:
     *
     * Error [ Code ]: Message ~ File [ Line ]
     *
     * @param   Exception  $e
     * @return  string
     */
    public static function text(Exception $e)
    {
        return sprintf('%s [ %s ]: %s ~ %s [ %d ]',
            get_class($e), $e->getCode(), strip_tags($e->getMessage()), Debug::path($e->getFile()), $e->getLine());
    }

    /**
     * Get a Response object representing the exception
     *
     * @uses    Core_Exception::text
     * @param   Exception  $e
     * @return  Response
     */
    public static function response(Exception $e)
    {
        try
        {
            // Get the exception information
            $class   = get_class($e);
            $code    = $e->getCode();
            $message = $e->getMessage();
            $file    = $e->getFile();
            $line    = $e->getLine();
            $trace   = $e->getTrace();

            /**
             * HTTP_Exceptions are constructed in the HTTP_Exception::factory()
             * method. We need to remove that entry from the trace and overwrite
             * the variables from above.
             */
            if ($e instanceof HTTP_Exception AND $trace[0]['function'] == 'factory')
            {
                extract(array_shift($trace));
            }


            if ($e instanceof ErrorException)
            {
                /**
                 * If XDebug is installed, and this is a fatal error,
                 * use XDebug to generate the stack trace
                 */
                if (function_exists('xdebug_get_function_stack') AND $code == E_ERROR)
                {
                    $trace = array_slice(array_reverse(xdebug_get_function_stack()), 4);

                    foreach ($trace as & $frame)
                    {
                        /**
                         * XDebug pre 2.1.1 doesn't currently set the call type key
                         * http://bugs.xdebug.org/view.php?id=695
                         */
                        if ( ! isset($frame['type']))
                        {
                            $frame['type'] = '??';
                        }

                        // XDebug also has a different name for the parameters array
                        if (isset($frame['params']) AND ! isset($frame['args']))
                        {
                            $frame['args'] = $frame['params'];
                        }
                    }
                }

                if (isset(Core_Exception::$php_errors[$code]))
                {
                    // Use the human-readable error name
                    $code = Core_Exception::$php_errors[$code];
                }
            }

            /**
             * The stack trace becomes unmanageable inside PHPUnit.
             *
             * The error view ends up several GB in size, taking
             * serveral minutes to render.
             */
            if (defined('PHPUnit_MAIN_METHOD'))
            {
                $trace = array_slice($trace, 0, 2);
            }

            // Instantiate the error view.
            $view = View::factory(Core_Exception::$error_view, get_defined_vars());

            // Prepare the response object.
            $response = Response::factory();

            // Set the response status
            $response->status(($e instanceof HTTP_Exception) ? $e->getCode() : 500);

            // Set the response headers
            $response->headers('Content-Type', Core_Exception::$error_view_content_type.'; charset='.Kohana::$charset);

            // Set the response body
            $response->body($view->render());
        }
        catch (Exception $e)
        {
            /**
             * Things are going badly for us, Lets try to keep things under control by
             * generating a simpler response object.
             */
            $response = Response::factory();
            $response->status(500);
            $response->headers('Content-Type', 'text/plain');
            $response->body(Core_Exception::text($e));
        }

        return $response;
    }
}
