/**
 * Created by timxuan on 2016/6/17.
 */
'use strict';
const fs = require('fs'),
    UglifyJS = require("uglify-js");

let rStyleScript = /((<!(?:--)?\[[\s\S]*?<\!\[endif\](?:--)?>|<!--[\s\S]*?(?:-->|$))|(?:(\s*<script[^>]*>[^<>]*<\/script>)|(?:\s*(<link([^>]*?)(?:\/)?>)|(<style([^>]*)>([\s\S]*?)<\/style>))))<!--delete-->/ig;

let environment = fis.project.currentMedia();   //获取当前的环境

let class2type = {};

"Boolean Number String Function Array Date RegExp Object Error".split(" ").forEach(function(name){
    class2type[ "[object " + name + "]" ] = name.toLowerCase();
});

function type(val){
    return Object.prototype.toString.call(val);
}

module.exports = (ret, conf, settings, opt) => {
    fis.util.map(ret.src,(subpath,file) => {
        let content = file.getContent();
        if(file.isHtmlLike){
            if(content.match(rStyleScript)){
                content = content.replace(rStyleScript,'');
                file.setContent(content);
            }
        }

        if(file.isHtmlLike || file.isCssLike || file.isJsLike){
            for(let i in settings){
                if(settings.hasOwnProperty(i)) {
                    let key = new RegExp('('+ i + ')' + '\\\(\\\)','g'),
                        obj = settings[i],
                        parameter = obj[environment] || obj.default;

                    if(parameter){
                        if(content.match(key)){
                            let replaceStr = '';
                            switch(class2type[type(parameter)]){
                                case 'function':
                                    let format = UglifyJS.minify("var a = "+parameter, {fromString: true}).code.match(/function\(\){.+}/);
                                    replaceStr = '(' + format + ')()';
                                    break;
                                case 'string':
                                    replaceStr = '\''+obj[environment]+'\'';
                                    break;
                                default:
                                    replaceStr = obj[environment];
                                    break;
                            }
                            if(replaceStr){
                                content = content.replace(key,replaceStr);
                                file.setContent(content);
                            }
                        }
                    }
                }
            }
        }
    });
};

