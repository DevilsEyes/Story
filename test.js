window.test={
    alert:function(obj){
        if(typeof(obj)=='object'){
            var str='testAlert:\n|\n';
            for (var i in obj) {

                if(typeof obj[i] == 'function'){
                    str += '  ' + i + ':isFunction;';
                }
                else{
                    str += '  ' + i + ': ' + obj[i] + '; ';
                }

                if (typeof obj[i] == 'object') {

                    str += '{';
                    for (var j in obj[i]) {

                        if(typeof obj[i][j] == 'function'){
                            str += '  ' + j + ':isFunction;';
                        }
                        else{
                            str += '  ' + j + ': ' + obj[i][j] + '; ';
                        }

                        if (typeof obj[i][j] == 'object') {
                            str += '{';

                            for (var k in obj[i][j]) {
                                if(typeof obj[i][j][k] == 'function'){
                                    str += '  ' + k + ':isFunction;';
                                }
                                else{
                                    str += '  ' + k + ': ' + obj[i][j][k] + '; ';
                                }
                            }
                            str += '}';
                        }
                    }
                    str += '}';
                }
            }
            alert(str);
        }else{
            alert(obj);
        }
    }
};


var ROLE = {
    isAuth:true,
    code:'',
    unionid:'asd8y9812jdiaosijd',
    subscribe:false
};