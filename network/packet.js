/**
 * Created with JetBrains WebStorm.
 * User: leecrest
 * Date: 13-4-18
 * Time: 上午10:39
 * To change this template use File | Settings | File Templates.
 */
// 消息包

// 消息头，定义具体消息包时，请务必包含这几项
function STMsgHeader(nMsgCode, nSrcDUID, nDstDUID){
    this.nMsgCode = nMsgCode;
    this.nSrcDUID = nSrcDUID;
    this.nDstDUID = nDstDUID;
};