// add copyright info for post

hexo.extend.filter.register('before_post_render', function(data){
    if(data.layout != 'post') return data;
    if(data.copyright == false) return data;

    if(data.content.length > 50)
    {
        var copyright_msg = '\n------\n\n> **文章作者：** pzxbc\n> **原始链接：** ' + data.permalink + 
        '\n> **许可协议：** [创作共用保留署名-非商业-禁止演绎4.0国际许可证](http://creativecommons.org/licenses/by-nc-nd/4.0/) 转载请保留原文链接及作者\n';
        data.content += copyright_msg;
        // console.log(data.layout, data.source);
    }
    return data;
});

