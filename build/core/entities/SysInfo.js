export class SysInfo {
    constructor(data) {
        if (data.sysId) {
            this.sysId = data.sysId;
            this.sysName = data.sysName;
            this.sysPhone = data.sysPhone;
            this.isUser = true;
        }
        else {
            this.memberId = data.memberId;
            this.isUser = false;
        }
        this.token = data.token;
    }
}
//# sourceMappingURL=SysInfo.js.map