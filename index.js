#!/usr/bin/env node

/**
 * zimuzu-subdl
 *
 * @author xiaomi
 */

const fs = require('fs');
const URL = require('url');
const axios = require('axios');
const chalk = require('chalk');
const Promise = require('bluebird');
const program = require('commander');
const writeFile = Promise.promisify(fs.writeFile);

const log = function(type, msg, ...args) {
    let log = console.log;
    let color;

    if(type === 'error') {
        log = console.error;
        color = chalk.red;
    }
    else if(type === 'warn') {
        color = chalk.yellow;
    }
    else if(type === 'success') {
        color = chalk.green;
    }

    msg = '  ' + msg;

    if(color) {
        msg = color(msg);
    }

    return log(msg, ...args);
};

program
    .version(require('./package.json').version)
    .option('-k, --key [keyword]', '指定关键字下载')
    .option('-u, --url [search url]', '指定搜索URL 下载')
    .parse(process.argv);

if(!process.argv.slice(2).length) {
    program.outputHelp();
}

let emptyUrl = 'http://www.zimuzu.tv/search?type=subtitle&keyword=';
let url = URL.parse(emptyUrl, true);

let key = program.key;
if(!key && program.url) {
    key = URL.parse(program.url, true).query.key;
}

if(!key) {
    log('error', '参数错误，请指定 -k 或者 -u 参数');
    console.log('');

    process.exit(1);
}

// url props
delete url.href;
delete url.path;
delete url.search;
url.query.keyword = key;

log('info', '加载中...');

Promise.try(() => {
    return axios.get(url.format());
})
.then(res => {
    const rUrl = /<a\s+href="([^"]+)"><strong\s+class="list_title">/ig;

    let urls = [];
    let content = res.data || '';

    while(rUrl.test(content)) {
        urls.push(RegExp.$1);
    }

    if(!urls.length) {
        log('warn', '未发现可下载字幕');
    }

    log('info', '共发现 ' + chalk.green('%d') + ' 个字幕', urls.length);

    return urls;
})
.map(path => {
    let subUrl = URL.format({
        protocol: url.protocol,
        host: url.host,
        pathname: path
    });

    return axios.get(subUrl);
})
.map((res, idx) => {
    const rUrl = /<div\s+class="subtitle-links[^"]*">[\s\S]*?<a\s+href="([^"]+)"[^>]+>([^<]+)/;

    log('info', '正在解析第 %d 个字幕', idx + 1);

    if(rUrl.test(res.data)) {
        let subUrl = RegExp.$1;
        let name = RegExp.$2;

        return axios.get({
            url: subUrl,
            responseType: 'blob'
        })
        .then(res => {
            return {
                name: name,
                buffer: res.data
            };
        });
    }

    return null;
})
.map((data, idx) => {
    if(!data) {
        log('error', '第 %d 个字幕下载失败', idx + 1);

        return null;
    }

    log('info', '正在写入第 %d 个字幕', idx + 1);

    return writeFile(data.name, data.buffer)
        .return(data);
})
.then(subs => {
    let errSubs = subs.filter(sub => {
        return !!sub;
    });

    let msg = '操作完成，共下载了 %d 个字幕';
    if(errSubs.length) {
        msg += '，其中 %d 个下载失败';
    }

    if(!errSubs.length) {
        log('success', msg, subs.length);
    }
    else {
        log('warn', msg, subs.length, errSubs.length);
    }
})
.catch(err => {
    log('error', '下载失败：');
    log('error', '%s', err.stack);
});
