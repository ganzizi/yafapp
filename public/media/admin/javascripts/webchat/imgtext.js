/**
 * 素材管理
 *
 * @author jacky 2014-09-26 11:46:57 星期五
 */
; (function ($) {

    // 弹窗加载记录
    var _loaded = false;


    $.fn.imgtext = function (options) {

        _opts = $.extend({}, $.fn.imgtext.defaults, options);

        imgtext.init();
    }

    var imgtext = {

        init : function () {
            imgtext_more.init();

            this.save();
        },

        clear : function (obj) {

            if ( _loaded !== false )
            {

                if ( obj !== _loaded )
                {   
                    $(_loaded).popover('destroy');
                }

                _loaded = false;
            }
        },

        save : function () {

            $("#imgtext-save").click(function () {



   

                var _data = {};

                var _lg = $("#imgtext-lg");

                // 操作模式
                var _action = $(this).data('action');
                if ( _action == 'create')
                {

                    // 第一张大图
                    var _data = {
                        0 : {
                            image : _lg.find("img").attr('data-image'), 
                            title : _lg.find(".media_tit_one").html(),
                            link  : _lg.find(".media_tit_one").attr("data-link-params")
                        } 
                    }

                    $("#list-sm").find(".content-sm").each(function (i) {

                        // 小图
                        var _sm_data = {
                            title : $(this).find(".left").html(),
                            image : $(this).find("img").attr('data-image'),
                            link  : $(this).find(".left").attr("data-link-params")
                        }
                        _data[i+1] = _sm_data;
                    })

                    var _url = store.url.site('webchat/imgtext/create?type=more&json=1');

                }
                else
                {

                    // 第一张大图
                    var _data = {
                        0 : {
                            image : _lg.find("img").attr('data-image'), 
                            title : _lg.find(".media_tit_one").html(),
                            link  : (_lg.find(".media_tit_one").attr("data-link-params")),
                            id    : _lg.data('id')
                        } 
                    }



                    $("#list-sm").find(".content-sm").each(function (i) {
                    
                        // 小图
                        var _sm_data = {
                            title : $(this).find(".left").html(),
                            image : $(this).find("img").attr('data-image'),
                            link  : ($(this).find(".left").attr("data-link-params")),
                            id    : $(this).data('id')
                        }
                        _data[i+1] = _sm_data;
                    })

                    var _url = store.url.site('webchat/imgtext/modify?json=1&id=' + _lg.data('record-id'));
                }


                // 数据保存
                store.ajax.load({
                    type : "POST",
                    url  : _url,
                    data : _data, 
                    before : function () {

                        // 获取表单数据
                        var loading = '<div style="text-align:center; height:31px;"><i class="fa-2x fa fa-spinner fa-spin"></i></div>';

                        bs_box = bootbox.dialog({
                            title  : "<small>正在提交，请稍候...</small>",
                            message: loading,
                            className: "bootbox-sm",
                            buttons: {}
                        });
                    
                    }, 
                    success : function (xhr) {

                        // 操作成功
                        if ( xhr.code == 0 )
                        {
                            store.url.redirect('webchat/imgtext/index')
                        }
                        else
                        {
                            $.growl.warning({ title:'提示', message: xhr.msg });
                        }

                        bootbox.hideAll();
                    }
                })
            })
        }
    }

    var imgtext_single = {

    }

    var imgtext_more = {

        init : function () {

            var _this = this;

        
            $("body").delegate(".content-sm .fa-trash-o", "click", function(){

                // 删除
                var count = $(this).parents("#list-sm").find("a").length;
                if ( count == 1 )
                {
                    alert("至少存在一个小图部分");
                    return false;
                }

                $(this).parents("a").remove();

                return false;
            });


            $("#imgtext-list").delegate("#imgtext-lg", "click", function(){

                // 大图
                _this.layer(this);
            });

            $("body").delegate(".content-sm .fa-pencil", "click", function(){

                var _obj = $(this).parents(".content-sm");
                // 小图
                _this.layer(_obj);
            });

            

            $("#imagetext-create").click(function () {

                // 新增图文消息
                _this.create_imgtext(this);
            })

        },

        /**
         * 弹窗
         * 
         * @param  object obj  触发事件
         * @param  string html 样式
         * @return void     
         */
        layer : function (obj, html) {

            // 显示状态
            var _display = $(obj).parents(".media_wrap").find('.popover').css('display');

            if ( _loaded === obj && _display == undefined)
            {
                // 当前已加载过
                _loaded = false;
                return false;
            }

            // 清除
            imgtext.clear(obj);

            // 样式
            var html = this.layer_html(obj);

            $(obj).popover({
                placement : true,
                selector  : true,
                title     : null, 
                content   : html,
                animation : false, 
                html      : true,
                placement : 'right',
                width : 900
            })

            $(obj).popover("show");

            // 赋值最后加载
            _loaded = obj;

            // 清空
            this.clear();
            // 取消
            this.cancel();
            // 保存
            this.save(obj);
        },

 

        /**
         * 清空
         * 
         * @return {[type]} [description]
         */
        clear : function () {

            $("#footer_clear").click(function () {

                // 清空
                var _form = $(this).parents(".imgtext-form");

                // 清空标题
                _form.find("input[name='title']").val("");

                // 清空图片 隐藏div
                _form.find("#html-image").html("").hide();

            })
        },

        /**
         * 取消
         * 
         * @return void
         */
        cancel : function () {
            $("#footer_cancel").click(function () {

                // 销毁弹窗
                imgtext.clear();

            })
        },

        /**
         * 保存
         * 
         * @param  object obj
         * @return object
         */
        save : function (obj) {

            var type = $(obj).data('type');

            $("#footer_save").click(function () {

                // 表单处理
                // ---------------------------------------------------
                var _form = $(this).parents(".imgtext-form");

                // 标题
                var _title = _form.find("input[name='title']").val();

                // 图片
                var _image = _form.find("input[name='image']").val() || _form.find("img").attr('src');

                // 图片 URL
                var _src = store.upload.url(_image);

                // 链接
                var _link_params = $("#link-params").val();
                var _link_title = _form.find("#link").val();
                // ---------------------------------------------------

                // 关闭弹窗
                imgtext.clear();

                if ( type == 'lg' )
                {
                    // 大图部分
                    $(obj).find(".media_tit_one").html(_title)
                        .attr("data-link-params", _link_params)
                        .attr("data-link-title", _link_title);
                }
                else
                {
                    // 小图部分
                    $(obj).find(".media_tit p").html(_title)
                        .attr("data-link-params", _link_params)
                        .attr("data-link-title", _link_title)
                }

                if ( _src )
                {
                    $(obj).find("img").attr("src", _src).show();

                    $(obj).find(".default-img-null").hide();
                }
                else
                {
                    $(obj).find("img").attr("src", "").hide();
                    $(obj).find(".default-img-null").show();

                }
                
                if (_image === undefined )
                {
                    _image = '';
                }

                $(obj).find("img").attr("data-image", _image);

                  
            })
        },

        layer_html : function (obj) {

            // 前缀删除按钮，第一张大图，保留一张小图不可删除
            var _footer_prefix = '';

            var _image = _src = '';

            // 类型
            var type = $(obj).data('type');
            if ( type == 'lg' )
            {
                // 大图
                var _title = $(obj).find(".media_tit_one");
                
                var title = _title.html();

            }
            else
            {
                // 散列小图
                var _title = $(obj).find(".left");

                var title = _title.html();
            }

            var _link_title = _title.attr('data-link-title');

            // 图片地址
            _src = $(obj).find("img").attr("src");
 

            // 图片名称
            _image = $(obj).find("img").data('image');

            var _uri_url = store.url.site('webchat/uri');

            var html = "";
                html += "<div class=\"imgtext-form\" style=\"width:350px;\">";
                html += "";
                html += "    <div class=\"form-group\">";
                html += "        <label for=\"title\" class=\"col-sm-2 control-label\">标题<\/label>";
                html += "        <div class=\"col-sm-9\">";
                html += "            <input value=\"" + title + "\" type=\"text\" class=\"form-control\" id=\"title\" name=\"title\" placeholder=\"标题\">";
                html += "        <\/div>";
                html += "    <\/div>";
                html += "";
                html += "    <div class=\"form-group\">";
                html += "        <label for=\"jq-validation-url\" class=\"col-sm-2 control-label\">图片<\/label>";
                html += "        <div class=\"col-sm-9\">";

                // 默认图片
                html += "";

                if ( ! _src ) {

                    html += "<div style=\"padding-left:11px; display:none; \" id=\"html-image\" class=\"upload_img row form-group\">";
                }
                else
                {
                    html += "<div style=\"padding-left:11px\" id=\"html-image\" class=\"upload_img row form-group\">";
                
                    html += "   <p>";
                    html += "       <img width=\"200px\" height=\"120px\" src=\"" + _src + "\">";
                    html += "       <input type=\"hidden\" name=\"image\" value=\"" + _image + "\">";
                    html += "       <span style=\"display: none;\"><a href=\"javascript:void(0)\">x<\/a><\/span>";
                    html += "<\/p>";
                }

                html += "   <\/div>";

                html += "";

                html += "            <button click=\"\" id=\"image\" class=\"btn\">选择图片<\/button>";
                html += "        <\/div>";
                html += "    <\/div>";
                html += "";
                html += "    <div class=\"form-group\">";
                html += "        <label for=\"intro\" class=\"col-sm-2 control-label\">链接<\/label>";
                html += "        <div class=\"col-sm-9\">";

                html += "           <input value=\"" + _link_title + "\" id=\"link\" readonly type=\"text\" target=\"ms-load-page\" data-size=\"large\" data-callback=\"uri_callback\" href=\"" + _uri_url + "\" data-fa=\"fa-external-link-square\" data-title=\"选择链接\" placeholder=\"点击选择链接\" class=\"form-control\">";

                html += "        <\/div>";
                html += "    <\/div>";
                html += "";
                html += "    <div class=\"panel-footer\">";
                html += "        <small>";
                html += "            <i class=\"fa-1x fa fa-long-arrow-right\"></i> "; 
                html += "        <\/small>";
                html += "        <div class=\"panel-heading-controls\">";
                html +=              _footer_prefix;
                html += "            <button id=\"footer_clear\" class=\"btn btn-warning btn-sm\">清空<\/button>";
                html += "            <button id=\"footer_cancel\"class=\"btn btn-sm\">取消<\/button>";
                html += "            <button id=\"footer_save\" class=\"btn btn-primary btn-sm\">保存<\/button>";
                html += "        <\/div>";
                html += "    <\/div>";
                html += "<\/div>";

            return html;
        },

        create_imgtext : function () {

            // 检测个数
            var count = $("#list-sm a").length;
            if ( count > 9 )
            {
                alert("小图文列部分，不能最多为 9 个");
                return false;
            }

            // 填充 html
            var html = "";
                html += "<a data-type=\"sm\" class=\"content-sm\" href=\"javascript:;\" target=\"_blank\">";
                html += "    <div class=\"media_con_a clear\">";
                html += "        <div class=\"media_tit l\">";
                html += "            <p class=\"left\" data-link-title=\"\" data-link-params=\"\">标题<\/p>";
                html += "        <\/div>";
                html += "        <div class=\"media_icon r\">";
                html += "            <span class=\"default-img-null\">缩略图<\/span>";
                html += "            <img style=\"display:none\" data-image=\"\" width=\"50px\" height=\"30px\" src=\"\">";
                html += "        <\/div>";
                html += "        <div class=\"edit_info\" style=\"display: none;\">";
                html += "            <i class=\"fa fa-pencil\"><\/i>";
                html += "            <i class=\"fa fa-trash-o\"><\/i>";
                html += "        <\/div>";
                html += "    <\/div>";
                html += "<\/a>";

            $("#list-sm").append(html);

            handle_modify();
        }

    }


    $.fn.imgtext.defaults = {
        callback : function () {
        }
    }

   

})(jQuery)


 function showHide(){
            var a = arguments;
            for(var i = 0; i < arguments.length; i++){
               (function(n){
                    $(a[n].name1).mouseover(function(){
                        $(a[n].name2,this).show();
                    });
                    $(a[i].name1).mouseout(function(){
                        $(a[n].name2,this).hide();
                    }); 
               })(i);
            }
        };
        function addClass(){
             var a = arguments;
             for(var i = 0; i < arguments.length; i++){
               (function(n){
                    $(a[n].name1).mouseover(function(){
                        $(this).addClass(a[n].name2);
                    });
                    $(a[i].name1).mouseout(function(){
                        $(this).removeClass(a[n].name2);
                    }); 
               })(i);
            }
        };