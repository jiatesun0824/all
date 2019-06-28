import { payService } from 'utils/request'
const PlatformCode = "mobile2b"
// 获取消费记录
export function findExpenseRecordList(data) {
	return payService.get(`/v1/web/pay/payOrder/findExpenseRecordList`, data, {
		headers: {
			"Platform-Code": PlatformCode
		}
	})
}
// 获取账户数据
export function getUserBalance(data) {
	return payService.get(`v1/web/system/sysUser/getUserBalance`, data, {
		headers: {
			"Platform-Code": PlatformCode
		}
	})
}
// 获取充值积分列表
export function getRechargeIntegralList(data) {
	return payService.post(`/v1/web/pay/payOrder/getRechargeIntegralList`, data, {
		headers: {
			"Platform-Code": PlatformCode
		}
	})
}
// 获取渲染套餐列表
export function getRenderPayConfigLis(data) {
	return payService.get(`/v1/web/pay/payModelConfig/getRenderPayConfigList`, data, {
		headers: {
			"Platform-Code": PlatformCode
		}
	})
}
// 购买包年包月（微信h5支付，支付宝手机网页支付）
export function rechargePayModelByH5Pay(data) {
	return payService.get(`/v1/web/pay/payOrder/rechargePayModelByH5Pay`, data, {
		headers: {
			"Platform-Code": PlatformCode
		}
	})
}
// 购买包年包月（支付宝和微信APP支付）
export function rechargePayModelByAppPay(data) {
	return payService.get(`/v1/agency/pay/agencyPayModelByAppPay`, data, {
		headers: {
			"Platform-Code": PlatformCode
		}
	})
}
// 积分充值H5
export function payIntergralByH5(data) {
	return payService.post(`/v1/web/pay/payOrder/rechargeIntegralByH5Pay2b`, data, {
		headers: {
			"Platform-Code": PlatformCode
		}
	})
}
// 积分充值APP
export function payIntergralByApp(data) {
	return payService.get(`/v1/web/pay/payOrder/rechargeIntegralByAppPay`, data, {
		headers: {
			"Platform-Code": PlatformCode
		}
	})
}