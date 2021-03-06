var baseUrl = 'http://182.92.161.173:5588/activities/productVote/';

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
            return juicer(ex.template[selector.substr(1)], data);
        } else {
            $(selector).html(juicer($(selector).html(), data));
            return juicer($(selector).html(), data);
        }
    },
    template: {}
};
juicer.register('pageCreat', function (i, page, Maxpage) {
    if (page == i) {
        return '<li class="nowPage">' + i + '</li>';
    } else if (i > 0 && i <= Maxpage && (i > (page - 3)) && (i < (page + 3))) {
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
        if(Config.isWX){
            return '<img src="' + src + '?imageView2/0/w/640"/>';
        }else{
            return '<img src="' + src + '"/>';
        }
    }
});
juicer.register('text', function (text) {
    return text.replace(/ /g, '&nbsp;').replace(/</g, '&lt').replace(/>/g, '&gt').replace(/\n/g, '<br/>');
});

(function(){
    var data;
    if(Config.isWX){
        data = {
            code: ROLE.code
        }
    }else{
        data = null;
    }

    ex.jsonp({
        url: 'http://activity.meizhanggui.cc/weixinAuth2/userInfo?_method=GET',//获取unionid等一系列参数的url
        data: data,
        success: function (obj) {

            if (obj.success) {
                ROLE.unionid = obj.data.unionid;
                ROLE.subscribed = obj.data.subscribed;
                //document.cookie = 'unionid=' + obj.data.unionid + '&subscribed=' + obj.data.subscribed + '&';

                ex.template = {
                    page_list: $('#page_list').html(),
                    page_story: $('#pageStoryTemp').html(),
                    itemList: $('#itemListTemp').html(),
                    pageBox: $('#pageBoxTemp').html()
                };

                $('#pageStoryTemp').remove();
                $('#itemListTemp').remove();
                $('#pageBoxTemp').remove();

                ex.render('.infoBox', {
                    signCount: obj.data.signCount,
                    voteConut: obj.data.voteCount,
                    visitCount: obj.data.visitCount
                });

                $('header').click(function(){
                    location.href = 'http://mp.weixin.qq.com/s?__biz=MzIwMTI1NDI3NQ==&mid=207324146&idx=1&sn=62a4f22fa7278c01bc1603baab8783bc#rd';
                });
                $('h4').click(function(){
                    location.href = 'http://mp.weixin.qq.com/s?__biz=MzIwMTI1NDI3NQ==&mid=207324146&idx=1&sn=62a4f22fa7278c01bc1603baab8783bc#rd';
                });

                page_list.data.Maxpage = Math.ceil(obj.data.signCount / 6);
                page_list.data.Maxpage==0?page_list.data.Maxpage=1:null;

                routie({
                    "story/?:id": function (id) {
                        page_story._id = id;
                        page_story.init();
                    },
                    "story": function () {
                        page_story._id = '';
                        page_story.init();
                    },
                    "list": page_list.init,
                    "sign": page_sign.init
                });

            }
            else {
                layer.msg(obj.msg);
            }
        }
    });

})();

window.addEventListener('load', function () {
    FastClick.attach(document.body);
    if(Config.isWX)WX.init();
}, false);

WX = {
    ready: false,
    timer: null,
    init: function () {
        var wxUrl = encodeURIComponent(location.href.split('#')[0]),
            config = function (appId, timestamp, nonceStr, signature) {
                wx.config({
                    debug: false,
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
                wx.ready(function () {
                    WX.ready = true;
                });
            };
        $.ajax({
            url: "http://182.92.161.173:5588/weixinAuth2?url=" + wxUrl,
            dataType: "jsonp",
            jsonp: "callback", //传递给请求处理程序或页面的，用以获得jsonp回调函数名的参数名(默认为:callback)
            jsonpCallback: "success_jsonpCallback", //自定义的jsonp回调函数名称，默认为jQuery自动生成的随机函数名
            type: "GET",
            async: false,
            beforeSend: function () {
            },
            success: function (obj) {
                var appId = obj.data.appId,
                    timestamp = obj.data.timestamp,
                    nonceStr = obj.data.nonceStr,
                    signature = obj.data.signature;
                config(appId, timestamp, nonceStr, signature);
            }
        });
    },
    set: function (obj) {
        var shareObj = {
            title: obj.title,
            desc: obj.desc,
            link: obj.link,
            imgUrl: obj.imgUrl
        };
        if (WX.ready) {
            wx.onMenuShareTimeline(shareObj);
            wx.onMenuShareAppMessage(shareObj);
            wx.onMenuShareQQ(shareObj);
            wx.onMenuShareWeibo(shareObj);
        }else{
            wx.ready(function(){
                WX.ready = true;
                WX.set(shareObj)
            });
        }
    }
};

var myWindow = {
    open:function(str,link){
        layer.open({
            type: 1,
            title: false,
            closeBtn: false,
            shadeClose: true,
            area: '250px',
            skin: 'tatoo',
            content: '<a href="' + (link?link:null) + '">'+str+'</a>'
        });
    },
    notAttention: function () {
        var link = 'http://mp.weixin.qq.com/s?__biz=MzIwMTI1NDI3NQ==&mid=207445005&idx=1&sn=b1806776c747dfd039f56799036bc056#rd';
        this.open('要给他投票<br>关注微信公众平台哦',link);
        setTimeout(function(){
            location.href = 'http://mp.weixin.qq.com/s?__biz=MzIwMTI1NDI3NQ==&mid=207445005&idx=1&sn=b1806776c747dfd039f56799036bc056#rd';
        },2000);
    },
    uploadSuccess: function (id) {
        this.open('恭喜报名成功<br><br>快让好友来投票吧');
        location.hash = '#story/' + id;
        $('#share').show();
        setTimeout(function(){
            $('#share').hide();
        },5000);
    },
    voteSuccess: function () {
        this.open('投票成功!<br><br>不如点击参与活动<br>一块儿来玩呀');
    },
    notInWX:function(){
        this.open('在微信客户端内打开<br>才能参与活动哦');
    }
};

var footer = {
    selected: null,
    storyId: null,
    tab: function (target) {
        this.selected = target;
        $('footer>a').removeClass('selected');
        $('.icon.' + target).parent().addClass('selected');
        window.scrollTo(0,0);
    }
};

var page_list = {
    data: {

        page: 3,
        Maxpage: 10,
        list: []

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
        if(!Config.isWX) return myWindow.notInWX();
        if (!ROLE.subscribed)return myWindow.notAttention();
        ex.jsonp({
            url: baseUrl + "vote/?_method=GET",
            data: {
                productId: page_list.list[index]._id,
                openId: ROLE.unionid
            },
            success: function (obj) {

                if (obj.success) {
                    myWindow.voteSuccess();
                    page_list.list[index].vote++;
                    page_list.toPage(page_list.data.page);
                } else {
                    layer.msg(obj.msg);
                }
            }
        }, this);
    },
    toPage: function (page) {
        this.data.page = page;
        var url = this.tab == 'time' ? "getCreateTimeList" : "getVoteNumList";
        ex.jsonp({
            url: baseUrl + url + "/?_method=GET",
            data: {
                limit: 6,
                index: (this.data.page - 1) * 6
            },
            success: function (obj) {

                if (obj.success) {
                    page_list.list = obj.data;
                    ex.render('#itemList', {list: page_list.list});
                    ex.render('#pageBox', page_list.data);
                    pbl.Set();
                    $('#itemList li img').each(function (index) {
                        $(this).click((function (index) {
                            return function () {
                                location.hash = "#story/" + page_list.list[index]._id;
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
                    });
                    window.scrollTo(0,300);

                } else {
                    layer.msg(obj.msg);
                }
            }
        }, this);
    },
    init: function () {

        $('.page').hide();
        $('#page_list').show();
        $('.infoBox').show();
        $('#loading').hide();

        $('#page_list .tab div:eq(0)').click(function () {
            page_list.e$changeTab('time')
        });
        $('#page_list .tab div:eq(1)').click(function () {
            page_list.e$changeTab('rank')
        });

        footer.tab('list');

        $('#page_list .btn:eq(0)').click(function () {
            location.hash = '#sign';
        });
        $('#page_list .btn:eq(1)').click(function () {
            location.href = 'http://www.wenshendaka.com';
        });

        page_list.e$changeTab('time');
        setTimeout(function () {
            page_list.toPage(1);
        }, 0);
    }
};

var page_story = {
    _id: null,
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
        if(!Config.isWX) return myWindow.notInWX();
        if (!ROLE.subscribed)return myWindow.notAttention();
        ex.jsonp({
            url: baseUrl + "vote/?_method=GET",
            data: {
                productId: page_story._id,
                openId: ROLE.unionid
            },
            success: function (obj) {

                if (obj.success) {
                    myWindow.voteSuccess();
                    page_story.data.vote++;
                    $('#page_story .vote').text('票数：' + page_story.data.vote);
                } else {
                    layer.msg(obj.msg);
                }

            }
        }, this);
    },
    init: function () {
        if (page_story._id == '')return location.hash = "#list";
        ex.jsonp({
            url: baseUrl + "getProductDetails?_method=GET",
            data: {
                productId: page_story._id
            },
            success: function (obj) {
                if (obj.success) {
                    page_story.data = {
                        index: obj.data.productNumber,
                        name: obj.data.authorName,
                        vote: obj.data.voteNum,
                        rank: obj.data.index,
                        x: obj.data.previousVoteNum==-1?'榜首':('距上一名还差'+(obj.data.previousVoteNum - obj.data.voteNum)+'票'),
                        img: obj.data.images[0],
                        desc: obj.data.content
                    };
                    ex.render('#page_story', page_story.data);
                    $('footer a:eq(0)').attr('href','#story'+page_story._id);

                    WX.set({
                        title: obj.data.authorName + "的纹身故事",
                        link: location.origin + location.pathname + '#story/' + page_story._id,
                        imgUrl: obj.data.images[0],
                        desc: '快来给我投票吧！'
                    });

                    $('.page').hide();
                    $('#page_story').show();
                    footer.tab('story');
                    $('.infoBox').hide();
                    $('#loading').hide();

                    $('#page_story .btn.hot').click(page_story.e$vote);
                    $('#page_story .btn:eq(1)').click(function () {
                        location.hash = '#sign';
                    });
                    $('#page_story .btn:eq(2)').click(function () {
                        location.hash = '#list';
                    });
                    $('#page_story .btn:eq(3)').click(function () {
                        location.href = 'http://www.wenshendaka.com';
                    });
                    $('#close').click(function () {
                        location.hash = '#list';
                    });
                }
                else {
                    layer.msg(obj.msg);
                    location.hash = "#list";
                }
            }
        });
    }
};

var page_sign = {
    nickname: '',
    phonenum: '',
    img: null,
    desc: '',
    render: false,
    sign: false,
    e$uploadImg: function () {
        wx.chooseImage({
            count: 1,
            success: function (res) {
                var localId = res.localIds[0];

                $('#upload').css({
                    "background-image": 'url("' + localId + '")',
                    "background-size": 'cover'
                });

                wx.uploadImage({
                    localId: localId, // 需要上传的图片的本地ID，由chooseImage接口获得
                    isShowProgressTips: 1, // 默认为1，显示进度提示
                    success: function (res) {
                        var serverId = res.serverId; // 返回图片的服务器端ID
                        page_sign.img = serverId;
                    }
                });
            }
        })
    },
    e$uploadProduct: function () {
        page_sign.nickname = $('#name').val();
        page_sign.phonenum = $('#phonenum').val();
        page_sign.desc = $('#desc').val();
        if (page_sign.phonenum.length < 11)return layer.msg("输入正确的手机号");
        if (page_sign.nickname.length < 1)return layer.msg("输入正确的昵称");
        if (page_sign.phonenum.desc < 1)return layer.msg("输入文字内容");
        if (page_sign.img == null)return layer.msg("请上传图片");
        ex.jsonp({
            url: baseUrl + "upload/?_method=GET",
            data: {
                authorName: page_sign.nickname,
                images: "[\"" + page_sign.img + "\"]",
                content: page_sign.desc,
                openId: ROLE.unionid,
                phoneNum: page_sign.phonenum
            },
            success: function (obj) {
                if (obj.success) {
                    page_sign.sign = true;
                    myWindow.uploadSuccess(obj.data._id);
                } else {
                    layer.msg(obj.msg);
                }
            }
        })
    },
    init: function () {

        if(!Config.isWX) {
            myWindow.notInWX();
            return location.hash = '#story';
        }

        if (page_sign.sign) {
            layer.msg('您已经报过名了');
            return location.hash = '#list';
        }

        $('.page').hide();
        $('#page_sign').show();
        footer.tab('sign');
        $('.infoBox').show();
        $('#loading').hide();

        if (!page_sign.render) {
            page_sign.render = true;
            setTimeout(function () {
                $('#upload').click(page_sign.e$uploadImg);
                $('#page_sign .btn').click(page_sign.e$uploadProduct);
            }, 0);
        }
        WX.set({
            title: "你敢晒，我敢奖，晒出你的纹身故事",
            link: location.origin + location.pathname + '#sign',
            imgUrl: 'http://m.wenshendaka.com/activities/story/imgs/banner.jpg',
            desc: '快来报名吧！'
        });
    }
};

//瀑布流
window.pbl = {
    cal: function (str) {
        var w = Config.isMobile?$(window).width():640;
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