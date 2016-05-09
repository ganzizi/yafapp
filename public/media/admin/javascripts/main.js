/**
 * mian 通用核心处理 
 *
 * @author jacky 2014-08-28 16:58:29 星期四
 */

; (function ($) {

    /**
     * 请求对象
     */
    var opts = editor = {};

    /**
     * 单图上传
     * 
     * @param  object options 配置参数
     */
    $.fn.upload = function (options) {
        opts = $.extend({}, $.fn.upload.defaults, options);
        
        opts.uploadJson += '?width=' + opts.width + '&height=' + opts.height; 

        editor = KindEditor.editor({
            allowFileManager : opts.allowFileManager,   // 允许上传
            uploadJson       : opts.uploadJson,         // 上传地址
            fileManagerJson  : opts.fileManagerJson,    // 预览地址
            extraParams      : opts.extraParams,        // 附加参数
            name             : opts.name,               // 表单名称
            id               : opts.id,                 // 结果累计表单 ID
            afterUpload      : function(url, data, type) {
                opts.callback(data);
            }
        });

        if ( opts.single === true )
        {
            editor.loadPlugin('image', function() {
                editor.plugin.imageDialog({
                    clickFn : function(url, title, width, height, border, align) {
                        opts.click(url, title, width, height, border, align);
                    }
                });
            });
        }
        else 
        {
            editor.loadPlugin('multiimage', function() {
                editor.plugin.multiImageDialog({
                    clickFn : function(urlList) {

                        opts.callback(urlList);
                    }
                });
            });
        }
    }

    $.fn.upload.defaults = {
        name             : 'k-image',
        id               : 'html-k-image',
        allowFileManager : true,
        uploadJson       : '/upload/index',
        fileManagerJson  : '/upload/preview',
        extraParams      : {},
        model            : 'test',
        single           : true,
        loaded           : false,
        width            : 155,
        height           : 100,

        callback : function (i) {
            if ( opts.single === true ) {

                opts.loaded = true;

                var _html = "";
                _html += "<p>";
                _html += "    <img src=\"" + i.url + "\">";
                _html += "    <input type=\"hidden\" name=\"" + opts.name + "\" value=\"" + i.filename + "\">";
                _html += "    <span style=\"display: none;\"><a href=\"javascript:void(0)\">x<\/a><\/span>";
                _html += "<\/p>";

                $("#" + opts.id).html(_html).show();
            }
            else
            {
                var _div = $("#" + opts.id);
                $.each(i, function(t, data) {
                    console.dir(data);
                    _div.append('<p><img src="' + data.url + '"> <input type="hidden" value="' + data.filename + '" name="' + opts.name + '[]" /><span><a href="javascript:void(0)">x</a></span></p>');
                });
                editor.hideDialog();
            }
        },

        click    : function (url, title, width, height, border, align ) {

            if ( false === opts.loaded ) {
                if ( true === opts.single ) {

                    // 图片空间 计算出文件的名称， 截取处理 如更换图片空间需要处理。 
                    var _image_name = url.substring(28);
                    var _key = _image_name.indexOf('?');
                    _image_name = _image_name.substring(0, _key);
                    
                    // var _html = '<p><img src="' + url + '">';
                    // _html += '<input type="hidden" name="' + opts.name + '" value="' + _image_name + '"><span><a href="javascript:void(0)">x</a></span></p>';

                    var i = {
                        url: store.upload.thumb(_image_name, opts.width, opts.height),
                        filename : _image_name,

                    }

                    opts.callback(i);

                    // $("#" + opts.id).html(_html).show();
                }
                else
                {

                }
            }
            editor.hideDialog();
        }
    }



})(jQuery);

$(function () {

    var upload_timeount;

    $("body").delegate(".upload_img > p", "mouseover", function (e) {

        $(this).parent().parent().find('span').hide();
        clearTimeout(upload_timeount);
        $(this).find('span').show();
    }).delegate("p", "mouseout", function (e) {

        _this = $(this);
        
        upload_timeount = setTimeout(function () {
           _this.find('span').hide();

        }, 500)

    }).delegate(".upload_img p a", "click", function (e) {
        $(this).parent().parent().remove();
    })
})


