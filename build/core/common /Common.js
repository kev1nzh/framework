export class Common {
    static GetGuid() {
        let s = [];
        let hexDigits = "0123456789abcdef";
        for (let index = 0; index < 36; index++) {
            s[index] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
        }
        s[14] = "4";
        s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);
        s[8] = s[13] = s[18] = s[23] = "-";
        return s.join("");
    }
    static GetUuid() {
        let guid = this.GetGuid();
        return guid.replace(new RegExp("-", "gm"), "");
    }
}
//# sourceMappingURL=Common.js.map