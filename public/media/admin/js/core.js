; (function ($) {

    $.fn.upload = function (options) {

        var $_this = $(this);

        var opts = $.extend({}, $.fn.upload.defaults, options);

        function upload() { 

            this.init();
        }

        upload.prototype = {

            init : function () {

                var _this = this;
                $_this.on(opts.eventType, function () {

                    _this.editor();    

                    return false;
                                    
                })

                this.hover();
            },

            editor : function () {

                editor = KindEditor.editor({
                    allowFileManager : opts.allowFileManager,   // 允许上传
                    uploadJson       : opts.uploadJson,         // 上传地址
                    fileManagerJson  : opts.fileManagerJson,    // 预览地址
                    extraParams      : opts.extraParams,        // 附加参数
                    name             : opts.name,               // 表单名称
                    afterUpload      : function(url, xhr, type) {
                        opts.callback(xhr, opts, $_this);
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
            },

            hover : function () {

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

            }
        }

        return new upload();
    }
    $.fn.upload.defaults = {

        eventType        : 'click',
        name             : 'editor-name',
        width            : '200px',
        height           : '200px',
        uploadJson       : '/sys/upload/single',
        fileManagerJson  : 'http://www.baidu.om',
        extraParams      : {},
        model            : 'test',
        single           : true,
        loaded           : false,
        event            : 'click',
        allowFileManager : true,

        callback : function (xhr, opts, $obj) {

            if ( opts.single === true ) {

                opts.loaded = true;

                $obj.parent().find("p").remove();

                var _html = "";
                _html += "<p>";
                _html += "    <img width=\"" + opts.width + "\" height=\"" + opts.height + "\" src=\"" + xhr.url + "\">";
                _html += "    <input type=\"hidden\" name=\"" + opts.name + "\" value=\"" + xhr.filename + "\">";
                _html += "    <span style=\"display: none;\"><a href=\"javascript:void(0)\">x<\/a><\/span>";
                _html += "<\/p>";

                $obj.parent().prepend(_html);
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
            editor.hideDialog();
        }
    }


})(jQuery);
