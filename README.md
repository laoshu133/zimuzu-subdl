# zimuzu-subdl

[![npm version](https://img.shields.io/npm/v/zimuzu-subdl.svg?style=flat-square)](https://www.npmjs.org/package/zimuzu-subdl)
[![build status](https://img.shields.io/travis/laoshu133/zimuzu-subdl.svg?style=flat-square)](https://travis-ci.org/laoshu133/zimuzu-subdl)

字幕组（人人影视）字幕批量下载工具

## 安装

安装前需要安装 `Node.js`，建议版本为 `6.x`

```
> npm i -g zimizu-subdl
```

## 用法

关键字下载：

```
> zimizu-subdl -k "福尔摩斯 演绎法"
```

字幕组搜索 URL 下载：

```
> zimizu-subdl -u http://www.zimuzu.tv/search?keyword=%E7%A6%8F%E5%B0%94%E6%91%A9%E6%96%AF+%E6%BC%94%E7%BB%8E%E6%B3%95&type=subtitle
```

## 命令行参数

```
-h, --help              output usage information
-V, --version           output the version number
-o, --output [path]     指定输出目录
-k, --key [keyword]     指定关键字下载
-u, --url [search url]  指定搜索URL 下载
```

## License

MIT
