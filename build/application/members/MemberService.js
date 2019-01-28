import { BaseApplicationService } from "../BaseApplicationService";
import { SysInfo } from "../../core/entities/SysInfo";
export class MemberService extends BaseApplicationService {
    constructor() {
        super(...arguments);
        this._urls = {
            Login: 'IAccounts/login',
        };
    }
    GetFullUrl(url) {
        return this.GlobalUrl.CloudStoreApi + url;
    }
    GetImplementsService() {
        return "IMemberService";
    }
    GetMembersById(ids) {
        throw new Error("Method not implemented.");
    }
    GetMemberInfo(idOrPhone) {
        throw new Error("Method not implemented.");
    }
    Login(info) {
        if (info.phone == "" || info.password == "") {
            throw new Error("账号或者密码为空");
        }
        let url = this.GetFullUrl(this._urls.Login);
        return this.Request.Request("POST", url, {
            p: {
                mobile: info.phone,
                pwd: info.password
            }
        }).then(res => {
            if (res) {
                let token = { loginToken: res.loginToken, token: res.token };
                let sysInfo = new SysInfo({
                    sysId: res.account.id,
                    sysName: res.account.loginName,
                    sysPhone: res.account.mobile,
                    token: token
                });
                this.ConfigCenter.SetSysInfo(sysInfo);
                return res;
            }
            return null;
        }, err => {
            console.error("登录失败", err);
            return null;
        });
    }
}
//# sourceMappingURL=MemberService.js.map