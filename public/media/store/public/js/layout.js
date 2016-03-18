/**
 * Public
 *
 * @authore Jakcy
 * @version 1.0 2015-04-21 16:58:33 星期二
 */
$.elephant = {};

$.dialog = function(options, $ele, callback, modal) {

    var opts = $.extend(true, {}, $.dialog.defaults, options);

    var _html_header = opts.header || "", 
        _html_footer = opts.footer || "",  
        _html_box    = "";

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
        _html_footer += "    <button type=\"submit\" class=\"btn-submit btn btn-primary\">提交<\/button>";
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

    var layout_dialog = $("#layout-dialog");

    if ( layout_dialog[0] === undefined )
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

        layout_dialog = $("#layout-dialog");
    }
    else
    {
        layout_dialog.find('.modal-title').html(opts.title);
        layout_dialog.find('.modal-body').html(opts.body);
    }

    var _modal = $(layout_dialog).modal({modal});

    layout_dialog.find('.btn-default').click(function () {

        // 取消
        opts.btnCancel(layout_dialog, $ele, $(this));
    })

    layout_dialog.find('.btn-submit').click(function () {

        // 确定
        opts.btnOk(layout_dialog, $ele, $(this));
    })

    typeof(callback) == 'function' && callback(layout_dialog);


    // 关闭后移除内容
    layout_dialog.on('hidden.bs.modal', function (e) {
        $(this).remove();
    })



    return _modal;
};
$.dialog.defaults = {
    content : true,
    header  : true,
    footer  : true,
    body    : '',
    title   : "&nbsp;",
    size    : 'medium',
    btnCancel : function (dialog, $ele, $submit) {
                
    }, 
    btnOk     : function (dialog, $ele, $submit) {
        dialog.modal('hide');
    }
}

// 弹出层方式异步加载内容
// ------------------------------------------------------------
$.loadPop = function (options, $ele) {

    var opts = $.extend(true, {}, $.loadPop.defaults, options);

    $.dialog(opts, $ele, function (dialog) {

        dialog.on('shown.bs.modal', function (e) {

            var _body = $(this).find('.modal-body');

            var _btn  = dialog.find('.btn-submit');

            $.elephant.ajax({
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
// ------------------------------------------------------------

// 站点通用 ajax 处理
// ------------------------------------------------------------
$.elephant.ajax = function (options) {

    var _this = $.elephant.ajax;

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
$.elephant.ajax.defaults = {
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
// ------------------------------------------------------------

$.formSend = function ($submit, options, params) {

    var _this = $.formSend;
    var opts = $.extend(true, {}, _this.defaults, options);

    // 表单
    var $form = $submit.parents('form');

    // 提交数据
    var data = $.extend({}, $.formParams($form[0]), params);

    $.elephant.ajax({
        url  : opts && opts.url || $form.attr('action'),
        type : opts && opts.type || $form.attr('method') || "POST",
        data : data,
        dataType : "JSON",
        beforeSend : function (data, status, xhr) {
            $submit.button('loading');
        },
        success : function (xhr) {

            if ( xhr.errcode == 1 )
            {
                alert(xhr.result);
                $submit.button('reset');
            
                return false;
            }

            opts.callback(xhr, $submit);

        }
    });
}

$.formSend.defaults = {
    callback : function (xhr) {
       
        setTimeout(function () {
            window.location.href = xhr.result;

        }, 500)
    }
}
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
            $.dialog({
                title : "Confirm message",
                size  : 'sm',
                body  : '<h4>Do you want to continue the current operation it? </h4>',
                btnOk : function (dialog, $ele, $submit) {

                    $.formSend($submit, {
                        url : $ele.attr('href'),
                        callback : function (xhr) {
                        url : $ele.attr('href'),
                            dialog.modal('hide');
                            setTimeout(function() {
                                $ele.parent().parent().fadeOut(1000);
                            }, 300);
                        }
                    })
                }
            
            }, $(this));
        }
        else if ( action == 'submit' ) {

               
        }
        else
        {
            e.preventDefault();
            var $this = $(this);
            mysite[$this.attr('target')]($this, e);
        }
    })
})