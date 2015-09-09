var g$url = {
    param:{},
    getParam:function(){
        g$url.param = {};
        var str = '';
        var args = location.search.substr(1).split("&");

        for (var i = 0; i < args.length; i++) {
            str = args[i];
            var arg = str.split("=");
            if (arg.length <= 0) continue;
            if (arg.length == 1) g$url.param[arg[0]] = true;
            else g$url.param[arg[0]] = arg[1];
        }

        //test.alert(g$url.param);

        if(location.hash)g$url.param.hash = location.hash.substr(1);
        return g$url.param;
    },
    getWxAuth:function(){
        //alert("getWxAuth");
        var REURI = encodeURIComponent(location.origin + location.pathname),
            STATE = g$url.param.hash||"false";
        return location.href = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxf72ed77c92113ec4&redirect_uri="+REURI+"&response_type=code&scope=snsapi_userinfo&state="+STATE+"#wechat_redirect"
    },
    checkUrl:function(){
        var state = g$url.param.state;
        //alert("checkUrl-state:" + state);
        if(state!="true"){
            //alert("checkCode:"+g$url.param.code);
            document.cookie = "code="+ (g$url.param.code||null) +"&";
            //alert("cookie:"+document.cookie);
            if(state=="false"){
                //alert("state==false");
                location.href = location.origin + location.pathname + '?state=true#list'
            }else{
                //alert("state:"+state);
                location.href = location.origin + location.pathname + '?state=true#' + state;
            }
        }else{
            var code = document.cookie.match(/code=([^\b&]*)/);
            //alert("checkUrl-cookieGet-code:" + code);
            if(code){
                code = code[1];
                ROLE.code=code;
                ROLE.isAuth=true;
                document.cookie = "code=&";
                alert(ROLE.code);
            }else{
                g$url.getWxAuth();
            }
        }
    }
};

var ROLE = {
    isAuth:false,
    code:'',
    openId:'',
    subscribe:0
};

//alert(location.href);
if(!g$url.getParam().state){
    g$url.getWxAuth();
}else{
    g$url.checkUrl();
}