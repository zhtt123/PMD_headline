import request from '@/utils/request'
import { getStorage } from '@/utils/storage'

// 登录
export const loginAPI = ({ mobile, code }) => request({
  url: '/v1_0/authorizations',
  method: 'POST',
  data: { mobile, code }
})

// 更新token
export const getNewTokenAPI = () => request({
  url: '/v1_0/authorizations',
  method: 'Put',
  headers: {
    Authorization: 'Bearer ' + getStorage('refresh_token')
  }
})

// 获取所有用户频道
export const getUserChannelsAPI = () => request({
  url: '/v1_0/user/channels',
  method: 'GET'
})

// 获取所有频道频道
export const getAllChannelsAPI = () => request({
  url: '/v1_0/channels',
  method: 'GET'
})

// 新增频道
export const addChannelsAPI = ({ channels }) => request({
  url: '/v1_0/user/channels',
  method: 'PUT',
  data: { channels: channels }
})

// 删除频道
export const deleteChannelsAPI = ({ channelId }) => request({
  url: `/v1_0/user/channels/${channelId}`,
  method: 'DELETE'
})

// 获取文章列表
export const getAllArticleListAPI = ({ channel_id, timestamp }) => request({
  url: '/v1_0/articles',
  method: 'GET',
  params: { channel_id, timestamp }
})

// 用户反馈对文章不喜欢
export const dislikeArticleAPI = ({ artId }) => request({
  url: '/v1_0/article/dislikes',
  method: 'POST',
  data: { target: artId }
})

// 反馈垃圾内容
export const reportArticleAPI = ({ artId, type, remark }) => request({
  url: '/v1_0/article/reports',
  method: 'POST',
  data: {
    target: artId,
    type: type,
    remark: ''
  }
})

// 获取联想建议
export const getSuggestListAPI = ({ keywords }) => request({
  url: '/v1_0/suggestion',
  method: 'GET',
  params: { q: keywords }
})

// 获取搜索结果
export const getResultListAPI = ({ page = 1, per_page = 10, keywords }) => request({
  url: '/v1_0/search',
  method: 'GET',
  params: { page: page, per_page: per_page, q: keywords }
})

// 获取新闻详情
export const getArticleDetailAPI = ({ artId }) => request({
  url: `/v1_0/articles/${artId}`,
  method: 'GET'
})

// 关注作者
export const followedUserAPI = ({ autId }) => request({
  url: '/v1_0/user/followings',
  method: 'POST',
  data: { target: autId }
})

// 取消关注
export const unFollowedUserAPI = ({ autId }) => request({
  url: `/v1_0/user/followings/${autId}`,
  method: 'DELETE'
})

// 点赞文章
export const loveArticleAPI = ({ artId }) => request({
  url: '/v1_0/article/likings',
  method: 'POST',
  data: { target: artId }
})

// 取消点赞
export const unLoveArticleAPI = ({ artId }) => request({
  url: `/v1_0/article/likings/${artId}`,
  method: 'DELETE'
})

// 获取文章评论列表
export const getCommentListAPI = ({ id, offset = null, limit = 10 }) => request({
  url: '/v1_0/comments',
  method: 'GET',
  params: {
    type: 'a',
    source: id,
    offset,
    limit
  }
})

// 对文章评论点赞
export const likeCommentAPI = ({ comId }) => request({
  url: '/v1_0/comment/likings',
  method: 'POST',
  data: { target: comId }
})

// 取消对文章评论点赞
export const dislikeCommentAPI = ({ comId }) => request({
  url: `/v1_0/comment/likings/${comId}`,
  method: 'DELETE'
})

export const getCommentAPI = ({ id, content, art_id = null }) => {
  const obj = {
    target: id,
    content
  }
  if (art_id !== null) {
    obj.art_id = art_id
  }
  return request({
    url: '/v1_0/comments',
    method: 'POST',
    data: obj
  })
}

// 对文章评论收藏
export const collectionCommentAPI = ({ artId }) => request({
  url: '/v1_0/article/collections',
  method: 'POST',
  data: { target: artId }
})

// 取消对文章评论收藏
export const unCollectionCommentAPI = ({ artId }) => request({
  url: `/v1_0/article/collections/${artId}`,
  method: 'DELETE'
})

// 获取用户的个人中心信息
export const getUserInfoAPI = () => request({
  url: '/v1_0/user'
})

// 获取用户的个人资料
export const getProfileInfoAPI = () => request({
  url: '/v1_0/user/profile'
})

export const updatePhotoAPI = (df) => request({
  url: '/v1_0/user/photo',
  method: 'PATCH',
  // 传的是一个FormDate对象,请求头自动生成一个键值对Content-Type:multipart/form-data
  data: df
})

// 编辑用户的个人资料
export const editProfileInfoAPI = (profileObj) => request({
  url: '/v1_0/user/profile',
  method: 'PATCH',
  data: profileObj
})
