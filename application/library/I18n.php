<?php
/*
 * I18n From Kohana
 *
 * @package    Elephant
 * @author     Jacky
 * @copyright  (c) 2015-2016 Elephant Team
 * @license    http://elephant.software/license
 */
class I18n {

    /**
     * @var  string   target language: en-us, es-es, zh-cn, etc
     */
    public static $lang = 'en-us';

    /**
     * @var  string  source language: en-us, es-es, zh-cn, etc
     */
    public static $source = 'en-us';

    /**
     * @var  array  cache of loaded languages
     */
    protected static $_cache = array();

    /**
     * Get and set the target language.
     *
     *     // Get the current language
     *     $lang = I18n::lang();
     *
     *     // Change the current language to Spanish
     *     I18n::lang('es-es');
     *
     * @param   string  $lang   new language setting
     * @return  string
     * @since   3.0.2
     */
    public static function lang($lang = NULL)
    {
        if ($lang)
        {
            // Normalize the language
            I18n::$lang = strtolower(str_replace(array(' ', '_'), '-', $lang));
        }

        return I18n::$lang;
    }

    /**
     * Returns translation of a string. If no translation exists, the original
     * string will be returned. No parameters are replaced.
     *
     *     $hello = I18n::get('Hello friends, my name is :name');
     *
     * @param   string  $string text to translate
     * @param   string  $lang   target language
     * @return  string
     */
    public static function get($string, $lang = NULL)
    {
        if ( ! $lang)
        {
            // Use the global target language
            $lang = I18n::$lang;
        }

        // Load the translation table for this language
        $table = I18n::load($lang);

        // Return the translated string if it exists
        return isset($table[$string]) ? $table[$string] : $string;
    }

    /**
     * Returns the translation table for a given language.
     *
     *     // Get all defined Spanish messages
     *     $messages = I18n::load('es-es');
     *
     * @param   string  $lang   language to load
     * @return  array
     */
    public static function load($lang)
    {
        if (isset(I18n::$_cache[$lang]))
        {
            return I18n::$_cache[$lang];
        }

        // New translation table
        $table = array();

        // Split the language: language, region, locale, etc
        $parts = explode('-', $lang);

        do
        {
            // Create a path for this set of parts
            $path = implode(DIRECTORY_SEPARATOR, $parts);

            if ($files = Kohana::find_file('i18n', $path, NULL, TRUE))
            {
                $t = array();
                foreach ($files as $file)
                {
                    // Merge the language strings into the sub table
                    $t = array_merge($t, Kohana::load($file));
                }

                // Append the sub table, preventing less specific language
                // files from overloading more specific files
                $table += $t;
            }

            // Remove the last part
            array_pop($parts);
        }
        while ($parts);

        // Cache the translation table locally
        return I18n::$_cache[$lang] = $table;
    }

}