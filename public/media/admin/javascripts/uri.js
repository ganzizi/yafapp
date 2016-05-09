/**
 * 导航处理 uri
 *
 * @author jacky 2014-08-21 16:13:32 星期四
 */

; (function ($) {

    /**
     * 请求对象
     */
    var request = xhr = opts = {};

    /**
     * ajax
     */
    var ajax = {
        dataType : 'JSON',
        type     : 'GET',
        async    : false,
        cache    : false
    }

    var loaded = false;

    /**
     * 配置
     */
    $.fn.uri = function (options) {
        opts = $.extend({}, $.fn.uri.defaults, options);
        factory();        
    }

    /**
     * 重置
     */
    var uri_reset = function () {
        ajax = {
            dataType : 'JSON',
            type     : 'GET',
            async    : false,
            cache    : false
        }

        loaded = false;

        request = xhr = {};

        pager('clear');
    }

    /**
     * 处理uri
     */
    var parse_uri = function (_this) {

        var _app = _this.parent().parent().siblings();

        request = {
            'type'       : $(_this).data('type'),
            'title'      : $(_this).data('title'),
            'directory'  : $(_this).data('directory'),
            'controller' : $(_this).data('controller'),
            'action'     : $(_this).data('action'),
            'uri'        : $(_this).data('uri')
        }

    }

    /**
     * 解析处理数据
     */
    var parse_data = function () {

        try {
            eval( request.action + '()' );
        } catch (e) {
            alert(e.name + ':' + e.message);
        }
    }

    /**
     * 首页
     */
    var index = function () {

        var _html = '<div class="t-center"><a class="btn btn-primary btn-flat"><i class="fa fa-link"></i>'
            + request.title
            + '</a></div>';
    
        $("#uri-body").html(_html);

        // 选取
        var _html = '<a id="choose" class="btn btn-primary btn-xs btn-outline" data-dismiss="modal"><i class="fa fa-reply"></i>选取</a>';
        $("#modal-footer").html(_html).show();

        $("#choose").click(function () {


            var params = {
                'type'      : request.type,
                'site'      : 'wap',
                'directory' : request.directory,
                "action"  : request.action,
                "controller" : request.controller,
                'title'     : request.title,
            };

            choose(params);   
        })
    }

    /**
     * 分类
     */
    var category = function () {

        if ( false === loaded )
        {
            ajax.dataType = 'HTML';
            load(request.uri);
            return ;
        }

        var _html = '<div class="t-center">' + xhr + '</div>';

        $("#uri-body").html(_html);

        // 选取
        var _html = '<a id="choose" class="btn btn-primary btn-xs btn-outline" data-dismiss="modal"><i class="fa fa-reply"></i>选取</a>';
        $("#modal-footer").html(_html).show();

        var category = {
            'title'  : $("#parent_id option:selected").text(),
            'id'     : $("#parent_id").val()
        }
        
        $("#parent_id").change(function () {

            // clear title 
            var _title = ($(this).find('option:selected').text());    

            if ( _title.indexOf('├') > 0 )
            {
                _title = _title.substr(_title.indexOf('├') + 1);
            }
            else if ( _title.indexOf('└') > 0 )
            {
                _title = _title.substr(_title.indexOf('└') + 1);
            }

            category = {
                title : _title,
                id    : $(this).val()
            }
        })
    
        // 选取        
        $("#choose").click(function () {

            var params = {
                'type'      : request.type,
                'site'      : 'wap',
                'directory' : request.directory,
                "action"  : request.action,
                "controller" : request.controller,
                'title'     : request.title + ' - ' + category.title,
                'id'        : category.id
            };

            choose(params);
        })
    }

    /**
     * 分类
     */
    var list = function () {

        if ( false === loaded )
        {
            ajax.dataType = 'HTML';
            load(request.uri);
            return ;
        }

        var _html = '<div class="t-center">' + xhr + '</div>';

        $("#uri-body").html(_html);

        // 选取
        var _html = '<a id="choose" class="btn btn-primary btn-xs btn-outline" data-dismiss="modal"><i class="fa fa-reply"></i>选取</a>';
        $("#modal-footer").html(_html).show();

        var category = {
            'title'  : $("#parent_id option:selected").text(),
            'id'     : $("#parent_id").val()
        }
        
        $("#parent_id").change(function () {

            // clear title 
            var _title = ($(this).find('option:selected').text());    

            if ( _title.indexOf('├') > 0 )
            {
                _title = _title.substr(_title.indexOf('├') + 1);
            }
            else if ( _title.indexOf('└') > 0 )
            {
                _title = _title.substr(_title.indexOf('└') + 1);
            }

            category = {
                title : _title,
                id    : $(this).val()
            }
        })
    
        // 选取        
        $("#choose").click(function () {

            var params = {
                'type'      : request.type,
                'site'      : 'wap',
                'directory' : request.directory,
                "action"  : request.action,
                "controller" : request.controller,
                'title'     : request.title + ' - ' + category.title,
                'id'        : category.id
            };

            choose(params);
        })
    }

    /**
     * 详细信息
     */
    var info = function () {

        if ( false === loaded ) {
            var ds = '?';
            if ( request.uri.indexOf('?') > 0 )
                ds = '&';

            load(request.uri + ds + 'json=1');
            
            return ;
        }

        $("#uri-body").html($("#loading_content").html());

        var lists = xhr.datas.pager.lists;

        var _html = '';

        for ( var key in lists ) {
            _html += '<tr>';
                _html += '<td>' + lists[key].title + '</td>';
                _html += '<td>' + lists[key].created + '</td>';

                _html += '<td class="t-center"><a data-title="';

                _html += lists[key].title + '" id="' + lists[key].id
                _html += '" class="btn btn-primary btn-xs btn-outline" data-dismiss="modal">';
                _html += '<i class="fa fa-reply"></i>选取</a></td>';
            _html += '</tr>';
        }

        $("#uri-body").find('tbody').html(_html);

        $("#uri-body .t-center a").click(function () {

            var title = request.title + ' - ' + $(this).attr('data-title');

            var params = {
                'type'      : request.type,
                'site'      : 'wap',
                'directory' : request.directory,
                "action"  : request.action,
                "controller" : request.controller,
                'title'     : title,
                'id'        : $(this).attr('id')
            };
            choose(params);
        });

        pager();
    }

    var outside_link = function () {


var strVar = "";
    strVar += "<br /><div class=\"form-group\">";
    strVar += "    <label class=\"sr-only\" for=\"outside_link\"><\/label>";
    strVar += "    <input type=\"text\" class=\"form-control\" id=\"outside_link\" placeholder=\"外部链接地址\">";
    strVar += "<\/div><br />";

        var _html = '<div class="t-center">' + strVar + '</div>';
    
        $("#uri-body").html(_html);

        // 选取
        var _html = '<a id="choose" class="btn btn-primary btn-xs btn-outline" data-dismiss="modal"><i class="fa fa-reply"></i>选取</a>';
        $("#modal-footer").html(_html).show();

        $("#choose").click(function () {


            var params = {
                'type'      : request.type,
                'site'      : '',
                'directory' : request.directory,
                "action"  : request.action,
                "controller" : request.controller,
                'title'     : $("#outside_link").val(),
            };

            choose(params);   
        })


        // $("#uri-body").html("$("#loading_content").html()");
    } 

    var phone = function () {

    }

    var location = function () {

    }

    var website = function () {

    }

    /**
     * 选中
     */
    var choose = function (params) {

        var title = params.title;


        params = JSON.stringify(params);
        opts.callback(title, params);
    }

    /**
     * 处理分页
     */
    var pager = function (clear) {

        if (clear) {
            $("#modal-footer").html('').hide();
            return ;  
        } 

        var pager = xhr.datas.pager;

        var _html = '<div class="DT-label dataTables_info" id="pager-nav"></div><div class="DT-pagination dataTables_paginate paging_simple_numbers" id="jq-datatables-example_paginate"><ul id="pagination" class="pagination"></ul></div>';

        $("#modal-footer").html(_html).show();

        // 分页导航
        var _nav = '当前页 ' + pager.current_count + ' 条，共 ' + pager.count  + ' 条记录，共 ' + pager.num_pages + ' 页';

        // 上一页
        var disabled = null;
        if ( pager.number == 1 ) disabled = 'disabled';
        var _up = '<li class="paginate_button previous ' + disabled + '"  tabindex="0"><a href="#">«</a></li>';

        // 下一页
        var disabled = null;
        if ( pager.num_pages >= pager.number ) disabled = 'disabled';
        var _next = '<li class="paginate_button next ' + pager.num_pages + '" tabindex="0"><a href="#">»</a></li>';

        // 分页页码
        var _current_range = '';
        for ( var key in pager.current_range ) {

            var active = null;
            if ( pager.number == pager.current_range[key] ) active = 'active';
            _current_range += '<li class="paginate_button ' + active + ' " tabindex="0"><a href="#">' + pager.current_range[key] + '</a></li>'
        }
        $("#pagination").html(_up + _current_range + _next);

        $("#pager-nav").html(_nav);
    }

    /**
     * 加载前
     */
    var load_before = function () {
        var loading = '<div style="text-align:center"><i class="fa-3x fa fa-spinner fa-spin"></i></div>';
        $("#uri-body").html(loading);
    }

    /**
     * load
     * @param  string   uri  
     * @param  string   data 
     * @return mix
     */
    var load = function (uri, data) 
    {

        if ( ! data ) data = {};

        $.ajax({
            type       : ajax.type,
            url        : uri,
            dataType   : ajax.dataType,
            beforeSend : function () {
                load_before();
            },
            success   : function (i) {
                loaded = true; xhr = i;
                parse_data();
            }
        }); 
    }


    function factory()
    {

        $("#uri_nav li .dropdown-menu a").click(function () {
            uri_reset();
            parse_uri($(this));
            parse_data();
        });
    }

    $.fn.uri.defaults = {
        title    : '#link-title',
        params   : '#link-params',
        callback : function (title, params) {

            $(opts.title).val(title);
            $(opts.params).val(params);
        }
    }
})(jQuery);