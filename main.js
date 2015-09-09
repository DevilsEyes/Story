var baseUrl = 'http://182.92.161.173:5588/activities/productVote/';

var ROLE = {
    isAuth: false,
    code: '',
    openId: '',
    subscribe: 0
};

juicer.register('pageCreat', function (i, page, Maxpage) {
    if (page == i) {
        return '<li class="nowPage">' + i + '</li>';
    } else if (i > 0 && i < Maxpage && i > page - 3 && i < page + 3) {
        return '<li class="normalPage">' + i + '</li>';
    } else {
        return '';
    }
});
juicer.register('imgCreat', function (src, cla, type) {
    if (cla) {
        return '<img class="' + cla + '" src="' + src + '?imageView2/0/w/640"/>';
    } else if (type == 'pbl') {
        var img = pbl.cal(src);
        return "<img src='" + img.url + "' width=" + img.w + " height=" + img.h + "/>"
    } else {
        return '<img src="' + src + '"/>';
    }
});
juicer.register('text', function (text) {
    return text.replace(/ /g, '&nbsp;').replace(/</g, '&lt').replace(/>/g, '&gt').replace(/\n/g, '<br/>');
});

window.addEventListener('load', function () {
    FastClick.attach(document.body);

    ex.template = {
        page_list: $('#page_list').html(),
        page_story: $('#page_story').html(),
        itemList: $('#itemListTemp').html(),
        pageBox: $('#pageBoxTemp').html()
    };

    routie({
        "story/?:id": function (id) {
            page_story.id = id;
            page_story.init();
        },
        "story": function () {
            page_story.id = '';
            page_story.init();
        },
        "list": page_list.init,
        "sign": page_sign.init
    });

    ex.render('.infoBox', {
        signCount: 10,
        voteConut: 20,
        visitCount: 30
    });

    WX.init();

}, false);

var WX = {
    init: function () {
        var wxUrl = encodeURIComponent(location.href.split('#')[0]),
            config = function (appId, timestamp, nonceStr, signature) {
                wx.config({
                    debug: true,
                    appId: appId,
                    timestamp: timestamp,
                    nonceStr: nonceStr,
                    signature: signature,
                    jsApiList: [
                        'onMenuShareTimeline',
                        'onMenuShareAppMessage',
                        'onMenuShareQQ',
                        'onMenuShareWeibo',
                        'chooseImage',
                        'uploadImage'
                    ]
                });
            };
        $.ajax({
            url: "http://182.92.161.173:5588/weixinAuth?url=" + wxUrl,
            dataType: "jsonp",
            jsonp: "callback", //传递给请求处理程序或页面的，用以获得jsonp回调函数名的参数名(默认为:callback)
            jsonpCallback: "success_jsonpCallback", //自定义的jsonp回调函数名称，默认为jQuery自动生成的随机函数名
            type: "GET",
            async: false,
            beforeSend: function () {
            },
            success: function (obj) {
                console.dir(obj);
                var appId = obj.data.appId,
                    timestamp = obj.data.timestamp,
                    nonceStr = obj.data.nonceStr,
                    signature = obj.data.signature;
                config(appId, timestamp, nonceStr, signature);
            }
        });
    },
    set: function () {

    }
};

var ex = {
    jsonp: function (obj, pageObj) {
        $.jsonp({
            url: obj.url,
            callbackParameter: obj.callbackParameter ? obj.callbackParameter : "callback",
            data: obj.data ? obj.data : null,
            success: obj.success,
            error: obj.error ? obj.error : function () {
                layer.msg('您的网络连接不太顺畅哦!');
            },
            beforeSend: obj.beforeSend ? obj.beforeSend : function () {
                $('#loading').show();
                pageObj ? pageObj.isClick = true : null;
            },
            complete: obj.complete ? obj.complete : function () {
                $('#loading').hide();
                pageObj ? pageObj.isClick = false : null;
            }
        })
    },
    render: function (selector, data) {
        if (ex.template[selector.substr(1)]) {
            $(selector).html(juicer(ex.template[selector.substr(1)], data));
        } else {
            $(selector).html(juicer($(selector).html(), data));
        }
    },
    template: {}
};

var myWindow = {
    notAttention: function () {
        var link = 'http://mp.weixin.qq.com/s?__biz=MzIwMTI1NDI3NQ==&mid=207445005&idx=1&sn=b1806776c747dfd039f56799036bc056#rd';
        layer.open({
            type: 1,
            title: false,
            closeBtn: false,
            shadeClose: true,
            skin: 'tatoo',
            content: '<a href="' + link + '">未关注公众号，没有投票权限。</a>'
        });
    },
    uploadSuccess: function () {
        layer.open({
            type: 1,
            title: false,
            closeBtn: false,
            shadeClose: true,
            skin: 'tatoo',
            content: '上传成功！'
        });
    },
    voteSuccess: function () {
        layer.open({
            type: 1,
            title: false,
            closeBtn: false,
            shadeClose: true,
            skin: 'tatoo',
            content: '上传成功！'
        });
    }

};

var footer = {
    selected: null,
    storyId: null,
    tab: function (target) {
        this.selected = target;
        $('footer>a').removeClass('selected');
        $('.icon.' + target).parent().addClass('selected');
        window.scrollTo(0, 0);
    }
};

var page_list = {
    data: {

        page: 3,
        Maxpage: 10,

        list: [
            {
                index: 228,
                img: "http://img.meizhanggui.cc/ba0fbe650e06ec9465e3958b87ca74ae_W_460X640",
                name: '阿斯房',
                vote: 39
            },
            {
                index: 228,
                img: "http://img.meizhanggui.cc/093d5b74cbdc8e759c9ad6565cd5ec9d_W_1500X1029",
                name: '阿斯房',
                vote: 39
            },
            {
                index: 228,
                img: "http://img.meizhanggui.cc/093d5b74cbdc8e759c9ad6565cd5ec9d_W_1500X1029",
                name: '阿斯房',
                vote: 39
            },
            {
                index: 228,
                img: "http://img.meizhanggui.cc/093d5b74cbdc8e759c9ad6565cd5ec9d_W_1500X1029",
                name: '阿斯房',
                vote: 39
            },
            {
                index: 228,
                img: "http://img.meizhanggui.cc/093d5b74cbdc8e759c9ad6565cd5ec9d_W_1500X1029",
                name: '阿斯房',
                vote: 39
            },
            {
                index: 228,
                img: "http://img.meizhanggui.cc/093d5b74cbdc8e759c9ad6565cd5ec9d_W_1500X1029",
                name: '阿斯房',
                vote: 39
            }
        ]
    },
    tab: 'time',
    e$changeTab: function (tab) {
        if (tab != this.tab) {
            this.tab = tab;
            $('.tab>div').removeClass('selected');
            if (tab == 'time') {
                $('.tab>div:eq(0)').addClass('selected');
            } else {
                $('.tab>div:eq(1)').addClass('selected');
            }
            page_list.toPage(1);
        }
    },
    e$page: function (i) {
        if (i == '<')i = +this.data.page - 1;
        else if (i == '>')i = +this.data.page + 1;
        else i = +i;
        this.toPage(i)
    },
    e$vote: function (index) {
        alert(index);
        if (ROLE.subscribe == 0) {
            myWindow.notAttention();
            return;
        }
        ex.jsonp({
            url: baseUrl + "vote/?_method=GET",
            data: {
                id: page_list.list[index].id
            },
            success: function (obj) {

                if (obj.code == 0) {
                    layer.msg("投票成功!");
                    page_list.list[index].vote++;
                    page_list.toPage(page_list.data.page);
                } else {
                    layer.msg(obj.msg);
                }
            }
        }, this);
    },
    toPage: function (page) {

        var url = this.tab == 'time' ? "getCreateTimeList" : "getVoteNumList";
        ex.jsonp({
            url: baseUrl + url + "/?_method=GET",
            data: {
                limit: 6,
                index: (this.data.page - 1) * 6
            },
            success: function (obj) {
                //
                console.dir(obj);
                if (obj.success) {
                    page_list.list = obj.data;
                    ex.render('#itemList', page_list.data);
                    ex.render('#pageBox', page_list.data);
                    pbl.Set();
                    $('#itemList li img').each(function (index) {
                        $(this).click((function (index) {
                            return function () {
                                location.hash = "#story/" + page_list.list[index].id;
                            }
                        })(index))
                    });
                    $('#itemList li .votebtn').each(function (index) {
                        $(this).click((function (index) {
                            return function () {
                                page_list.e$vote(index);
                            }
                        })(index))
                    });
                    $('#pageBox li').each(function () {
                        $(this).click(function () {
                            page_list.e$page($(this).text());
                        })
                    })
                } else {
                    layer.msg(obj.msg);
                }
            }
        }, this);
    },
    init: function () {

        footer.tab('list');
        $('.page').hide();
        $('#page_list').show();
        $('.infoBox').show();
        $('#loading').hide();

        ex.render('#page_list', page_list.data);

        $('#page_list .tab div:eq(0)').click(function () {
            page_list.e$changeTab('time')
        });
        $('#page_list .tab div:eq(1)').click(function () {
            page_list.e$changeTab('rank')
        });

        page_list.e$changeTab('time');
        page_list.toPage(1);
    }
};

var page_story = {
    id: null,
    data: {
        index: 120,
        name: '呵呵哒',
        vote: 279,
        rank: 99,
        x: 50,
        img: "http://img.meizhanggui.cc/093d5b74cbdc8e759c9ad6565cd5ec9d_W_1500X1029",
        desc: "这是一串长长的文字。里面有\n换行，还有不少 空  格"
    },
    e$vote: function () {
    },
    init: function () {
        //ex.render('#page_story',page_story.data);
        if (this.data.id == '')location.hash = "#list";

        $('.page').hide();
        $('#page_story').show();
        ex.render('#page_story', page_story.data);
        footer.tab('story');
        $('.infoBox').hide();
        $('#loading').hide();

        $('#page_story .btn:eq(0)').click(this.e$vote);
        $('#page_story .btn:eq(1)').click(function () {
            location.hash = '#sign';
        });
        $('#page_story .btn:eq(2)').click(function () {
            location.hash = '#list';
        });
        $('#page_story .btn:eq(3)').click(function () {
            location.href = 'http://www.wenshendaka.com';
        });
    }
};

var page_sign = {
    nickname: '',
    phonenum: '',
    img: null,
    desc: '',
    e$uploadImg: function () {
        wx.chooseImage({
            count: 1,
            success: function (res) {
                var localId = res.localIds[0];

                wx.uploadImage({
                    localId: localId, // 需要上传的图片的本地ID，由chooseImage接口获得
                    isShowProgressTips: 1, // 默认为1，显示进度提示
                    success: function (res) {
                        if (test)test.alert(res);
                        var serverId = res.serverId; // 返回图片的服务器端ID
                        page_sign.img = serverId;
                        layer.open({
                            type: 1,
                            title: false,
                            closeBtn: false,
                            shadeClose: true,
                            skin: 'tatoo',
                            content: "<img src='" + localId + "'>"
                        });
                        $('#upload').css({
                            "background-image": 'url("' + localId + '")',
                            "background-size": 'cover'
                        })
                    }
                });
            }
        })
    },
    e$uploadProduct: function () {
        this.nickname = $('#name').val();
        this.phonenum = $('#phonenum').val();
        this.desc = $('#desc').val();
        if (this.phonenum && this.phonenum.length < 11)return layer.msg("输入正确的手机号");
        if (this.nickname && this.nickname.length < 1)return layer.msg("输入正确的昵称");
        if (this.desc && this.phonenum.desc < 15)return layer.msg("输入文字内容");
        if (this.img)return layer.msg("请上传图片");
        ex.jsonp({
            url: baseUrl + "upload/?_method=GET",
            data: {
                authorName: this.nickname,
                images: [this.img],
                content: this.desc,
                openId: ROLE.openId,
                phonenum: this.phonenum
            },
            success: function (obj) {
                //
                if (obj.code == 0) {

                }
            }
        })
    },
    init: function () {

        $('.page').hide();
        $('#page_sign').show();
        footer.tab('sign');
        $('.infoBox').show();
        $('#loading').hide();

        setTimeout(function () {
            $('#upload').click(page_sign.e$uploadImg);
            $('#page_sign .btn').click(page_sign.e$uploadProduct);
        }, 0);

    }
};

//瀑布流
window.pbl = {
    cal: function (str) {
        var w = $(window).width();
        var width = (w - 45) / 2;

        if (!str) {
            return {w: width};
        } else {
            var t = str.split('_W_')[1];
            if (t) {
                var wO = t.split('X')[0];
                var hO = t.split('X')[1];
                return {w: width, h: hO / wO * width, url: str + '?imageView2/0/w/320'}
            }
            else {
                return {w: width, h: width, url: str + '?imageView2/1/w/320/h/320'}
            }

        }
    },
    Set: function () {

        pbl.ex = $('#itemList li').wookmark({
            container: $('#itemList'),
            offset: 10,
            outerOffset: 15,
            itemWidth: pbl.cal().w,
            flexibleWidth: pbl.cal().w,
            align: 'left'
        });
        setTimeout(function () {
            $('#itemList li').css('opacity', 1);
        }, 300);

        var imgLoad = imagesLoaded('#itemList');
        imgLoad.on('progress', function (instance, image) {
            $(image.img).css('opacity', 1);
        });
    }
};