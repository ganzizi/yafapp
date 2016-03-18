/**
 * Public
 *
 * @authore Jakcy
 * @version 1.0 2015-04-21 16:58:33 星期二
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
$.fn.form = function (options) {

    if ( ! this instanceof $ )
        var $this = $(this);
    else
        var $this = this;

    // form class
    function form(e) { }

    form.prototype = {

        asObject : function (form) {

            if ( undefined !== form )
                form = $(form)[0];
            else
                form = $this[0];

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
                        return e.files[0];
                    return e.value;
                }
            }
            return data;
        }
    }

    return new form();
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
 */
// ---------------------------------------------------------------------
$.fn.formSend = function (form, params, options) {

    var opts = $.extend(true, {}, $.fn.formSend.defaults, options),
        _this = this;

    if ( _this.length == 0 || false === opts.event )
    {
        formSend();
    }
    else
    {
        _this.on (opts.event, function () {
            formSend();
        })
    }

    function formSend() {

        if ( _this.length == 0 && ( undefined === form || null === form ) )
        {
            throw " form can not be empty ";
        }

        if ( undefined === form || null === form ) form = _this.parents('form')[0];

        var $form = $(form);

        // 提交数据
        var send_data = $.extend({}, $form.form().asObject(), params);

        $.ept.ajax({
            url  : opts && opts.url || $form.attr('action'),
            type : opts && opts.type || $form.attr('method') || "POST",
            data : send_data,
            dataType : "JSON",
            beforeSend : function (data, status, xhr) {
                _this.button('loading');
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

                    alert(output);

                    _this.button('reset');
                
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
    event : 'click',
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
            $dialog.find('.modal-title').html(opts.title);
            $dialog.find('.modal-body').html(opts.body);
        }

        var _modal = $($dialog).modal({modal});

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