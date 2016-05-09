/**
 * Public
 *
 * @authore Jakcy
 * @version 1.0 2015-04-21 16:58:33
 */
; (function ($) {

/**
 * form
 * ---------------------------------------------------------------------
 * 
 * @uses 
 *     $("#form").form().asObject()
 *     $.fn.form().asObject(form)  
 */
// ---------------------------------------------------------------------
$.fn.formData = function (options, form) {

    var $this = this;

    if ( ! $this instanceof $ )
    {
        if ( undefined === form ) throw "The way you call is incorrect";

        if ( form instanceof $ ) form = form[0];
    }
    else
    {
        var form = $this[0];
    }

    var data = {};
    if ( ! form ) return data;

    for ( var i = 0; i < form.length; i++ ) {

        var _this = form[i];

        var input_name = _this.getAttribute('name');
        if ( input_name == '' || input_name === undefined ) continue;

        getInputValues(_this, data);
    }

    function getInputValues (e, data) {

        var this_key  = e.getAttribute('name'),
            this_type = e.getAttribute('type');

        // 过滤无效的表单名称
        if ( this_key == '' || this_key === undefined || null === this_key )
            return false;

        if ( ( this_type == 'checkbox' || this_type == 'radio' ) && ! e.checked )
            return false;

        // 数组形式
        if ( -1 != this_key.indexOf('[]') )
        {
            this_key = this_key.substring(0, this_key.length - 2);

            if ( ! data[this_key] ) data[this_key] = new Array();

            data[this_key].push(getThisValue(e));
        }
        // 文本形式
        else
        {
            data[this_key] = getThisValue(e);
        }

        function getThisValue (e) {

            if ( e.getAttribute('type') == 'file' )  
            {
                return e.files[0];
            }
                
            return e.value;
        }
    }
    return data;
}


/**
 * formSend 
 *
 *  $("#us").formSend(form);
 * ---------------------------------------------------------------------
 * 
 * @param  object $submit submit
 * @param  object options opts
 * @param  object params  data
 * @return void
    $("form").formSend()
*/
// ---------------------------------------------------------------------
$.fn.formSend = function (params, options) {

    var opts = $.extend(true, {}, $.fn.formSend.defaults, options),
        $this = this;

    formSend($this, $this.find("input[type='submit']"));

    function formSend($form, $submit) {

        $.ept.ajax({
            url  : opts && opts.url || $form.attr('action'),
            type : opts && opts.type || $form.attr('method') || "POST",
            data : $.extend({}, $form.formData(), params),
            dataType : "JSON",
            beforeSend : function (data, status, xhr) {

                if ( $submit instanceof $ ) $submit.button('loading');

            },
            success : function (xhr) {

                if ( xhr.errcode == 1 )
                {
                    var output = xhr.result || "";

                    if ( xhr.attribute ) 
                    {
                        for (var i = xhr.attribute.length in xhr.attribute)
                        {
                            output += xhr.attribute[i] + "\n";
                        }
                    }

                    if ( $submit instanceof $ ) $submit.button('reset');

                    return false;
                }

                opts.callback(xhr, _this);
            }
        });
    }  
}

// ---------------------------------------------------------------------
$.fn.formSend.defaults = {
    callback : function (xhr) {
        setTimeout(function () {

            if ( ! xhr.result || ! isNaN(xhr.result) )
            {
                window.location.reload();
            }
            else if ( xhr.result.match('http://') || xhr.result.match('https://') )
            {
                window.location.href = xhr.result;
            }
            else
            {
                window.location.reload();
            }

        }, 500);

    },
    type  : 'POST'
}

/**
 * dialog
 * ---------------------------------------------------------------------
 * @uses
 *      // 1
 *      $("#dialog-default").dialog({
 *          title : '你好？',
 *          body  : 'hello word',
 *          event : 'click'
 *      });
 *      
 *      ----------------------------------
 *      
 *      // 2
 *      $.fn.dialog({
 *          title : '你好？',
 *          body  : 'hello word',
 *          event : 'click'
 *      });
 */
// ---------------------------------------------------------------------
$.fn.dialog = function(options, $ele, callback, modal) {

    var opts = $.extend(true, {}, $.fn.dialog.defaults, options),
        _html_header = opts.header || "", 
        _html_footer = opts.footer || "",  
        _html_box    = "";
        
    if ( undefined === $ele ) $ele = this;

    if ( this.length == 0 )
    {
        dialog();
    }
    else
    {
        this.on (opts.event, function () {
            dialog();
        })
    }

    function dialog () {
        
        if ( true === opts.header )
        {
            _html_header = "<div class=\"modal-header\">";
            _html_header += "    <button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-label=\"Close\">";
            _html_header += "        <span aria-hidden=\"true\">&times;<\/span>";
            _html_header += "    <\/button>";
            _html_header += "    <h4 class=\"modal-title\">" + opts.title + "<\/h4>";
            _html_header += "<\/div>";
        }

        if ( true === opts.footer )
        {
            _html_footer = "<div class=\"modal-footer\">";
            _html_footer += "    <button type=\"button\" class=\"btn btn-default\" data-dismiss=\"modal\">取消<\/button>";
            _html_footer += "    <button type=\"submit\" class=\"btn-submit btn btn-primary\">确定<\/button>";
            _html_footer += "<\/div>";
        }

        if ( opts.content ) 
        {
            _html_content = "<div class=\"modal-body\">" + opts.body + "<\/div>";
        }
        else
        {
            _html_content = opts.body;
        }

        var $dialog = $("#layout-dialog");

        if ( $dialog[0] === undefined )
        {
            
            var _html_box = "";
                _html_box += "<div class=\"modal fade\" id=\"layout-dialog\" tabindex=\"-1\" role=\"dialog\" aria-labelledby=\"myModalLabel\" aria-hidden=\"true\">";
                _html_box += "    <div class=\"modal-dialog modal-" + opts.size + "\">";
                _html_box += "        <div class=\"modal-content\">";

                _html_box += _html_header;
                _html_box += _html_content;
                _html_box += _html_footer;

                _html_box += "        <\/div>";
                _html_box += "    <\/div>";
                _html_box += "<\/div>";

            $("body").after(_html_box);

            $dialog = $("#layout-dialog");
        }
        else
        {
            $dialog.find('.modal-dialog').addClass("modal-" + opts.size);
            
            $dialog.find('.modal-title').html(opts.title);
            $dialog.find('.modal-body').html(opts.body);
        }

        var _modal = $($dialog).modal({});

        $dialog.find('.btn-default').click(function () {

            // 取消
            opts.btnCancel($dialog, $ele, $(this));
        })

        $dialog.find('.btn-submit').click(function () {

            // 确定
            opts.btnOk($dialog, $ele, $(this));
        })

        typeof(callback) == 'function' && callback($dialog, $ele);

        // 关闭后移除内容
        $dialog.on('hidden.bs.modal', function (e) {
            $(this).remove();
        })

        return _modal;
    }
}

$.fn.dialog.defaults = {
    content : true,
    header  : true,
    footer  : true,
    body    : '',
    title   : "&nbsp;",
    size    : 'medium',
    event   : 'click',
    btnCancel : function ($dialog, $ele, $this) {
        
    }, 
    btnOk     : function ($dialog, $ele, $this) {
        $dialog.modal('hide');
    }
}

})(jQuery);
// ---------------------------------------------------------------------

// 弹出层方式异步加载内容
// ---------------------------------------------------------------------
$.loadPop = function (options, $ele) {

    var opts = $.extend(true, {}, $.loadPop.defaults, options);

    $.fn.dialog(opts, $ele, function (dialog) {

        dialog.on('shown.bs.modal', function (e) {

            var _body = $(this).find('.modal-body');

            var _btn  = dialog.find('.btn-submit');

            $.ept.ajax({
                url  : opts.url,
                type : 'GET',
                beforeSend : function () {

                    _body.html(opts.body);
                    _btn.attr('disabled', true);
                },
                success : function (xhr) {
                    _body.html(xhr);
                    _btn.attr('disabled', false);
                }
            });
        });
    });
}

$.loadPop.defaults = {
    content : true,
    header  : true,
    footer  : false,
    body    : '<h5>正在努力加载中...</h5>',
    title   : "&nbsp;",
    size    : 'medium',
    btnCancel : function ($submit) {
            
    }, 
    btnOk     : function (dialog, $submit) {
        dialog.modal('hide');
    }
}
// ---------------------------------------------------------------------

// loadPage
// ---------------------------------------------------------------------
$.loadPage = function (options, $ele) {
    
    var opts = $.extend(true, {}, $.loadPage.defaults, options);
    
    var $body = $("#layout-pager");
    
    var data = opts.data;
    
    if ($ele)
    {
        var _link = $ele.parent();

        if ( _link.parents("#main-menu-inner") )
        {
            _link.parents("#main-menu-inner").find('li').removeClass('active');
        }

        _link.addClass('active');
        
        window.history.pushState(null, $ele.html(), $ele.attr('href'));
        
    }
    
    $.ept.ajax({
        url  : opts.url,
        type : 'GET',
        dataType : 'HTML',
        data : data,
        beforeSend : function () {
            
            $('#progress-bar').stop().animate({ 'width':'80%' }, 1000);
            
            var _html = '<div id="layout-loading"><i class="fa-2x fa fa-spinner fa-spin"></i></div>';
            $body.html(_html);

        },
        success : function (xhr) {
            $('#progress-bar').stop().animate({ 'width':'100%' },1300,function(){
                $(this).css('width','0');
            });
            $body.html(xhr);
        }
    });
    
}

$.loadPage.defaults = {
    data : {}
}
// ---------------------------------------------------------------------

// 弹出层方式异步加载内容
// ---------------------------------------------------------------------
$.loadIframePop = function (options, $ele) {

    var opts = $.extend(true, {}, $.loadIframePop.defaults, options);
    
    $.fn.dialog(opts, $ele, function (dialog) {
        
        dialog.on('shown.bs.modal', function (e) {

            var _body = $(this).find('.modal-body');
            
            var _btn  = dialog.find('.btn-submit');
            
            var strVar = "";
                strVar += "<iframe style=\"width:100%; height:1000px\" src=\"" + opts.url + "\" id=\"iframepage\" frameborder=\"0\" scrolling=\"no\" marginheight=\"0\" marginwidth=\"0\"><\/iframe>";
                
            _body.html(strVar);
            
        });
    });
}

$.loadIframePop.defaults = {
    content : true,
    header  : true,
    footer  : false,
    body    : '<h5>正在努力加载中...</h5>',
    title   : "&nbsp;",
    size    : 'lgg', // large
    btnCancel : function ($submit) {
            
    }, 
    btnOk     : function (dialog, $submit) {
        dialog.modal('hide');
    }
}
// ---------------------------------------------------------------------



// 弹出层方式异步加载内容
// ---------------------------------------------------------------------
$.loadIframePage = function (options, $ele) {


    var _link = $ele.parent();

    if ( _link.parents("#main-menu-inner") )
    {
        _link.parents("#main-menu-inner").find('li').removeClass('active');
    }

    _link.addClass('active');
    
    
    var opts = $.extend(true, {}, $.loadIframePage.defaults, options);
        
    var html = "<iframe frameborder=\"0\" scrolling=\"no\" marginheight=\"0\" marginwidth=\"0\" style=\"width:100%; height:1000px\" src=\"" + opts.url + "\">";
        
    $("#layout-pager").html(html);
    
}



$.loadIframePage.defaults = {
    content : true,
    header  : true,
    footer  : false,
    body    : '<h5>正在努力加载中...</h5>',
    title   : "&nbsp;",
    size    : 'lgg', // large
    btnCancel : function ($submit) {
            
    }, 
    btnOk     : function (dialog, $submit) {
        dialog.modal('hide');
    }
}
// ---------------------------------------------------------------------


$.ept = {};

// 站点通用 ajax 处理
// ---------------------------------------------------------------------
$.ept.ajax = function (options) {

    var _this = $.ept.ajax;

    opts = $.extend(true, {}, _this.defaults, options);

    $.ajax({
        type          : opts.type,     
        url           : opts.url,        
        dataType      : opts.dataType,  
        data          : opts.data,       
        processData   : opts.processData,          
        timeoutNumber : opts.timeoutNumber,         
        traditional   : opts.traditional, 
        statusCode    : {
            404 : function () {
                alert('Not Found');
            }
        },
        beforeSend : function (data, status, xhr) {
            opts.beforeSend(data, status, xhr);
        },
        success : function (xhr) {
            opts.success(xhr);
        },
        error : function (xhr, status, errorThrown) {
            alert(" Request an error occurs you, please refresh the page to retry! ");
        }

    }).responseText;
}
$.ept.ajax.defaults = {
    type          : "GET",   // 提交方式
    url           : null,
    dataType      : "HTML",  // 数据格式
    processData   : true,   // 禁止自动转换数据格式
    timeoutNumber : 300,     // 超时时间
    traditional   : false,   // 禁止序列化数据
    beforeSend : function (data, status, xhr) {

    },
    success : function (xhr) {

    },
    complete : function () {

    }
};
// ---------------------------------------------------------------------

// 获取参数值
// ------------------------------------------------------------
$.formParams = function (ele) {

    var _datas = {};
    if ( ! ele ) return _datas;

    $.each(ele, function (i, n) {

        var _this = $(n);

        if ( ! (_this.attr('name') == '' || _this.attr('name') === undefined)  )
        {

            // 键值
            var _key = _this.attr('name');
            if ( _this.attr('type') == 'checkbox' || _this.attr('type') == 'radio' ) 
            {

                var _ed = n.checked;

                if ( n.checked ) 
                {
                    _value = _this.val();

                    if ( -1 != _key.indexOf('[]') )
                    {
                        var _k = _key.substring(0, _key.length - 2);

                        if ( ! _datas[_k] ) _datas[_k] = new Array();


                        _datas[_k].push(_value);
                    }
                    else
                    {
                        _datas[_key] = _value;
                    }
                }
            }
            else
            {

                if ( -1 != _key.indexOf('[]') )
                {
                    var _k = _key.substring(0, _key.length - 2);

                    if ( ! _datas[_k] ) _datas[_k] = new Array();

                    _datas[_k].push(_this.val());
                }
                else
                {
                    _datas[_key] = _this.val();
                }
            }
        }
    })
    return _datas;
}
// ------------------------------------------------------------
$.url = {};
$.url.get = function (key, url) {

    var _return = undefined;

    if ( url === undefined )
    {
        url = window.location.href;
    }

    // 分割点
    var excision_key = url.indexOf('?');
    if ( -1 == excision_key )
    {
        return _return;
    }

    // 字符串参数
    var param = url.substr(excision_key + 1);

    // 分割数组参数
    var _arr = param.split('&');

    // 数组参数
    var params = [];
    for (var k = _arr.length in _arr)
    {
        var _params = _arr[k].split('=');
        params[_params[0]] = _params[1];
    }

    if ( key === undefined || key === null )
    {
        return params;
    }

    return params[key] || null;
}

$(function(){
    $('body').on('click', '[target^="ms-"]', function(e) {
        
        e.preventDefault();

        var _this = $(this);

        var action = _this.attr('target').substring(3);

        if ( action == 'load-pop')
        {
            $.loadPop({
                url   : _this.attr('href'),
                title : _this.data('title') || _this.html(),
                size  : _this.data('size'),
                btnOk : function ($dialog, $ele, $submit) {
                    $.formSend($submit, { url:opts.url });
                }
            });
        }
        if ( action == 'load-page')
        {
            
            $.loadPage({
                url   : _this.attr('href'),
                btnOk : function ($dialog, $ele, $submit) {
                    $.formSend($submit, { url:opts.url });
                }
            }, _this);
            
            return false;
        }
        if ( action == 'load-iframe-pop')
        {
            
            $.loadIframePop({
                url   : _this.attr('href'),
                title : _this.data('title') || _this.html(),
                size  : 'lg',
                btnOk : function ($dialog, $ele, $submit) {
                    $.formSend($submit, { url:opts.url });
                }
            });
            
            return false;
        }
        if ( action == 'load-iframe-page')
        {
            
            $.loadIframePage({
                url   : _this.attr('href'),
                title : _this.data('title') || _this.html(),
                size  : _this.data('size') || 'lgg',
                btnOk : function ($dialog, $ele, $submit) {
                    $.formSend($submit, { url:opts.url });
                }
            }, _this);
            
            return false;
        }
        
        else if ( action == 'confirm' ) 
        {
            $.fn.dialog({
                title : _this.data('title') || "确认提示消息",
                size  : _this.data('size') || 'sm',
                body  : _this.data('body') || "<h4>您确认要继续当前操作吗？ </h4>",
                btnOk : function (dialog, $ele, $submit) {

                    $.ept.ajax({
                        url  : _this.attr('href'),
                        dataType : "JSON",
                        beforeSend : function (data, status, xhr) {
                            $submit.button('loading');
                            _this.button('loading');

                        },
                        success : function (xhr) {

                            if ( xhr.errcode == 1 )
                            {
                                alelrt(xhr.result || '操作失败');
                                _this.button('reset');

                            }
                            else
                            {
                                var handle = _this.parent().parent();
                                handle.css({'background-color':'blanchedalmond'})
    
                                setTimeout(function () {
                                    handle.toggle(1000);
                                }, 500)
                            }

                            dialog.modal('hide');
                        }
                    });
                }

            }, $(this));
            
            return false;
            
        }
        else if ( action == 'submit' )
        {
            _this.formSend(null, {}, {event:false});
        }
        else
        {
            e.preventDefault();
            var $this = $(this);
            mysite[$this.attr('target')]($this, e);
        }

        return false;
    })
})