const TokenKey = 'App-Token'

export function getToken() {
	return uni.getStorageSync(TokenKey)
}

export function setToken(token) {
	return uni.setStorageSync(TokenKey, token)
}

export function removeToken() {
	return uni.removeStorageSync(TokenKey)
}

export function setUserId(userId) {
	return uni.setStorageSync("userId", userId)
}
export function getUserId() {
	return uni.getStorageSync("userId")
}

export function isLogin() {
	if (getToken() == "" || getToken() == "no_account") {
		return false;
	} else {
		return true;
	}
}
