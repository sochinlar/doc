module.exports = {
  port: "3000",
  dest: "docs",
  ga: "UA-85414008-1",
  base: "/docs/",
  locales: {
    "/": {
      lang: "zh-CN",
      title: "Emc-Doc",
      description: "就是文档而已"
    }
  },
  //主题
  themeConfig: {
    nav: require("./nav/zh"),
    sidebar: {
      "/guide/": genSidebarConfig("指南")
    }
  }
};

function genSidebarConfig(title) {
  return [
    {
      title: "快速入门",
      collapsable: false,
      children: []
    },
    {
      title: "核心功能",
      collapsable: false,
      children: []
    },
    {
      title: "真的不知道了",
      collapsable: false,
      children: []
    },
    {
      title: "FAQ",
      collapsable: false,
      children: []
    }
  ];
}
