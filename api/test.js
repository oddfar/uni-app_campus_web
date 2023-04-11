import request from '@/utils/request'


export const getYuLu = () => {
	return request({
		url: '/campus/contentList',
		method: 'GET',
		data: {
			c: '2004',
			encode: 'json'
		}

	})
}
