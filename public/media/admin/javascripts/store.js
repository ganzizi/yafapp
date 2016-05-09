/**
 * 店铺通用 js 处理
 *
 * @authore jacky
 * @version 2.0 2014-09-23 13:21:26 星期二
 * @version 2.0 2014-12-13 10:52:08 星期六
 */

var store = {}

// url 管理
store.url = {

    /**
     * 读取站点核心 url
     *
     * @param  string uri
     * @return string
     */
    site : function (uri) {

        if ( uri === undefined ) {
            uri = site.url.basic;
        }
        else if ( -1 == uri.indexOf('http://') )
        {
            uri = site.url.basic + '/' + uri;
        }

        return uri;
    },

    /**
     * 读取媒体文件 url
     *
     * @param  string uri
     * @return string
     */
    media : function (uri) {
        if ( uri === undefined ) {
            uri = '';
        }

        return site.url.media + uri;
    },

    /**
     * 页面跳转
     *
     * @param  string uri
     * @return void
     */
    redirect : function (uri)
    {
        uri = this.site(uri);
        store.target.load_ajax('', uri);
    },

    /**
     * 刷新
     *
     * @return void
     */
    refresh : function ()
    {
        var url = $("#layout-data").data('url');

        store.target.load_ajax('', url);
    }
}

store.request = {

    /**
     * 获取一个 url 中的参数
     *
     * @param string key
     * @param string url
     * @return string/object
     */
    query : function (key, url)
    {

        var _return = {};

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
    },
    /**
     * 将数组|对象 转换成字符串
     *
     * @param  obj/array params
     * @return string
     */
    toUrlByArray : function (params)
    {
        if ( params === undefined ) 
        {
            return '';
        }

        var param = '';
        for ( var key = params.length in params)
        {
            param += key + '=' + params[key] + '&';
        }

        return param.substr(0, param.length - 1, 1);
    },

    mergeUrl : function(url, merge_url)
    {
        var ds = '?';

        var excision_key = url.indexOf('?');

        if ( -1 != excision_key )
        {
            ds = '&';
        }

        if ((url.length - 1 )== excision_key) ds = '';

        return url + ds + merge_url;
    }
}

store.body = {

    /**
     * 遮罩
     * 
     * @param  boolean show 是否显示
     * @return void         
     */
    mask : function (show) {

        if ( show )
        {
            $("#body-mask").show();
        }
        else
        {
            $("#body-mask").hide();
        }
    }
}
store.upload = {

    /**
     * 读取上传文件 url
     * @param  string  uri
     * @return string
     */
    url : function (uri) {

        if (uri == '' || uri === undefined )
        {
            return '';
        }

        if ( -1 == uri.indexOf('http://') )
        {
            uri = site.url.upload + '/' + uri;
        }

        return uri;            
    },

    /**
     * 缩略图
     * 
     * @param  string   image  图片名称
     * @param  integer  width  图片宽度
     * @param  integer  height 图片高度
     * @param  type     type   裁切形式， 1-裁切，2-等比例
     * @return string
     */
    thumb : function (image, width, height, type) {

        if ( ! type ) type = 2;

        return site.url.upload + '/' + image + "?imageView2/" + type + "/w/" + width + "/h/" + height +"/q/100"
    }
}

store.ajax = {
    /**
     * 请求加载数据
     * 
     * @param  object opts 请求对象
     * @return void
     */
    load : function (opts) {

        var _this = this;

        opts = $.extend({}, this.defaults, opts);

        $.ajax({
            type          : opts.type,       // 提交方式
            url           : opts.url,        // load url
            dataType      : opts.dataType,   // 数据格式
            data          : opts.data,       // 数据
            processData   : true,           // 禁止自动转换数据格式
            // timeoutNumber : 300,             // 超时时间
            // traditional   : false,           // 禁止序列化数据
            statusCode    : {
                404 : function () {
                    alert('Not Found');
                }
            },
            beforeSend : function (data, status, _xhr) {
                opts.before(data, status, _xhr);
            },
            success : function (data) {
                _xhr = data
                opts.success(data);
            },
            error : function (_xhr, status, errorThrown) {
                alert("请求发生错误啦，请刷新页面重试！");
            }

        }).responseText;
    },

    before : function (data, stat, _xhr) {
    },
    success : function (data) {
    },
    complete : function (data) {
    },

    defaults : {
        type          : "GET",   // 提交方式
        url           : null,
        dataType      : "JSON",  // 数据格式
        processData   : false,   // 禁止自动转换数据格式
        timeoutNumber : 300,     // 超时时间
        traditional   : false,   // 禁止序列化数据
        before : function (data, status, _xhr) {
            store.ajax.before(data, status, _xhr);
        },
        success : function (data) {
            store.ajax.success(data);
        },
        complete : function () {
        }
    },
}

store.form = {

    params : function (form) {

         var _datas = {};
        
        if ( ! form ) return _datas;

        $.each(form, function (i, n) {

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
    },

    post : function (obj, form, opts, param) {

        var _this = this;

        // 合并默认配置
        opts = $.extend({}, this.defaults, opts);

        var _datas = _this.params(form);

        _datas = $.extend({}, param, _datas);

        // 按钮对象
        var _btn = obj;
        
        // 按钮名称
        var btn_value = _btn.html();

        if ( ! opts.url )
        {
            var url = $(_btn).parents('form').attr('action') || $("#layout-data").data('url');
        }
        else
        {
            var url = opts.url;
        }


        store.ajax.load({
            url  : url,
            type : 'POST',
            data : _datas,
            before : function () {

                // 按钮状态
                _btn.addClass(opts.button.class).html(opts.button.loading);

                // body 遮罩
                store.body.mask(true);
            },
            success : function (i) {
                
                if ( i.code == 0 )
                {
                    // $.growl.notice({ title:'操作成功', message: '' });

                    // 按钮状态
                    _btn.removeClass(opts.button.class).html(btn_value);

                    // body 遮罩
                    store.body.mask(false);

                    setTimeout(function () {
                        
                        // 关闭弹窗
                        bootbox.hideAll();

                        // 回掉函数
                        opts.callback(i, obj);

                    }, 300);
                }
                else if ( i.code == 1 )
                {

                    var _title = i.title || '保存失败';


                    $.growl.error({ title:_title, message: i.msg ? i.msg : '' });

                    setTimeout(function() {
                        
                        // 按钮状态
                        _btn.removeClass(opts.button.class).html(btn_value);

                        // body 遮罩
                        store.body.mask(false);
                         
                    }, 300);
                    
                }
                else
                {
                    alert("未知错误");
                }
            }
        })

        return false;
    },

    defaults : {
        callback : function (xhr, obj) {
            store.url.redirect(xhr.msg);
        },
        button : {
            loading : '&nbsp;&nbsp;<i class="fa-1x fa fa-spinner fa-spin"></i>&nbsp;&nbsp;',
            class   : 'disabled'
        }
    }
}

store.target = {

    /**
     * 提示框 (删除操作)
     * 
     * @param  object obj 被点击的事件
     * @return mix
     */
    confirm : function (obj) {

       // 标题
        var title = $(obj).data('title') || '提示',
            title = '<small>' + title + '</small>';

        // 提示内容
        var msg = $(obj).data('msg') || '您确定进行当前操作吗？';
            msg = '<h6>' + msg + '</h6>';
        
        // url
        var url = $(obj).attr('href');

        var boot_box = bootbox.dialog({
            title  : title,
            message: msg,
            className: "bootbox-sm",
            buttons: {

                danger: {
                    label: "取消",
                    className: "btn btn-sm",
                    callback: function() {
                    }
                },

                success: {
                    label: "确定",
                    className: "btn btn-sm btn-primary",
                    callback: function() {

                        store.ajax.load({
                            url : url,
                            before : function () {

                                var loading = '<div style="text-align:center; height:31px;"><i class="fa-2x fa fa-spinner fa-spin"></i></div>';

                                $(".bootbox .modal-body").html(loading);

                                $(".bootbox .btn-primary").addClass('disabled');

                            },
                            success : function (data) {

                                if ( data.code == 0 )
                                {
                                    var _callback = $(obj).data("callback");

                                    if ( _callback )
                                    {
                                        eval(_callback + '(obj, data)');
                                    }
                                    else
                                    {
                                        if ( data.msg)
                                        {
                                            store.url.redirect(data.msg)
                                        }
                                        else
                                        {
                                            store.url.refresh();
                                        }
                                    }
                                }
                                else
                                {
                                    alert(data.msg);

                                    $(".bootbox .modal-body").html(msg);
                                    $(".bootbox .btn-primary").removeClass('disabled');

                                    return false;
                                }
                            }
                        });
                    }
                }
            }
        });
        
        return false;
    },

    load_ajax : function (obj, href, params, _history) {
                        $("#page-header").show();

        var _load_block = '#layout-box';

        if ( obj )
        {
            var _this = $(obj);

            if ( ! href )
                var _href = $(_this).attr("href");
            else
                var _href = href;


            if ( _href == 'javascript:void(0)' || _href == 'javascript::;' || _href == undefined ) return false;

            // 切换状态
            var _link = _this.parent();

            if ( _link.parents("#main-menu-inner") )
            {
                _link.parents("#main-menu-inner").find('li').removeClass('active');
            }

            _link.addClass('active');

            var _load_block = _this.parents('.load-block').data('block') || '#layout-box';

            if ( _load_block != '#layout-box' )
            {
                _history = true;
            }

            if ( ! _history )
            {
                var _key = '';

                if ( _this.parents("#main-menu-inner") )
                {
                    var _key = _this.parents(".mm-dropdown-root").index() + '-' + 
                        _this.parent().index();
                }

                // 历史记录
                history.pushState({key:_key}, _this.html(), _href);       
            }
            
        } 
        else
        {
            _href = href;
        }

        if ( params === undefined ) params = {};

        var _layout_content = $(_load_block);



        store.ajax.load({
            type          : 'GET',
            url           : _href,    // load url
            dataType      : "HTML",   // 数据格式
            data          : params,
            before        : function () {
                $('#progressBar').stop().animate({ 'width':'80%' }, 1000);

                var _html = '<div id="layout-loading"><i class="fa-2x fa fa-spinner fa-spin"></i></div>';
                _layout_content.html(_html);

                $("#complete-twomenu").hide();
            },
            success       : function (html) {

                $("#complete-twomenu").show();

                $('#progressBar').stop().animate({ 'width':'100%' },1300,function(){
                    $(this).css('width','0');
                });

                _layout_content.html(html);

                var _data = $("#layout-data");

                // 替换box
                var _wrapper = $("#content-wrapper");

                // 标题
                var _title = _data.data('title');

                var __title = _title;

                // 二级菜单
                var _menu = _data.data('twomenu');

                // 搜索
                var _search = _data.data('search');

                // 创建项目按钮
                var _object = _data.data('create-object');

                if ( site && site.setting && site.setting.title )
                {
                    __title += '-' + site.setting.title;
                }

                $("title").html(__title);

                // 移除
                $("#layout-title").remove();
                $("#layout-create-object").remove();
                $("#layout-twomenu").remove();


                // search
                _wrapper.find("#nav-title").html(_title);

                $('#content-wrapper').animate({ 'opacity':'1'},700);

                if ( _menu != 0 ) 
                {
                    $('.panel').addClass("two-menu-no-border-top");
                }
                else
                {
                    $('.panel').removeClass("two-menu-no-border-top")

                    _menu = '';
                }

                $("#complete-twomenu").html(_menu)
                
                $("#complete-search").html(_search);

                // 创建项目
                // -------------------------------------
                var $cur_object = $("#complete-create-object");

                if ( _object ) {
                    var _create_object = $(_object);
  
                    $cur_object.attr('href', _create_object.attr('href'))
                        .attr('target', _create_object.attr('target')).show();


                    $cur_object.click(function () {
    
                        if ( $cur_object.attr('target') == 'ms-load-ajax' || $cur_object.attr('target') == 'ms-load-page' )
                        {
                            return ;
                        }
                        else
                        {
                            window.open($cur_object.attr('href'));
                        }

                    })
                    
                }
                else
                {
                    $cur_object.hide();
                }
                // -------------------------------------
                $('.form-search input,select').tooltip();

                // 回到顶部

            }
        })

        return false;
    },

    /**
     * 弹出层加载页面
     * 
     * @param  object obj 点击事件
     * @return void
     */
    load_page : function (obj) {

        // 前缀样式
        var fa = $(obj).data('fa') || 'fa-plus-square';
        
        // 标题
        var title = $(obj).data('title') || '新建';

        title = '<small><i class="fa ' + fa + '"></i> ' + title + ' </small>';

        // 弹出框尺寸
        var size = $(obj).data('size') || '';

        // 请求地址
        var url = $(obj).attr('href');
        if ( url == '' || url === undefined )
        {
            alert('请填写请求地址');
            return false;
        }

        // 回掉函数
        var callback = $(obj).data('callback');

        var _bootbox = bootbox.dialog({
            title  : title,
            message: " ",
            isHtml : true,
            className: "bootbox-lg",
            size : size,

            buttons: {
            }
        });
    
        _bootbox.on('shown.bs.modal', function (e) {

            var load_body = $(this).find('.modal-body');

            store.ajax.load({
                url : url,
                dataType : "HTML",

                before : function () {

                    // 页面 loading 样式
                    var loading = '<h5><i class="fa-1x fa fa-spinner fa-spin"></i> 正在努力加载页面，请稍候 ...</h5>';

                    // 按钮 disabled
                    $(".bootbox .btn-primary").addClass('disabled');

                    // 替换样式
                    load_body.html(loading);
                },
                success : function (html) {

                    load_body.html(html);

                    $(".bootbox .btn-primary").removeClass('disabled');

                    if ( undefined !== callback )
                    {
                        eval( callback + '()' );
                    }
                }
            });

        });
    }
}

$(function(){
    $('body').on('click', '[target^="ms-"]', function(e){
        e.preventDefault();

        var action = $(this).attr('target').substring(3);

        if ( action == 'confirm')
        {
            // 弹出确认操作按钮
            store.target[action](this);
        }
        else if (action == 'load-page' ) 
        {
            store.target['load_page'](this);
        }
        else if (action == 'load-ajax' ) 
        {

            store.target['load_ajax'](this);
        }
        else
        {
            e.preventDefault();
            var $this = $(this);
            mysite[$this.attr('target')]($this, e);
        }
    })


})


