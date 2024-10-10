import { get, post, loginPost } from '../utils/http'

export const addUsers = (params, method) => post("/user/add?user="+ sessionStorage.getItem("user") +"&token="+sessionStorage.getItem("token"), params, method);
export const delUsers = (params, method) => post("/user/del?user="+ sessionStorage.getItem("user") +"&token="+sessionStorage.getItem("token"), params, method);
export const createPerms = (params, method) => post("/perms/create?user="+ sessionStorage.getItem("user") +"&token="+sessionStorage.getItem("token"), params, method);
export const delPerms = (params, method) => post("/perms/delete?user="+ sessionStorage.getItem("user") +"&token="+sessionStorage.getItem("token"), params, method);
export const login = (params, query, method) => loginPost('/login', params, query, method);
export const gaLogin = (params, query, method) => loginPost('/galogin', params, query, method);
export const logout = (params, query, method) => loginPost('/logout', params, query, method);
export const updateUsers = (params, method) => post("/user/update?user="+ sessionStorage.getItem("user") +"&token="+sessionStorage.getItem("token"), params, method);
export const removePerms = (params, method) => post("/role/rmperms?user="+ sessionStorage.getItem("user") +"&token="+sessionStorage.getItem("token"), params, method);
export const allotPerms = (params, method) => post("/role/allotperms?user="+ sessionStorage.getItem("user") +"&token="+sessionStorage.getItem("token"), params, method);
export const createRole = (params, method) => post("/role/create?user="+ sessionStorage.getItem("user") +"&token="+sessionStorage.getItem("token"), params, method);
export const assetsUpload = (params, method) => post("/assets/upload?user="+ sessionStorage.getItem("user") +"&token="+sessionStorage.getItem("token"), params, method);
export const createProgramUpdateRecord = (params, method) => post("/assets/process/update/create?user="+ sessionStorage.getItem("user") +"&token="+sessionStorage.getItem("token"), params, method);
export const createServer = (params, method) => post("/assets/add?user="+ sessionStorage.getItem("user") +"&token="+sessionStorage.getItem("token"), params, method);
export const editServer = (params, method) => post("/assets/update?user="+ sessionStorage.getItem("user") +"&token="+sessionStorage.getItem("token"), params, method);
export const delServer = (params, method) => post("/assets/del?user="+ sessionStorage.getItem("user") +"&token="+sessionStorage.getItem("token"), params, method);
export const runProgram = (params, method) => post("/assets/api?user="+ sessionStorage.getItem("user") +"&token="+sessionStorage.getItem("token"), params, method);
export const getUserList = (params) => get("/user/list?user="+ sessionStorage.getItem("user") +"&token="+sessionStorage.getItem("token"), params);
export const getRolesName = (params) => get("/role/rolesname?user="+ sessionStorage.getItem("user") +"&token=" + sessionStorage.getItem("token"), params);
export const getUserPerms = (params) => get("/role/userperms?user="+ sessionStorage.getItem("user") +"&token="+ sessionStorage.getItem("token"), params);
export const getPermsList= (params) => get("/perms/list?user="+ sessionStorage.getItem("user") +"&token="+ sessionStorage.getItem("token"), params);
export const getRolesList= (params) => get("/role/list?user="+ sessionStorage.getItem("user") +"&token="+ sessionStorage.getItem("token"), params);
export const getRolePerms= (params) => get("/role/roleperms?user="+ sessionStorage.getItem("user") +"&token="+ sessionStorage.getItem("token"), params);
export const getPermsTree= (params) => get("/role/pmenu?user="+ sessionStorage.getItem("user") +"&token="+ sessionStorage.getItem("token"), params);
export const getUserDetail= (params) => get("/user/getinfobyname?user="+ sessionStorage.getItem("user") +"&token="+ sessionStorage.getItem("token"), params);
export const getOperateLogList= (params) => get("/log/list?user="+ sessionStorage.getItem("user") +"&token="+ sessionStorage.getItem("token"), params);
export const getAssetsList = (params) => get("/assets/list?user=" + sessionStorage.getItem("user") + "&token=" + sessionStorage.getItem("token"), params);
export const getProcessStatus = (params) => get("/assets/process/status?user=" + sessionStorage.getItem("user") + "&token=" + sessionStorage.getItem("token"), params);
export const getUpdateList = (params) => get("/assets/process/update/list?user=" + sessionStorage.getItem("user") + "&token=" + sessionStorage.getItem("token"), params);


