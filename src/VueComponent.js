// 将vant组件单独封装出来，防止入口文件代码太多
import Vue from 'vue'
import { NavBar, Form, Field, Button, Tabbar, TabbarItem, Icon, Tab, Tabs, Cell, List, PullRefresh, ActionSheet, Popup, Row, Col, Badge, Search, Image as VanImage, Divider, CellGroup, Tag, Dialog, DatetimePicker, Loading, Lazyload } from 'vant'

Vue.use(NavBar)
Vue.use(Form)
Vue.use(Field)
Vue.use(Button)
Vue.use(Tabbar)
Vue.use(TabbarItem)
Vue.use(Icon)
Vue.use(Tab)
Vue.use(Tabs)
Vue.use(Cell)
Vue.use(List)
Vue.use(PullRefresh)
Vue.use(ActionSheet)
Vue.use(Popup)
Vue.use(Row)
Vue.use(Col)
Vue.use(Badge)
Vue.use(Search)
Vue.use(VanImage)
Vue.use(Divider)
Vue.use(CellGroup)
Vue.use(Tag)
Vue.use(Dialog)
Vue.use(DatetimePicker)
Vue.use(Loading)
Vue.use(Lazyload, {
  error: 'https://tse4-mm.cn.bing.net/th/id/OIP-C.zuEv3daqQlqz-qeId_1JYgHaEt?pid=ImgDet&rs=1'
})
