export default {
  common: {
    login: {
      title: "欢迎来到一个留言板",
      username: "用户名",
      password: "密码",
      submit: "登录",
      register: "注册",
    },
    nav: {
      home: "首页",
      boards: "留言板",
      profile: "个人资料",
      admin: "管理面板",
    },
    actions: {
      create: "创建",
      edit: "编辑",
      delete: "删除",
      save: "保存",
      cancel: "取消",
    },
    board: {
      create: "创建留言板",
      name: "名称",
      description: "描述",
      permissions: "权限设置",
    },
    post: {
      create: "发布留言",
      edit: "编辑留言",
      content: "内容",
      lastEdited: "最后编辑于",
    },
    user: {
      profile: {
        nickname: "昵称",
        gender: "性别",
        birthday: "生日",
        male: "男",
        female: "女",
        other: "其他",
      },
    },
  },
} as const; 