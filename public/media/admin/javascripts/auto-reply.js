/**

{
    code : 0,
    datas : {

        imgtexts : {
            0 : {
                created : "",
                id : "605",
                image : "",
                intro : "212",
                link  : "",
                record_id : "43",
                sort : "21",
                title : "211",
                update : "@121"
            }
        }
    }
}
 * 关键词自动回复处理
 *
 * @author jacky 2014-09-07 17:14:01 星期日 
 */
var content_data = {
    type : 'text',

    last_pattern : 'text'
};

; (function ($) {

    /**
     * 默认配置
     */
    var _opts = _xhr  = {};
    
    /**
     * ajax loaded
     */
    var _ajax = {
        type   : 'JSON',    // 数据格式
        method : 'POST',    // 请求方式
        json   : 1,         // 服务器返回数据格式
        loaded : false,     // 已加载过
    }

    /**
     * 页面初始状态 html 记录
     */
    var _html = {
        rule : null,
    }

    /**
     * 弹出层加载记录
     */
    var _loaded = {
        last       : null,      // 最后一次操作对象
        
        rule       : false,     // 规则

        keyword    : false,     // 关键词


        // ---------------------------
        content    : false,     // 内容
        expression : false,     // 表情
        links      : false,     // 链接
        // ---------------------------
    }

    // 初始数据
    var _init_data = null;

    /**
     * 弹层
     */
    var _layer = {
        placement : 'auto',
    }


    $.fn.reply = function (options) {

        _opts = $.extend({}, $.fn.reply.defaults, options);

        core.reset();

        init();

    }

    var init = function () {
    
        var _this = this;

        // 规则
        rule.init();

        // 关键词
        keyword.init();

        // 回复内容
        content.init();
       
        // 点击空白， 关闭弹窗曾 
        $("body").delegate("", "click", function (e) {
            if ( 0 == $(".popover:hover").length)
            {
                // _this.clear_popover();
            }
        })
    }

    var core = {

        /**
         * 核心弹窗处理
         * 
         * @param  object   obj  弹窗触发对象
         * @param  string   html 需要弹出的内容
         * @return void
         */
        layer : function (obj, html, show ) {

            $(obj).popover({
                placement : true,
                selector  : true,
                title     : null, 
                content   : html,
                animation : true, 
                html      : true,
                placement : _layer.placement,
                width : 800
            })

            if (show == undefined)
            {
                $(obj).popover("show");
            }
        },

        load : {

            /**
             * 处理 请求方式 uri
             * 
             * @param  string  type 
             * @return string
             */
            parse_uri : function (type) {

                return request.site 
                    + '/webchat/autoreply/'
                    + type
                    + '?json=' + _ajax.json;
            },

            /**
             * 针对不同的数据进行不同的数据解析处理
             * 
             * @param  object   data
             * @return void
             */
            parse_data : function (data, obj, xhr) 
            {
                this.callback(data, obj, xhr);
            },

            /**
             * 加载前loading
             * 
             * @return void
             */
            before : function () {
                var loading = '<div style="text-align:center"><i class="fa-3x fa fa-spinner fa-spin"></i></div>';
                $("#modal-body").html(loading);
            },

            /**
             * 回掉函数
             * 
             * @param  object   data
             * @return void
             */
            callback : function (data, obj) {
                console.log(data);
            },

            /**
             * 请求处理数据
             * 
             * @param  string   uri    操作类型或 url ( 优先 parse )
             * @param  object   data   发送请求数据
             * @param  boolean  parse  true 则 处理 uri, 否则 uri 为 请求参数
             * @return void       
             */
            request : function (uri, data, parse, obj) {

                var _this = this;

                if ( parse == undefined || ! parse )
                {
                    var url = _this.parse_uri(uri);
                }
                else
                {
                    var url = uri;
                }


                if ( ! data ) data = {};

                $.ajax({
                    type       : _ajax.method,
                    url        : url,
                    dataType   : _ajax.type,
                    data       : data,
                    beforeSend : function () {
                        _this.before();
                    },
                    success   : function (xhr) {
                        _xhr = xhr;
                        _this.parse_data(data, obj, xhr);
                    }
                });    
            }
        },

        /**
         * 重置
         * 
         * @return void
         */
        reset : function () {

            _xhr = {};
        },

        clear : function (type, self)
        {

            if ( type == 'content' )
            {
                keyword.clear(self);
                content.clear(self);
            }
            else if ( type == 'branch' )
            {

                expression.clear(self);
                links.clear(self);
            }
            else if ( type == 'keyword')
            {

                content.clear(self);

                keyword.clear(self);
            }
            else if ( type == 'rule')
            {
                content.clear(self);
                keyword.clear(self);
                links.clear(self);
                expression.clear(self);

                rule.clear(self);
            }
        },

    }


    var rule = {

        /**
         * 规则初始化
         */
        init : function () {
            
            var _this = this;

            // 规则弹窗
            $("body").delegate("#create_object", "click", function (e) {
                _this.modal('show');
            })

            // 记录内容 html
            _html.rule = $("#modal-body").html();

            // 提交 
            $("#rule-submit").click(function () {
                _this.submit(); 
            })

            // 悬停 显示删除按钮
            $(".reply-box").mouseover(function () {
                $(this).parent().find('.rule-hover').removeClass('rule-hover');
                $(this).addClass('rule-hover');
            }).mouseout(function () {
            })

            // 规则点击编辑按钮
            $("body").delegate(".rule-modify", "click", function (e) {

                _this.layer(this);

                $(this).parents(".reply-box").find(".save").click(function () {
                    _this.modify(this);
                })

                // 取消
                _this.cancel(this);
            });
        },

        /**
         * 创建 页面内容
         * 
         * @param  object   data 数据，如标题，关键词默认名称等等  
         * @param  object   xhr  服务端返回数据
         */
        create : function (data, xhr) {

            var html = this.render_html(data, xhr, 'create');

            // 替换数据
            $("#rule-list").prepend(html);
        },

        modify : function (obj) {

            var data = {
                title : $(obj).parents('#rule-form').find('input[name="title"]').val(),
                rule_id : $(obj).parents('#rule-form').find('input[name="rule-id"]').val()
            }

            // 未改变，不需要更新
            if ( _init_data.title == data.title && _init_data.rule_id == data.rule_id )
            {
                core.clear('rule', false);
                return false;
            }

            // 验证是否改动过
            core.load.before = function () {

                var rule_body = $("#rule-body");

                var loading = '<div style="text-align:center; line-height:47px; width:179px;"><i class="fa-2x fa fa-spinner fa-spin"></i></div>';
                
                // 改变内容部分
                rule_body.html(loading);

                // 提交按钮不可点击
                $(rule_body).parent().find('.save').addClass('disabled');
            }

            core.load.callback = function () {

                if ( _xhr.code == 0 )
                {
                    core.clear('rule', false);

                    // 更新
                    $(obj).parents(".reply-box").find('.rule-title').html(data.title);
                }
                else
                {
                    core.clear('rule', false);

                    alert(_xhr.msg);
                    return false;
                }

            };

            // 数据提交
            core.load.request('rule', data);
        },

        /**
         * 渲染模板
         * @param  object   data   操作数据
         * @param  object   xhr    返回数据
         * @param  string   handle 操作方法
         * @return string
         */
        render_html : function (data, xhr, handle) {

            var _rule = '';

            if ( data.rule == 'exact' )
            {
                _rule = '精确';
            }
            else
            {
                _rule = '模糊';
            }

            var html = "";
                html += "<div class=\"panel reply-box\" id=\"rule-" + xhr.datas.rule_id + "\" rule-id=\"" + xhr.datas.rule_id + "\">";
                html += "    <div class=\"panel-heading\">";
                html += "        <span class=\"panel-title rule-title\">" + data.title + "<\/span>";
                html += "        ";
                html += "        <div class=\"panel-heading-controls\">";
                html += "            <a class=\"rule-modify btn btn-primary btn-xs btn-outline\" href=\"javascript:void(0)\">";
                html += "            <i class=\"fa fa-edit\"><\/i>编辑<\/a>";
                html += "";
                // html += "            <a target=\"ms-confirm\" class=\"btn btn-primary btn-xs btn-outline\" href=\"modify/6\">";
                // html += "            <i class=\"fa fa-edit\"><\/i>删除<\/a>";
                html += "        <\/div>";
                html += "    ";
                html += "    <\/div>";
                html += "";
                html += "    <table class=\"table table-bordered\">";
                html += "        <thead>";
                html += "            <tr>";
                html += "                <th width=\"45%\" class=\"panel-padding-h\">";
                html += "                    关键词 ";
                html += "                    <div class=\"panel-heading-controls\">";
                html += "                        <a class=\"keyword-create btn btn-primary btn-xs btn-outline\" href=\"javascript:void(0)\">";
                html += "                            <i class=\"fa fa-plus\"><\/i>增加";
                html += "                        <\/a>";
                html += "                    <\/div>";
                html += "                <\/th>";
                html += "                <th class=\"panel-padding-h\">回复内容";
                html += "                    <div class=\"panel-heading-controls\">";
                html += "                        <a rule-id=\"{$rule->id}\" class=\"rule-create btn btn-primary btn-xs btn-outline\" href=\"javascript:void(0)\">";
                html += "                            <i class=\"fa fa-plus\"><\/i>增加";
                html += "                        <\/a>";
                html += "                    <\/div>";
                html += "                <\/th>";
                html += "            <\/tr>";
                html += "        <\/thead>";
                html += "";
                html += "        <tbody>";
                html += "            <tr>";
                html += "                <td class=\"panel-padding\">";
                html += "";
                html += "                    <ol class=\"keyword-box\">";
                html += "";

                if ( xhr.datas.keyword_id !== '' ) {
                    html += "                        <li keyword-id=\""+ xhr.datas.keyword_id +"\">";
                    html += "                            <button class=\"btn btn-primary btn-xs btn-outline btn-rounded\">" + data.title +"<\/button>";
                    // html += "                            <a href=\"javascript:void(0)\" class=\"label label-tag\" rule=\"vague\">" + _rule + "<\/a>";
                    html += "                            <span class=\"delete\"><a href=\"javascrpt:void(0)\">x<\/a><\/span>";
                    html += "                        <\/li>";

                }else{
                    html += "                        <small>您还没有关键词，赶快添加吧~<\/small>";
                };

                html += "                    <\/ol>";
                html += "                <\/td>";
                html += "";
                html += "                <td class=\"panel-padding\">";
                html += "                    <div class=\"content-list row form-group\">";
                html += "                       <small>还没有任何回复！<\/small>";
                html += "                    <\/div>";
                html += "                <\/td>";
                html += "            <\/tr>";
                html += "        <\/tbody>";
                html += "    <\/table>";
                html += "<\/div>";

            return html;
        },

        /**
         * 表单提交数据
         * 
         * @return void
         */
        submit : function () {

            var post = this.validation();

            if ( false === post )
            {
                // 数据校验失败
                return false;
            }

            core.load.callback = this.callback;

            // 数据提交
            core.load.request('rule', post);
        },

        /**
         * 提交回掉函数
         * 
         * @param  object   data 
         * @return void
         */
        callback : function (data) {

            if ( _xhr.code == 0 )
            {
                // 重置状态
                rule.reset();

                // 关闭弹窗
                rule.modal('hide');
                
                 // 移除空信息提示
                $(".alert").remove();

                // 渲染页面
                rule.create(data, _xhr);
            }
            else
            {
                alert(_xhr.msg);
            }
        },

        /**
         * 重置规则表单
         * 
         * @return void
         */
        reset : function () {
            // 初始化页面
            $("#modal-body").html(_html.rule);
        },

        /**
         * 处理弹窗
         * 
         * @param  string  handle 弹出或关闭 (show/hide)
         * @return void    
         */
        modal : function (handle) {

            if ( handle == 'show' )
            {
                $("#rule-form-content").modal('show');
            }
            else
            {
                $("#rule-form-content").modal('hide');
            }
        },

        /**
         * 表单验证
         * 
         * @return object
         */
        validation : function () {

            var _obj = $("#rule_name");

            // 提示信息
            if ( _obj.val() == '' )
            {
                $(_obj).parent().addClass('has-error simple');

                $(_obj).parent().find('.help-block').removeClass('hide');

                return false;
            }

            // change 取消提示
            $(_obj).change(function () {
                
                if ( _obj.val() != '' )
                {
                    $(_obj).parent().removeClass('has-error simple');

                    $(_obj).parent().find('.help-block').addClass('hide');
                }
            })

            var type = $("#create_object").data('type');
    
            return {
                title : _obj.val(), 
                type  : type
            }
        },

        /**
         * 弹层
         * 
         * @param  object obj 
         * @return void     
         */
        layer : function (obj) {

            // 清除标识
            core.clear('rule',  ( obj == _loaded.last ? true : false ) );

            // 规则 primary key value
            var rule_id = $(obj).parents(".reply-box").attr("rule-id");

            var rule_title = $(obj).parents(".reply-box").find(".rule-title").html();

            // 弹窗内容 html
            var html = this.layer_html(rule_title, rule_id);

            // 左侧浮层
            _layer.placement = 'left';

            // 弹层显示状态
            var _display = $(obj).parent().find('.popover').css('display');

            // 记录初始状态
            _init_data = {
                title : rule_title,
                rule_id : rule_id
            }

            // 弹窗
            core.layer(obj, html, _display);

            // 标识最后操作对象
            _loaded.rule = _loaded.last = obj;
        },

        layer_html : function (title, rule_id) {
            var html = "";
                html += "<div id=\"rule-form\" class=\"rule-form\">";
                html += "    <div id=\"rule-body\" class=\"modal-body\">";
                html += "        <input name=\"rule-id\" type=\"hidden\" value=\"" + rule_id + "\">";
                html += "        <div class=\"row form-group\">";
                html += "            <div class=\"col-sm-12\">";
                html += "                <input type=\"text\" value=\"" + title + "\" name=\"title\" class=\"form-control\">";
                html += "            <\/div>";
                html += "        <\/div>";
                html += "    <\/div>";
                html += "    <div class=\"panel-footer\">";
                html += "        <div class=\"keyword-btn\">";
                html += "            <button class=\"btn btn-sm cancel\">取消<\/button>"
                html += "             <button class=\"btn btn-primary btn-sm save\" action=\"modify\">保存<\/button>";
                html += "        <\/div>";
                html += "    <\/div>";
                html += "<\/div>";
                html += "";

            return html;
        },

        /**
         * 清除关键词浮层
         * 
         * @return void
         */
        clear : function (self) {

            if ( false !== _loaded.rule )
            {

                if ( false === self )
                {
                    $(_loaded.rule).popover('destroy');
                }
                
                _loaded.rule = false;
            }
        },

        cancel : function (obj) {
            
            $(obj).parent().find('.cancel').click(function () {
                core.clear('rule', false);    
            })
        
        }
    }


    var keyword = {

        /**
         * 关键词初始化
         * 
         * @return void
         */
        init : function () {
            
            var _this = this;

            // 关键词悬停
            $("body").delegate(".keyword-box>li", "mouseover", function (e) {
                _this.hover(this, 'show');
            
            }).delegate(".keyword-box>li", "mouseout", function (e) {
                
                _this.hover(this);

            }).delegate(".keyword-box>li>.delete", "click", function (e) {

                // 删除
                keyword.delete($(this));

                return false;
            }).delegate(".keyword-create", "click", function (e) {

                // 创建关键词弹层
                _this.layer(this);

                // 保存
                _this.save(this);

                // 取消
                _this.cancel(this);

            
            }).delegate(".keyword-box>li", "click", function (e) {

                // 关键词 点击 事件 (编辑)
                _this.layer(this, 'modify');

                // 保存
                _this.save(this);
                
                // 取消
                _this.cancel(this);
            }) 

            // // 编辑关键词弹层
            // $(".reply-box").delegate(".keyword-box>li", "mouseover", function (e) {

            //     // _this.mouseover(this);
            
            // })
            
        },

        /**
         * 关键词 悬停 移除
         * 
         * @param  object obj    被悬停的对象
         * @param  object handle 显示或隐藏 (show/hide)
         * @return void
         */
        hover : function (obj, handle) {

            $(obj).parents('#rule-list').find('.delete').hide();

            if ( handle == 'show' )
            {
                $(obj).find('.delete').show();
            }

            return false;
        },

        /**
         * 弹层
         * 
         * @param  object  obj    触发对象
         * @param  string  handle 方法
         * @return void
         */
        layer : function (obj, handle) {
            
            // 规则 primary-key value
            var rule_id = $(obj).parents(".reply-box").attr('rule-id');

            if ( rule_id === undefined || rule_id == '' )
            {
                alert('发生错误啦，刷新页面试试。');
                return false;
            }

            // 嵌入 html 所需数据
            var data = {
                'rule_id' : rule_id,
            }

            if ( handle == 'modify' )
            {

                // 关键词 primary key value
                data.keyword_id = $(obj).attr('keyword-id');

                // 关键词
                var _keyword_obj = $(obj).children();
                data.title = $(_keyword_obj['0']).html();

                // 匹配规则
                data.rule = $(_keyword_obj['1']).attr('rule');

            }


            var _html = this.layer_html(data, handle);

            // 显示状态
            var _display = $(obj).parent().find('.popover').css('display');

            // 清除标识
            core.clear('keyword',  ( obj == _loaded.last ? true : false ) );
    
            // 弹层
            core.layer(obj, _html, _display);

            // 标识最后操作对象
            _loaded.keyword = _loaded.last = obj;

        },

        /**
         * 弹层内容 html
         * 
         * @param  object data   表单数据
         * @param  string action 方法
         * @return void
         */
        layer_html : function (data, action) {
            
            // 字典排序
            _init_data = data = {
                keyword_id : data.keyword_id || 0,
                rule       : data.rule,
                rule_id    : data.rule_id,
                title      : data.title || ''
            }

            // 默认选中
            var exact = vague = '';

            if ( action != 'modify' )
            {
                // 操作模式
                action = 'create';
            }

            if ( data.rule == 'exact' )
            {
                // 精确匹配
                exact = "checked=\"checked\"";
            }
            else
            {
                // 模糊匹配
                vague = "checked=\"checked\"";
            }

            var html = "";
                html += "<div class=\"keyword-form\">";
                html += "";
                html += "";
                html += "        <div id=\"keyword-body\" class=\"modal-body\">";
                html += "";
                html += "            <input type=\"hidden\" value=\"" + data.rule_id + "\" name=\"rule-id\">";
                html += "            <input type=\"hidden\" value=\"" + data.keyword_id + "\" name=\"keyword-id\">";
                html += "";
                html += "            <div class=\"row form-group\">";
                html += "                <label class=\"col-sm-4 control-label\"><em class=\"required\">*<\/em> <small>关键词<\/small><\/label>";
                html += "                <div class=\"col-sm-7\">";
                html += "                    <input type=\"text\" value=\"" + data.title + "\" name=\"title\" class=\"form-control\">";
                html += "                <\/div>";
                html += "            <\/div>";
                html += "";
                // html += "            <div class=\"row form-group\">";
                // html += "";
                // html += "                <label class=\"col-sm-4 control-label\"><em class=\"required\">*<\/em> <small>匹配规则<\/small><\/label>";
                // html += "                <div class=\"col-sm-7\">";
                // html += "                    <div class=\"keyword-type-group\">";
                // html += "                        <label class=\"checkbox-inline\">";
                // html += "                            <input name=\"rule\" " + exact + " type=\"radio\" value=\"exact\" class=\"px\">";
                // html += "                            <span class=\"lbl\">精确<\/span>";
                // html += "                        <\/label>";
                // html += "                        <label class=\"checkbox-inline\">";
                // html += "                            <input name=\"rule\" "+  vague  +" type=\"radio\" value=\"vague\" class=\"px\">";
                // html += "                            <span class=\"lbl\">模糊<\/span>";
                // html += "                        <\/label>";
                // html += "                    <\/div>";
                // html += "                <\/div>";
                // html += "            <\/div>";
                html += "        <\/div>";
                html += "";
                html += "        <div class=\"panel-footer\">";
                html += "            <div class=\"keyword-btn\">";
                html += "                <button class=\"btn btn-sm cancel\">取消<\/button>";
                html += "                <button class=\"btn btn-primary btn-sm save\" action=\"" + action + "\">保存<\/button>";
                html += "            <\/div>";
                html += "        <\/div>";
                html += "    <\/div>";
            
            return html;
        },

        /**
         * 删除关键词
         * 
         * @param  object obj 
         * @return void
         */
        delete : function (obj) {

            var keyword_id = $(obj).parent('li').attr("keyword-id");

            var _url =  store.url.site('webchat/autoreply/delkeyword/?id=') + keyword_id;

            // 操作成功回掉函数
            core.load.callback = function (data) {

                if ( _xhr.code == 1 )
                {
                    alert(_xhr.msg);
                    return false;
                }

                var keyword_count = $(obj).parents('.reply-box').find('li').length;
                if ( keyword_count == 1 )
                {

                    // 提示信息
                    var _html = '<small>您还没有关键词，赶快添加吧~</small>';
                    $(obj).parents('.keyword-box').html(_html);

                    return false;
                }

                // 移除
                $(obj).parents('li').remove();

            }

            // 数据提交
            core.load.request(_url, null, true);

        },

        /**
         * 提交保存
         * 
         * @param  object  obj 触发事件
         * @return void
         */
        save : function (obj) {

            var _this = this;

            $(obj).parent().find('.save').click(function () {

                var action = $(this).attr('action');

                var _parent = $(this).parents('.keyword-form');

                // 规则标识
                var rule_id = $(_parent).find("input[name='rule-id']").val();

                // 关键词
                var keyword_value = $(_parent).find("input[name='title']").val();

                // 匹配规则
                var match_rule = $(_parent).find("input[name='rule']:checked").val();

                if ( false === _this.validation(keyword_value) )
                {
                    return false;
                }

                var data = {
                    rule_id : rule_id,
                    title   : keyword_value,
                    rule    : match_rule
                }

                if ( action == 'modify' )
                {
                    
                    // 字典排序
                    data = {
                        keyword_id : $(_parent).find("input[name='keyword-id']").val(),
                        rule       : data.rule,
                        rule_id    : data.rule_id,
                        title      : data.title
                    }

                    var is_changed = false;
                    for ( var i in data) {
                        
                        if ( data[i] !== _init_data[i] )
                        {
                            is_changed = true;
                            break;
                        }
                    }

                    if ( false === is_changed )
                    {
                        // 未改变
                        core.clear('keyword', false);
                        return false;
                    }
                }

                _this.post(data);

            });

            return false;
        },

        cancel : function (obj) {
            
            $(obj).parent().find('.cancel').click(function () {
                core.clear('keyword', false);    
            })
        
        },

        /**
         * 数据 push
         * 
         * @param  object data 提交数据
         * @return void
         */
        post : function (data) {

            core.load.before = this.before;

            core.load.callback = this.callback;

            // 数据提交
            core.load.request('keyword', data);
        },

        /**
         * 创建关键词回掉函数
         * 
         * @param  object   data 
         * @return 
         */
        callback : function (data) {

            // 记录触发事件
            var _btn = _loaded.keyword;

            if ( _xhr.code == 0 )
            {
                // 重置状态
                core.clear('keyword', false);

                if ( data.keyword_id )
                {
                    var _html = keyword.render_html(data, 'modify');

                    $(_btn).html(_html);    
                }
                else
                {
                    var _data = {
                        title : data.title,
                        rule  : data.rule,
                        keyword_id : _xhr.keyword_id
                    }

                    var _html = keyword.render_html(_data);

                    $(_btn).parents('.reply-box').find('.keyword-box').prepend(_html);

                    // 移除提示信息
                    $(_btn).parents('.reply-box').find('small').remove();
                }
            }
            else
            {
                alert(_xhr.msg);
                core.clear('keyword', false);

            }

        },

        /**
         * 渲染模板
         * @param  object data   表单数据
         * @param  string handle 方法
         * @return void
         */
        render_html : function (data, handle) {

            // 前缀 后缀
            var _prefix = _suffix = '';

            if ( handle != 'modify' )
            {
                _prefix = "<li keyword-id=\"" +  _xhr.datas.keyword_id + "\">";
                _suffix = "<\/li>";
            }

            var _rule = '';

            if ( data.rule == 'exact' )
            {
                _rule = '精确';
            }
            else
            {
                _rule = '模糊';
            }   
            
            var html = _prefix + "";
                html += "<button class=\"btn btn-primary btn-xs btn-outline btn-rounded\">" + data.title + "<\/button>";
                html += "<span class=\"delete\" style=\"display: none;\"><a href=\"javascrpt:void(0)\">x<\/a><\/span>";
                html += _suffix;

            return html;

        },

        /**
         * 表单提交 loading 样式
         * 
         * @return void
         */
        before : function () {

            var keyword_body = $("#keyword-body");

            var loading = '<div style="text-align:center; line-height:85px;"><i class="fa-3x fa fa-spinner fa-spin"></i></div>';
            
            // 改变内容部分
            keyword_body.html(loading);

            // 提交按钮不可点击
            $(keyword_body).parent().find('.save').addClass('disabled')

        },

        /**
         * 表单验证
         * 
         * @param  string title 关键词
         * @return void       
         */
        validation : function (title) {

            if ( title == '' || title === undefined )
            {
                alert('关键词不能为空哦~');
                return false;
            }

            return true;
        },


        /**
         * 清除关键词浮层
         * 
         * @return void
         */
        clear : function (self) {

            if ( false !== _loaded.keyword )
            {

                if ( false === self )
                {
                    $(_loaded.keyword).popover('destroy');
                }
                
                _loaded.keyword = false;
            }
        }

    }

  

    var content = {

        /**
         * 内容初始化
         * 
         * @return void
         */
        init : function () {


            var _this = this;

            // 添加点击事件
            $("#rule-list").delegate(".rule-create", "click", function (e) {


                content_data.type = 'text';
                
                // 清除
                core.clear('content', ( this == _loaded.last ? true : false ));

                // 弹层
                _this.layer(this);
                
                // 导航分支
                _this.branch(this);

                // 标识最后一次操作对象
                _loaded.last = this;

                $(this).parent().find('.popover .save').click(function (){
                    
                    // 保存
                    _this.submit(this);
                });
                
                // 取消
                _this.cancel(this);
              
            }) 


            $(".content-list").delegate(".content-edit", "click", function (e) {

                // 清除
                core.clear('content', ( this == _loaded.last ? true : false ));

                // 弹层
                _this.layer(this, {
                    value : $(this).data('content-value'),
                    type  : $(this).data('type')
                });
                
                var _content_id = $(this).data('content-id'); 

                // 导航分支
                _this.branch(this);

                // 标识最后一次操作对象
                _loaded.last = this;

                var __this = this;

                $(this).parent().find('.popover .save').click(function (){
                    // 保存
                    _this.submit(this, _content_id, __this);
                });
                
                // 取消
                _this.cancel(this);
              
            })
        },

        /**
         * 弹窗
         * 
         * @param  object obj 
         * @return void     
         */
        layer : function (obj, data) {

            // 弹窗内容 html
            var html = this.layer_html(data);

            // 左侧浮层
            _layer.placement = 'left';

            // 弹层显示状态
            var _display = $(obj).parent().find('.popover').css('display');

            // 弹窗
            core.layer(obj, html, _display);

            _loaded.content = obj;

            // 恢复自动浮层
            _layer.placement = 'auto';
        },

        /**
         * 累加文本域
         * 
         * @param  string   value 累加添加的内容
         * @return void
         */
        insert : function (value) {

            var _content = $(".popover .content");

            var _value = _content.val() + value;

            _content.val(_value);
        },

        /**
         * 内容导航操作分支
         * 
         * @return void
         */
        branch : function () {
         
            $("ul").delegate("a", "click", function (e) {

                // 样式
                $(this).parents('.content-form').find('.active').removeClass('active');
                $(this).addClass('active');

                var object = $(this).attr('type');

                // 清除弹层
                core.clear('branch', ( this == _loaded.last ? true : false ));

                // 标识最后一次操作的对象
                _loaded.last = this;
                if ( object == 'text' )
                {
                    // 文本输入模式
                    content.change('text');

                }
                else if ( object == 'expression')
                {
                    // 表情
                    expression.init(this);
                }
                else if ( object == 'links' ) 
                {

                    // 链接
                    links.init(this);
                }   
                else if ( object == 'imgtext' )
                {

                    imgtext.init(this);
                }

                $(".content-nav .arrow").remove();
            })
        },

        /**
         * 清除内容浮层
         * 
         * @return void
         */
        clear : function (self) {
            if ( false !== _loaded.content )
            {

                if ( false === self )
                {
                    $(_loaded.content).popover('hide');
                }
                
                _loaded.content = false;
            }
        },

        submit : function (obj, id, _obj) {


            var form = $(obj).parents('.popover');

            // 表单提交数据
            var data = {
                'rule_id' : $(obj).parents('.reply-box').attr('rule-id')
            }

            if ( id !== undefined )
            {
                data.id = id;
            }
            else
            {
                data.id = 0;
            }

            if ( content_data.type == 'text' )
            {
                // 文本
                data.content = $("#content-value").val();

                var rs = this.validation(data)

                if ( false === rs ) return false;
            
            }
            
            else if (content_data.type == 'imgtext')
            {
                // 图文素材
                data.media_id = content_data.media_id;
            }
            else
            {
                alert('开发中 ...');
                return false;
            }

            // 请求类型
            data.type = content_data.type;

            if ( data.type == 'imgtext' )
            {
                data.content = $(".media_tit_one").html();
            }

            // 表单
            $(obj).addClass('disabled');

            core.load.before = this.before;

            core.load.callback = this.callback;

            // 数据提交
            core.load.request('content', data, '', _obj);    


        },

        validation : function(data) {

            if ( data.content == '' || data.content === undefined )
            {
                alert("内容不能为空");

                return false;
            }

            return data;
        },

        /**
         * 表单提交 loading 样式
         * 
         * @return void
         */
        before : function () {

            var content_body = $("#content-body");

            var loading = '<div style="text-align:center; line-height:172px;"><i class="fa-3x fa fa-spinner fa-spin"></i></div>';
            
            // 改变内容部分
            content_body.html(loading);

            // 提交按钮不可点击
            $(content_body).parent().find('.save').addClass('disabled');
        },

        callback : function (data, obj, xhr) {

            // 记录触发事件
            var _btn = _loaded.content;

            if ( _xhr.code == 0 )
            {


                // 重置状态
                core.clear('content', false);

                // 内容
                $(_btn).parents('.reply-box').find('.content-list small').remove();


                var is_modify = data.id;

                if ( is_modify == 0 )
                {
                    data.id = xhr.datas.content_id;
                }

                var _html = content.render_html(data);

                if ( is_modify == 0 )
                {
                    $(_btn).parents('.reply-box').find('.content-list').prepend(_html);    
                }
                else
                {
                    $(obj).parents(".list-content")[0].outerHTML = _html;
                }
            }
            else
            {
                alert(_xhr.msg);
            }
        },

        layer_html : function (data, handle) {

            var value = '';
            if ( data !== undefined )
            {
                value = data.value;
            }   

            var html = "";
                html += "<div class=\"content-form\" style=\"width:400px;\" rule-id=\"8989\">";
                html += "    <div class=\"panel-heading\">";
                html += "        <ul>";
                html += "            <li class=\"content-nav\"><a class=\"active\" type=\"text\" href=\"javascript:void(0)\">文本<\/a><\/li>";
                html += "            <li class=\"content-nav\"><a type=\"expression\" href=\"javascript:void(0)\">表情<\/a><\/li>";
                html += "            <li class=\"content-nav\"><a type=\"links\" href=\"javascript:void(0)\">链接<\/a><\/li>";

                // html += "            <li class=\"content-nav\"><a type=\"image\" href=\"javascript:void(0)\">图片<\/a><\/li>";
                // html += "            <li class=\"content-nav\"><a type=\"video\" href=\"javascript:void(0)\">语音<\/a><\/li>";
                // html += "            <li class=\"content-nav\"><a type=\"music\" href=\"javascript:void(0)\">音乐<\/a><\/li>";

                html += "            <li class=\"content-nav\"><a data-title=\"选择图文素材\" data-fa=\"fa-reply\" data-size=\"large\" target=\"ms-load-page\" data-callback=\"re_imgtext\" type=\"imgtext\" href=\"" + store.url.site("webchat/imgtext?type=load") + "\">图文<\/a><\/li>";
                

                html += "        <\/ul>";
                html += "    <\/div>";
                html += "";
                html += "    <div id=\"content-body\" class=\"panel-body\">";
                
                // 默认 文本模式
                html += "<textarea id=\"content-value\" name=\"content\"  rows=\"9\" placeholder=\"回复内容\" class=\"content form-control\">"+value+"<\/textarea>";
                
                html += "    <\/div>";
                html += "";
                html += "    <div class=\"panel-footer\">";
                // html += "        <small>还能输入 48 个字<\/small>";
                html += "        <small>&nbsp;<\/small>";

                html += "        <div class=\"panel-heading-controls\">";
                html += "            <button class=\"btn btn-sm cancel\">取消<\/button>";
                html += "            <button data-type=\"text\" class=\"btn btn-primary btn-sm save\">保存<\/button>";
                html += "        <\/div>";
                html += "    <\/div>";
                html += "<\/div>";
            return html;
        },

        render_html : function (data, xhr) {


            var _data_type = '';

            if ( data.type == 'text' )
            {
                _data_type = '文本';
            }
            else if ( data.type == 'imgtext' )
            {
                _data_type = '图文';
            }

            // data.content = data.content.substring(0, 22);

            var html = "";
                html += "<div class=\"list-content row form-group\">";
                html += "    <span class=\"label label-success\">" + _data_type + "<\/span>";
                html += "    <a href=\"javascript::void(0)\" target=\"_blank\" class=\"new-window\">" + data.content + "<\/a>";
                html += "    <div class=\"panel-heading-controls\">";
                html += "        <a ";

                html += " data-content-id=\""+data.id+"\"";

                html += "data-content-value=\""+data.content+"\"";

                html += "data-type=\""+data.type+"\"";
                                                

                html += " class=\"content-edit btn btn-primary btn-xs btn-outline\" href=\"javascript:void(0)\">";
                html += "        <i class=\"fa fa-edit\"><\/i>编辑<\/a>";
                
                html += "        <a target=\"ms-confirm\"";

                var _url = store.url.site('webchat/autoreply/delcontent/?id=') + data.id;

                html += " data-callback=\"delcontent\" href=\"" + _url + "\"";

                html += "class=\"btn btn-primary btn-xs btn-outline\">";
                
                html += "        <i class=\"fa fa-times\"><\/i>删除<\/a>";
                html += "    <\/div>";
                html += "<\/div>";
            
            return html;
        },

        /**
         * 切换输入框模式
         * 
         * @return void
         */
        change : function (type, html) {


            var _html = "";

            if ( type == 'text' || type == 'expression' || type == 'links' )
            {
                // 文本模式
                _html += "<textarea id=\"content-value\" name=\"content\"  rows=\"9\" placeholder=\"回复内容\" class=\"content form-control\"><\/textarea>";
                
                // 标识保存状态 文本类型
                content_data.type = "text";
            }
            else if ( type == 'imgtext' )
            {

                // 标识保存状态 图文素材类型
                content_data.type = "imgtext";

                var _prefix = "<div class=\"content-form-box\">";
                var _suffix = "</div>";

                _html = _prefix + html + _suffix;
            }

            if ( content_data.last_pattern == content_data.type && content_data.type ==  "text" )
            {
                // 最后操作处于编辑模式， 取消替换
                return false;
            }

            $("#content-body").html(_html);
            
            content_data.last_pattern = content_data.type;
        },

        /**
         * 取消
         * 
         * @param  object  obj 
         * @return 
         */
        cancel : function (obj) {
            $(obj).parent().find('.cancel').click(function () {
                core.clear('content', false);    
            })
        }
    }


    /**
     * 表情
     */
    var expression = {

        /**
         * 表情初始化
         * 
         * @param  object obj
         * @return void    
         */
        init : function (obj) {

            var html = this.layer_html();

            // 内容弹层
            this.layer(obj, html);

            // 表情点击
            this.click();
        },

        /**
         * 弹层
         * 
         * @param  object  obj   
         * @param  string  value 
         * @return void
         */
        layer : function (obj, value) {
            
            // 弹层显示状态
            var _display = $(obj).parent().find('.popover').css('display');

            // 弹窗
            core.layer(obj, value, _display);                       

            // 对象标识
            _loaded.expression = obj;
            
        },

        /**
         * 渲染表情模板
         * 
         * @return string
         */
        layer_html : function () {

            var _prefix = store.url.media() + 'public/qq/';

            var html = "";
                html += "<div class=\"content-expression\">";
                html += "    <ul class=\"emotion-container clearfix\">";
                html += "        <li><img src=\"" + _prefix + "01.gif\" alt=\"[微笑]\" title=\"[微笑]\">";
                html += "        <\/li><li><img src=\"" + _prefix + "02.gif\" alt=\"[撇嘴]\" title=\"[撇嘴]\">";
                html += "        <\/li><li><img src=\"" + _prefix + "03.gif\" alt=\"[色]\" title=\"[色]\">";
                html += "        <\/li><li><img src=\"" + _prefix + "04.gif\" alt=\"[发呆]\" title=\"[发呆]\">";
                html += "        <\/li><li><img src=\"" + _prefix + "05.gif\" alt=\"[得意]\" title=\"[得意]\">";
                html += "        <\/li><li><img src=\"" + _prefix + "06.gif\" alt=\"[流泪]\" title=\"[流泪]\">";
                html += "        <\/li><li><img src=\"" + _prefix + "07.gif\" alt=\"[害羞]\" title=\"[害羞]\">";
                html += "        <\/li><li><img src=\"" + _prefix + "08.gif\" alt=\"[闭嘴]\" title=\"[闭嘴]\">";
                html += "        <\/li><li><img src=\"" + _prefix + "09.gif\" alt=\"[睡]\" title=\"[睡]\">";
                html += "        <\/li><li><img src=\"" + _prefix + "10.gif\" alt=\"[大哭]\" title=\"[大哭]\">";
                html += "        <\/li><li><img src=\"" + _prefix + "11.gif\" alt=\"[尴尬]\" title=\"[尴尬]\">";
                html += "        <\/li><li><img src=\"" + _prefix + "12.gif\" alt=\"[发怒]\" title=\"[发怒]\">";
                html += "        <\/li><li><img src=\"" + _prefix + "13.gif\" alt=\"[调皮]\" title=\"[调皮]\">";
                html += "        <\/li><li><img src=\"" + _prefix + "14.gif\" alt=\"[呲牙]\" title=\"[呲牙]\">";
                html += "        <\/li><li><img src=\"" + _prefix + "15.gif\" alt=\"[惊讶]\" title=\"[惊讶]\">";
                html += "        <\/li><li><img src=\"" + _prefix + "16.gif\" alt=\"[难过]\" title=\"[难过]\">";
                html += "        <\/li><li><img src=\"" + _prefix + "17.gif\" alt=\"[酷]\" title=\"[酷]\">";
                html += "        <\/li><li><img src=\"" + _prefix + "18.gif\" alt=\"[冷汗]\" title=\"[冷汗]\">";
                html += "        <\/li><li><img src=\"" + _prefix + "19.gif\" alt=\"[抓狂]\" title=\"[抓狂]\">";
                html += "        <\/li><li><img src=\"" + _prefix + "20.gif\" alt=\"[吐]\" title=\"[吐]\">";
                html += "        <\/li><li><img src=\"" + _prefix + "21.gif\" alt=\"[偷笑]\" title=\"[偷笑]\">";
                html += "        <\/li><li><img src=\"" + _prefix + "22.gif\" alt=\"[愉快]\" title=\"[愉快]\">";
                html += "        <\/li><li><img src=\"" + _prefix + "23.gif\" alt=\"[白眼]\" title=\"[白眼]\">";
                html += "        <\/li><li><img src=\"" + _prefix + "24.gif\" alt=\"[傲慢]\" title=\"[傲慢]\">";
                html += "        <\/li><li><img src=\"" + _prefix + "25.gif\" alt=\"[饥饿]\" title=\"[饥饿]\">";
                html += "        <\/li><li><img src=\"" + _prefix + "26.gif\" alt=\"[困]\" title=\"[困]\">";
                html += "        <\/li><li><img src=\"" + _prefix + "27.gif\" alt=\"[惊恐]\" title=\"[惊恐]\">";
                html += "        <\/li><li><img src=\"" + _prefix + "28.gif\" alt=\"[流汗]\" title=\"[流汗]\">";
                html += "        <\/li><li><img src=\"" + _prefix + "29.gif\" alt=\"[憨笑]\" title=\"[憨笑]\">";
                html += "        <\/li><li><img src=\"" + _prefix + "30.gif\" alt=\"[悠闲]\" title=\"[悠闲]\">";
                html += "        <\/li><li><img src=\"" + _prefix + "31.gif\" alt=\"[奋斗]\" title=\"[奋斗]\">";
                html += "        <\/li><li><img src=\"" + _prefix + "32.gif\" alt=\"[咒骂]\" title=\"[咒骂]\">";
                html += "        <\/li><li><img src=\"" + _prefix + "33.gif\" alt=\"[疑问]\" title=\"[疑问]\">";
                html += "        <\/li><li><img src=\"" + _prefix + "34.gif\" alt=\"[嘘]\" title=\"[嘘]\">";
                html += "        <\/li><li><img src=\"" + _prefix + "35.gif\" alt=\"[晕]\" title=\"[晕]\">";
                html += "        <\/li><li><img src=\"" + _prefix + "36.gif\" alt=\"[疯了]\" title=\"[疯了]\">";
                html += "        <\/li><li><img src=\"" + _prefix + "37.gif\" alt=\"[衰]\" title=\"[衰]\">";
                html += "        <\/li><li><img src=\"" + _prefix + "38.gif\" alt=\"[骷髅]\" title=\"[骷髅]\">";
                html += "        <\/li><li><img src=\"" + _prefix + "39.gif\" alt=\"[敲打]\" title=\"[敲打]\">";
                html += "        <\/li><li><img src=\"" + _prefix + "40.gif\" alt=\"[再见]\" title=\"[再见]\">";
                html += "        <\/li><li><img src=\"" + _prefix + "41.gif\" alt=\"[擦汗]\" title=\"[擦汗]\">";
                html += "        <\/li><li><img src=\"" + _prefix + "42.gif\" alt=\"[抠鼻]\" title=\"[抠鼻]\">";
                html += "        <\/li><li><img src=\"" + _prefix + "43.gif\" alt=\"[鼓掌]\" title=\"[鼓掌]\">";
                html += "        <\/li><li><img src=\"" + _prefix + "44.gif\" alt=\"[糗大了]\" title=\"[糗大了]\">";
                html += "        <\/li><li><img src=\"" + _prefix + "45.gif\" alt=\"[坏笑]\" title=\"[坏笑]\">";
                html += "        <\/li><li><img src=\"" + _prefix + "46.gif\" alt=\"[左哼哼]\" title=\"[左哼哼]\">";
                html += "        <\/li><li><img src=\"" + _prefix + "47.gif\" alt=\"[右哼哼]\" title=\"[右哼哼]\">";
                html += "        <\/li><li><img src=\"" + _prefix + "48.gif\" alt=\"[哈欠]\" title=\"[哈欠]\">";
                html += "        <\/li><li><img src=\"" + _prefix + "49.gif\" alt=\"[鄙视]\" title=\"[鄙视]\">";
                html += "        <\/li><li><img src=\"" + _prefix + "50.gif\" alt=\"[委屈]\" title=\"[委屈]\">";
                html += "        <\/li><li><img src=\"" + _prefix + "51.gif\" alt=\"[快哭了]\" title=\"[快哭了]\">";
                html += "        <\/li><li><img src=\"" + _prefix + "52.gif\" alt=\"[阴险]\" title=\"[阴险]\">";
                html += "        <\/li><li><img src=\"" + _prefix + "53.gif\" alt=\"[亲亲]\" title=\"[亲亲]\">";
                html += "        <\/li><li><img src=\"" + _prefix + "54.gif\" alt=\"[吓]\" title=\"[吓]\">";
                html += "        <\/li><li><img src=\"" + _prefix + "55.gif\" alt=\"[可怜]\" title=\"[可怜]\">";
                html += "        <\/li><li><img src=\"" + _prefix + "56.gif\" alt=\"[菜刀]\" title=\"[菜刀]\">";
                html += "        <\/li><li><img src=\"" + _prefix + "57.gif\" alt=\"[西瓜]\" title=\"[西瓜]\">";
                html += "        <\/li><li><img src=\"" + _prefix + "58.gif\" alt=\"[啤酒]\" title=\"[啤酒]\">";
                html += "        <\/li><li><img src=\"" + _prefix + "59.gif\" alt=\"[篮球]\" title=\"[篮球]\">";
                html += "        <\/li><li><img src=\"" + _prefix + "60.gif\" alt=\"[乒乓]\" title=\"[乒乓]\">";
                html += "        <\/li><li><img src=\"" + _prefix + "61.gif\" alt=\"[咖啡]\" title=\"[咖啡]\">";
                html += "        <\/li><li><img src=\"" + _prefix + "62.gif\" alt=\"[饭]\" title=\"[饭]\">";
                html += "        <\/li><li><img src=\"" + _prefix + "63.gif\" alt=\"[猪头]\" title=\"[猪头]\">";
                html += "        <\/li><li><img src=\"" + _prefix + "64.gif\" alt=\"[玫瑰]\" title=\"[玫瑰]\">";
                html += "        <\/li><li><img src=\"" + _prefix + "65.gif\" alt=\"[凋谢]\" title=\"[凋谢]\">";
                html += "        <\/li><li><img src=\"" + _prefix + "66.gif\" alt=\"[嘴唇]\" title=\"[嘴唇]\">";
                html += "        <\/li><li><img src=\"" + _prefix + "67.gif\" alt=\"[爱心]\" title=\"[爱心]\">";
                html += "        <\/li><li><img src=\"" + _prefix + "68.gif\" alt=\"[心碎]\" title=\"[心碎]\">";
                html += "        <\/li><li><img src=\"" + _prefix + "69.gif\" alt=\"[蛋糕]\" title=\"[蛋糕]\">";
                html += "        <\/li><li><img src=\"" + _prefix + "70.gif\" alt=\"[闪电]\" title=\"[闪电]\">";
                html += "        <\/li><li><img src=\"" + _prefix + "71.gif\" alt=\"[炸弹]\" title=\"[炸弹]\">";
                html += "        <\/li><li><img src=\"" + _prefix + "72.gif\" alt=\"[刀]\" title=\"[刀]\">";
                html += "        <\/li><li><img src=\"" + _prefix + "73.gif\" alt=\"[足球]\" title=\"[足球]\">";
                html += "        <\/li><li><img src=\"" + _prefix + "74.gif\" alt=\"[瓢虫]\" title=\"[瓢虫]\">";
                html += "        <\/li><li><img src=\"" + _prefix + "75.gif\" alt=\"[便便]\" title=\"[便便]\">";
                html += "        <\/li><li><img src=\"" + _prefix + "76.gif\" alt=\"[月亮]\" title=\"[月亮]\">";
                html += "        <\/li><li><img src=\"" + _prefix + "77.gif\" alt=\"[太阳]\" title=\"[太阳]\">";
                html += "        <\/li><li><img src=\"" + _prefix + "78.gif\" alt=\"[礼物]\" title=\"[礼物]\">";
                html += "        <\/li><li><img src=\"" + _prefix + "79.gif\" alt=\"[拥抱]\" title=\"[拥抱]\">";
                html += "        <\/li><li><img src=\"" + _prefix + "80.gif\" alt=\"[强]\" title=\"[强]\">";
                html += "        <\/li><li><img src=\"" + _prefix + "81.gif\" alt=\"[弱]\" title=\"[弱]\">";
                html += "        <\/li><li><img src=\"" + _prefix + "82.gif\" alt=\"[握手]\" title=\"[握手]\">";
                html += "        <\/li><li><img src=\"" + _prefix + "83.gif\" alt=\"[胜利]\" title=\"[胜利]\">";
                html += "        <\/li><li><img src=\"" + _prefix + "84.gif\" alt=\"[抱拳]\" title=\"[抱拳]\">";
                html += "        <\/li><li><img src=\"" + _prefix + "85.gif\" alt=\"[勾引]\" title=\"[勾引]\">";
                html += "        <\/li><li><img src=\"" + _prefix + "86.gif\" alt=\"[拳头]\" title=\"[拳头]\">";
                html += "        <\/li><li><img src=\"" + _prefix + "87.gif\" alt=\"[差劲]\" title=\"[差劲]\">";
                html += "        <\/li><li><img src=\"" + _prefix + "88.gif\" alt=\"[爱你]\" title=\"[爱你]\">";
                html += "        <\/li><li><img src=\"" + _prefix + "89.gif\" alt=\"[NO]\" title=\"[NO]\">";
                html += "        <\/li><li><img src=\"" + _prefix + "90.gif\" alt=\"[OK]\" title=\"[OK]\">";
                html += "        <\/li><li><img src=\"" + _prefix + "91.gif\" alt=\"[爱情]\" title=\"[爱情]\">";
                html += "        <\/li><li><img src=\"" + _prefix + "92.gif\" alt=\"[飞吻]\" title=\"[飞吻]\">";
                html += "        <\/li><li><img src=\"" + _prefix + "93.gif\" alt=\"[跳跳]\" title=\"[跳跳]\">";
                html += "        <\/li><li><img src=\"" + _prefix + "94.gif\" alt=\"[发抖]\" title=\"[发抖]\">";
                html += "        <\/li><li><img src=\"" + _prefix + "95.gif\" alt=\"[怄火]\" title=\"[怄火]\">";
                html += "        <\/li><li><img src=\"" + _prefix + "96.gif\" alt=\"[转圈]\" title=\"[转圈]\">";
                html += "        <\/li><li><img src=\"" + _prefix + "97.gif\" alt=\"[磕头]\" title=\"[磕头]\">";
                html += "        <\/li><li><img src=\"" + _prefix + "98.gif\" alt=\"[回头]\" title=\"[回头]\">";
                html += "        <\/li><li><img src=\"" + _prefix + "99.gif\" alt=\"[跳绳]\" title=\"[跳绳]\">";
                html += "        <\/li><li><img src=\"" + _prefix + "100.gif\" alt=\"[投降]\" title=\"[投降]\">";
                html += "        <\/li><li><img src=\"" + _prefix + "101.gif\" alt=\"[激动]\" title=\"[激动]\">";
                html += "        <\/li><li><img src=\"" + _prefix + "102.gif\" alt=\"[乱舞]\" title=\"[乱舞]\">";
                html += "        <\/li><li><img src=\"" + _prefix + "103.gif\" alt=\"[献吻]\" title=\"[献吻]\">";
                html += "        <\/li><li><img src=\"" + _prefix + "104.gif\" alt=\"[左太极]\" title=\"[左太极]\">";
                html += "        <\/li><li><img src=\"" + _prefix + "105.gif\" alt=\"[右太极]\" title=\"[右太极]\">";
                html += "        <\/li>";
                html += "    <\/ul>";
                html += "<\/div>";

            return html;
        },

        /**
         * 表情点击事件
         * 
         * @return void
         */
        click : function () {

            var _this = this;

            $(".content-expression li img").click(function () {
                
                content.change('expression');
                
                var _content = $(this).attr('alt');

                content.insert(_content);

                core.clear('branch', false);
                
            })
        },

        /**
         * 清除表情弹窗
         * 
         * @return void
         */
        clear : function (self) {

            if ( false !== _loaded.expression )
            {
                if ( false === self )
                {
                    $(_loaded.expression).popover('hide');
                }
                _loaded.expression = false;
            }
        }   
    
    }

    // 链接
    var links = {

        /**
         * 链接初始化
         * 
         * @param  object  obj 
         * @return void
         */
        init : function (obj) {

            var _this = this;

            var html = $("#content-create-link").html();

            // 链接弹出层
            this.layer(obj, html);

            // 表情点击
            $(".insert-link").click(function () {
                _this.insert();
            })
        },

        /**
         * 弹层
         * 
         * @param  object  obj   事件触发对象
         * @param  string  value
         * @return void
         */
        layer : function (obj, value) {

            // 弹层显示状态
            var _display = $(obj).parent().find('.popover').css('display');

            // 弹窗
            core.layer(obj, value, _display);                       

            // 对象标识
            _loaded.links = obj;
        },

        /**
         * 插入链接
         *   - 赞不支持选中加入 a 链接
         *   
         * @return void
         */
        insert : function () {
            
            var _href = $(".link-href").val();

            if ( -1 == _href.indexOf('http://') )
            {
                _href = 'http://'+_href;
            }

            // 插入内容
            content.insert(_href);

            // 清除弹层
            core.clear('branch', false);

        },

        /**
         * 清除表情弹窗
         * 
         * @return void
         */
        clear : function (self) {

            if ( false !== _loaded.links )
            {
                if ( false === self )
                {
                    $(_loaded.links).popover('hide');
                }

                _loaded.links = false;
            }
        }   
    }


    var imgtext = {

        /**
         * 图文素材初始化
         * 
         * @return void
         */
        init : function () {

            var _this = this;
           
           content_data.type = "imgtext";

            // // 选中记录值
            // var _id = $("#masonry").attr('data-id');

            // // 获取内容区域
            // var _change = $("#" + _id);
            // _change.find(".mask").remove();
            // _change.find(".m_right").remove();

            // // 渲染图文素材
            // content.change('imgtext', _change.html());

            // // 标识图文素材记录
            // content_data.media_id = _id;

        },

        /**
         * 切换选中
         *
         * @return void
         */
        change : function () {

            $("#masonry .imgtext-box").click(function () {


                var _parent = $("#masonry");

                // 记录选中记录值
                _parent.attr('data-id', $(this).data('id'));

                // 全部隐藏
                _parent.find(".mask").hide();
                _parent.find(".m_right").hide();

                // 选中当前
                $(this).find(".mask").show();
                $(this).find(".m_right").show();


            })
        },

        /**
         * 加载弹层渲染模板
         * 
         * @param  object _xhr  数据处理服务器返回数据对象
         * @return string     
         */
        layer_html : function (_xhr) {

            console.dir(_xhr);


            var datas = _xhr.datas;

            var lists = datas.pager.lists;

            // 前缀
            var _prefix = "<div class=\"pop-imgtext-box panel\">";
                _prefix += "    <div class=\"panel-body\" id=\"masonry\">";

            // 后缀
            var _suffix = "    <\/div>";
                _suffix += "<\/div>";

            var _html = '';
            for (var key in lists) {

                if ( lists[key].pattern == 'single' )
                {

                    // 单条
                    _html += this.layer_html_single(lists[key], datas['imgtexts']);
                }
                else
                {
                    // 多条
                    _html += this.layer_html_more(lists[key], datas['imgtexts']);
                }
            }

            // 选中
            return _prefix + _html + _suffix;
        },

        /**
         * 单图渲染模板
         * 
         * @param  object  i    
         * @param  array   _xhr
         * @return string
         */
        layer_html_single : function (i, _xhr) {
            
            var data = _xhr[i.id];

            var html = "";
                html += "";
                html += "<div id=\"" + i.id + "\" class=\"col-md-4 imgtext-box masonry-brick\">";
                html += "    <div class=\"media_wrap\">";
                html += "        <div class=\"media_panel\">";
                html += "            <div class=\"d_media_tit\">";
                html += "                <p class=\"media_tit_one\">" + data.title + "<\/p>";
                html += "                <p class=\"media_time\">" + data.created + "<\/p>";
                html += "            <\/div>";
                html += "";
                html += "            <a href=\"javascript:;\" target=\"_blank\">";
                html += "                <div class=\"media_img\">";
                html += "                    <div class=\"media_img_panel\">";
                html += "                        <img src=\"" + store.upload.thumb(data.image, 253, 141) + "\" width=\"253px\" height=\"141px\">";
                html += "                    <\/div>";
                html += "                <\/div>";
                html += "            <\/a>";
                html += "";
                html += "            <div class=\"media_con\">";
                html += "                <p class=\"media_con_text\">"+data.intro+"<\/p>";
                html += "            <\/div>";
                html += "        <\/div>";
                html += "";
                html += "        <div class=\"mask\" style=\"display:none\"><\/div>";
                html += "        <p class=\"m_right\" style=\"display:none\"><i class=\"fa fa-3x fa-check\"><\/i><\/p>";
                html += "    <\/div>";
                html += "<\/div>";
            
            return html;
        },

        /**
         * 多图渲染模板
         * 
         * @param  object  i    主记录
         * @param  array   _xhr 素材记录
         * @return string
         */
        layer_html_more : function (i, _xhr) {

            var data = _xhr[i.id];

            // 前缀
            var _prefix = "";
                _prefix += "<div id=\"" + i.id + "\" class=\"col-md-4 imgtext-box masonry-brick\">";
                _prefix += "    <div class=\"media_wrap\">";
                _prefix += "        <div class=\"media_panel\">";

            // 后缀
            var _suffix = "";
                _suffix += "        <\/div>";
                _suffix += "        <div class=\"mask\" style=\"display:none\"><\/div>";
                _suffix += "        <p class=\"m_right\" style=\"display:none\"><i class=\"fa fa-3x fa-check\"><\/i><\/p>";
                _suffix += "    <\/div>";
                _suffix += "<\/div>";
            
            // 大图部分
            // --------------------------------------------------------
            var lg_data = data[0];
            var _html = "";
                _html += "<a href=\"javascript:;\" target=\"_blank\">";
                _html += "    <div class=\"media_img\">";
                _html += "        <div class=\"media_img_panel\">";
                _html += "            <img src=\"" + store.upload.thumb(lg_data.image, 255, 150) + "\" width=\"255\" height=\"150px;\">";
                _html += "        <\/div>";
                _html += "        <div class=\"media_img_footer media_tit\">";
                _html += "            <p class=\"media_tit_one l\">" + lg_data.title + "<\/p>";
                _html += "        <\/div>";
                _html += "    <\/div>";
                _html += "<\/a>";
            // --------------------------------------------------------
            
            // 小图
            // --------------------------------------------------------
            _html += "<div class=\"media_con\">";

            for ( var key in data ) {

                if ( key == 0 ) continue;

                _html += "<a href=\"javascript:;\" target=\"_blank\">";
                _html += "    <div class=\"media_con_a clear\">";
                _html += "        <div class=\"media_tit l\">";
                _html += "            <p class=\"left\">" + data[key].title + "<\/p>";
                _html += "        <\/div>";
                _html += "        <div class=\"media_icon r\">";
                _html += "            <img src=\"" + store.upload.thumb(data[key].image, 50, 30) + "\" width=\"50px\" height=\"30px\">";
                _html += "        <\/div>";
                _html += "    <\/div>";
                _html += "<\/a>";
            }
            
            _html += "<\/div>";
            // --------------------------------------------------------
            return _prefix + _html + _suffix;
        }
    }

    $.fn.reply.defaults = {
        callback : function () {
        }

    }

})(jQuery)


function re_imgtext(obj)
{

}