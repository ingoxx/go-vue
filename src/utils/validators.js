// assets.vue
export function validatePath(rule, value, callback) {
    if (!value) {
        callback(new Error('请求路径不能为空'));
    } else {
        callback();
    }
}
  
export function validateCmd(rule, value, callback) {
    if (!value) {
        callback(new Error('linux命令不能为空'));
    } else {
        const regex = /^\s*(rm|mv|chmod|chown|su|sudo|useradd|userdel|groupadd| )\b/;
        if (regex.test(value)) {
        callback(new Error('输入的bash命令不合法'));
        }
        callback();
    }
}
export function  validateproject (rule, value, callback)  {
    if (!value) {
        callback(new Error('请输入项目'));
    } else {
        callback();
    }
};
export function  validateip (rule, value, callback)  {
    if (!value) {
        callback(new Error('请输入ip'));
    }
    const regex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    if (!regex.test(value)) {
        callback(new Error('ip格式错误'));
    }  else {
        callback();
    }
};
export function  validateuser (rule, value, callback)  {
    if (!value) {
        callback(new Error('请输入用户名'));
    } else {
        callback();
    }
};
// new
export function  validateOpCNName (rule, value, callback)  {
    if (!value) {
        callback(new Error('操作中文名不能为空'));
    } else {
        callback();
    }
};
export function validateOpENName (rule, value, callback)  {
    if (!value) {
        callback(new Error('操作英文名不能为空'));
    } else {
        callback();
    }
};

// user.vue
export function validatename (rule, value, callback) {
    if (!value) {
        callback(new Error('请输入用户名'));
    } else {
        callback();
    }
};
export function validatetel (rule, value, callback) {
    if (!value) {
        callback(new Error('电话不能为空'));
    } else if (value.length < 6 ) {
        callback(new Error('电话长度需要大于7')); 
    } else {
        callback();
    }
};
export function validaterole (rule, value, callback) {
    if (!value) {
        callback(new Error('用户组不能为空'));
    } else {
        callback();
    }
};
export function validateemail (rule, value, callback) {
    if (!value) {
        callback(new Error('邮箱不能为空'));
        return
    }
    var emailRegExp=/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
    var ok=emailRegExp.test(value);
    if (!ok) {
        callback(new Error('邮箱格式错误'));
    } else {
        callback();
    }
};
export function validatepass (rule, value, callback) {
    if (!value) {
        callback(new Error('密码不能为空'));

    } else if (value.length < 6 ) {
        callback(new Error('密码长度需要大于5'));
    } else {
        callback();
    }
};

export function validateupass (rule, value, callback) {
   if (value) {
        if(value.length < 6 ) {
        callback(new Error('密码长度需要大于7'));
        } else {
            callback();
        }
   } else {
        callback();
   }
};