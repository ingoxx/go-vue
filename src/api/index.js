import { get, post, loginPost } from '../utils/http'

// post
export const addUsers = (params, method) => post("/user/add?user="+ sessionStorage.getItem("user") +"&token="+sessionStorage.getItem("token"), params, method);
export const delUsers = (params, method) => post("/user/del?user="+ sessionStorage.getItem("user") +"&token="+sessionStorage.getItem("token"), params, method);
export const createPerms = (params, method) => post("/perms/create?user="+ sessionStorage.getItem("user") +"&token="+sessionStorage.getItem("token"), params, method);
export const delPerms = (params, method) => post("/perms/delete?user="+ sessionStorage.getItem("user") +"&token="+sessionStorage.getItem("token"), params, method);
export const delRoles = (params, method) => post("/role/delete?user="+ sessionStorage.getItem("user") +"&token="+sessionStorage.getItem("token"), params, method);
export const login = (params, query, method) => loginPost('/login', params, query, method);
export const gaLogin = (params, query, method) => loginPost('/galogin', params, query, method);
export const logout = (params, query, method) => loginPost('/logout', params, query, method);
export const updateUsers = (params, method) => post("/user/update?user="+ sessionStorage.getItem("user") +"&token="+sessionStorage.getItem("token"), params, method);
export const removePerms = (params, method) => post("/role/rmperms?user="+ sessionStorage.getItem("user") +"&token="+sessionStorage.getItem("token"), params, method);
export const allotPerms = (params, method) => post("/role/allotperms?user="+ sessionStorage.getItem("user") +"&token="+sessionStorage.getItem("token"), params, method);
export const createRole = (params, method) => post("/role/create?user="+ sessionStorage.getItem("user") +"&token="+sessionStorage.getItem("token"), params, method);
export const assetsUpload = (params, method) => post("/assets/upload?user="+ sessionStorage.getItem("user") +"&token="+sessionStorage.getItem("token"), params, method);
export const createProgramUpdateRecord = (params, method) => post("/assets/program/update/create?user="+ sessionStorage.getItem("user") +"&token="+sessionStorage.getItem("token"), params, method);
export const createServer = (params, method) => post("/assets/add?user="+ sessionStorage.getItem("user") +"&token="+sessionStorage.getItem("token"), params, method);
export const editServer = (params, method) => post("/assets/update?user="+ sessionStorage.getItem("user") +"&token="+sessionStorage.getItem("token"), params, method);
export const delServer = (params, method) => post("/assets/del?user="+ sessionStorage.getItem("user") +"&token="+sessionStorage.getItem("token"), params, method);
export const runProgram = (params, method) => post("/assets/api?user="+ sessionStorage.getItem("user") +"&token="+sessionStorage.getItem("token"), params, method);
export const ProgramAdd = (params, method) => post("/assets/program/add?user="+ sessionStorage.getItem("user") +"&token="+sessionStorage.getItem("token"), params, method);
export const userUpdatePwd = (params, method) => post("/user/update-pwd?user="+ sessionStorage.getItem("user") +"&token="+sessionStorage.getItem("token"), params, method);
export const createCluster = (params, method) => post("/cluster/add?user="+ sessionStorage.getItem("user") +"&token="+sessionStorage.getItem("token"), params, method);
export const delCluster = (params, method) => post("/cluster/del?user="+ sessionStorage.getItem("user") +"&token="+sessionStorage.getItem("token"), params, method);
export const joinWorkCluster = (params, method) => post("/cluster/join-work?user="+ sessionStorage.getItem("user") +"&token="+sessionStorage.getItem("token"), params, method);
export const joinMasterCluster = (params, method) => post("/cluster/join-master?user="+ sessionStorage.getItem("user") +"&token="+sessionStorage.getItem("token"), params, method);
export const leaveCluster = (params, method) => post("/cluster/leave-cluster?user="+ sessionStorage.getItem("user") +"&token="+sessionStorage.getItem("token"), params, method);
export const updateCluster = (params, method) => post("/cluster/update?user="+ sessionStorage.getItem("user") +"&token="+sessionStorage.getItem("token"), params, method);
export const startHealthCheck = (params, method) => post("/cluster/health-check?user="+ sessionStorage.getItem("user") +"&token="+sessionStorage.getItem("token"), params, method);
// get
export const getProgramList = (params) => get("/assets/program/list?user="+ sessionStorage.getItem("user") +"&token="+sessionStorage.getItem("token"), params);
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
export const getProcessStatus = (params) => get("/assets/program/status?user=" + sessionStorage.getItem("user") + "&token=" + sessionStorage.getItem("token"), params);
export const getUpdateList = (params) => get("/assets/program/update/list?user=" + sessionStorage.getItem("user") + "&token=" + sessionStorage.getItem("token"), params);
export const getLoginNum = (params) => get("/log/get-login-num?user="+ sessionStorage.getItem("user") +"&token="+ sessionStorage.getItem("token"), params);
export const getRunLinuxCmdNum = (params) => get("/log/get-run-linux-cmd-num?user="+ sessionStorage.getItem("user") +"&token="+ sessionStorage.getItem("token"), params);
export const getUserLoginNum = (params) => get("/log/get-user-login-num?user="+ sessionStorage.getItem("user") +"&token="+ sessionStorage.getItem("token"), params);
export const webTerminal = (params) => get("/assets/terminal?user="+ sessionStorage.getItem("user") +"&token="+ sessionStorage.getItem("token"), params);
export const getClusterList = (params) => get("/cluster/list?user="+ sessionStorage.getItem("user") +"&token="+sessionStorage.getItem("token"), params);
