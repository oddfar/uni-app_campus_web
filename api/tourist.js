import request from '@/utils/request'


export default {

    //获取所有分类
    getCategoryList() {
        return request({
            url: `/campus/categoryList`,
            method: `get`,
        })
    },
    //获取消息盒子内容集合
    getContent(contentVo) {
        return request({
            url: `/campus/contentList`,
            method: `get`,
            params: contentVo
        })
    },
    //获取消息盒子内容集合
    getContentById(id) {
        return request({
            url: `/campus/getContent`,
            method: `get`,
            params: { id }
        })
    },
    //获取一级评论
    getOneLevelComment(CommentEntity) {
        return request({
            url: `/campus/getOneLevelComment`,
            method: `get`,
            params: CommentEntity
        })
    },
    //获取子评论
    getCommentChildren(CommentEntity) {
        return request({
            url: `/campus/getCommentChildren`,
            method: `get`,
            params: CommentEntity
        })
    },
	//获取子评论
	getCommentChildrenList(commentId) {
	    return request({
	        url: `/campus/getCommentChildrenList`,
	        method: `get`,
	        params: {commentId}
	    })
	},
	//根据id查询评论信息
	getComment(commentId){
		return request({
		    url: `/campus/getComment`,
		    method: `get`,
		    params: {commentId}
		})
	},
    //查询简单热门信息墙内容列表
    getSimpleHotContent() {
        return request({
            url: `/campus/simpleHotContent`,
            method: `get`
        })
    },

}