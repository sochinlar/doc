module.exports = {
  port: "3000",
  dest: "docs",
  ga: "UA-85414008-1",
  base: "/",
  head: [["link", { rel: "icon", href: `/favicon.ico` }]],
  plugins: {
    "@vuepress/back-to-top": true,
    "@vuepress/pwa": {
      serviceWorker: true,
      updatePopup: true
    }
  },
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
  },
  serviceWorker: {
    updatePopup: true,
    updatePopup: {
      message: "New content is available.",
      buttonText: "Refresh"
    }
  }
};

function genSidebarConfig(title) {
  return [
    {
      title: "平台使用帮助",
      collapsable: false,
      children: [
        "",
        "registerAndLogin",
        "appManage",
        "deviceManage",
        "secretManage",
        "onlineDebug",
        "accessManage",
        "sdkAccessGuide",
        "httpAccessGuide"
      ]
    }
  ];
}
