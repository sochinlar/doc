module.exports = {
  port: "3000",
  dest: "docs",
  ga: "UA-85414008-1",
  base: "/doc/",
  head: [["link", { rel: "icon", href: `/favicon.ico` }]],
  locales: {
    "/": {
      lang: "zh-CN",
      title: "LanTrue",
      description: "物联网平台"
    }
  },
  //主题
  themeConfig: {
    lastUpdated: "上次更新时间",
    nav: require("./nav/zh"),
    sidebar: {
      "/guide/": genSidebarConfig("指南")
    }
  }
};

function genSidebarConfig(title) {
  return [
    {
      title: "平台使用帮助",
      collapsable: false,
      children: ["", "registerAndLogin"]
    }
  ];
}
