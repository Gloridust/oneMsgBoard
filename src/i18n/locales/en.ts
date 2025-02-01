export default {
  common: {
    login: {
      title: "Welcome to oneMsgBoard",
      username: "Username",
      password: "Password",
      submit: "Login",
      register: "Register",
    },
    nav: {
      home: "Home",
      boards: "Boards",
      profile: "Profile",
      admin: "Admin Panel",
    },
    actions: {
      create: "Create",
      edit: "Edit",
      delete: "Delete",
      save: "Save",
      cancel: "Cancel",
    },
    board: {
      create: "Create Board",
      name: "Name",
      description: "Description",
      permissions: "Permissions",
    },
    post: {
      create: "Create Post",
      edit: "Edit Post",
      content: "Content",
      lastEdited: "Last edited at",
    },
    user: {
      profile: {
        nickname: "Nickname",
        gender: "Gender",
        birthday: "Birthday",
        male: "Male",
        female: "Female",
        other: "Other",
      },
    },
  },
} as const; 