import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
//路由守卫, 访问入口, 改放在了router/index.js
// import './router/verification'

// 第三方插件
import 'element-ui/lib/theme-chalk/index.css';
import 'element-ui/lib/theme-chalk/base.css';
import { Button } from 'element-ui'
import { Card } from 'element-ui'
import { Col } from 'element-ui'
import { Row } from 'element-ui'
import { Input } from 'element-ui'
import { Table } from 'element-ui'
import { TableColumn } from 'element-ui'
import { Dialog } from 'element-ui'
import { Form } from 'element-ui'
import { FormItem } from 'element-ui'
import { Pagination } from 'element-ui'
import { Loading } from 'element-ui'
import { Popconfirm } from 'element-ui'
import { Tooltip } from 'element-ui'
import { Select } from 'element-ui'
import { Option } from 'element-ui'
import { Tag } from 'element-ui'
import { Badge } from 'element-ui'
import { Tree } from 'element-ui'
import { Container } from 'element-ui'
import { Aside } from 'element-ui'
import { Header } from 'element-ui'
import { Main } from 'element-ui'
import { Menu } from 'element-ui'
import { MenuItem } from 'element-ui'
import { Submenu } from 'element-ui'
import { Calendar } from 'element-ui'
import { Breadcrumb } from 'element-ui'
import { BreadcrumbItem } from 'element-ui'
import { Tabs } from 'element-ui'
import { TabPane } from 'element-ui'
import { Dropdown } from 'element-ui'
import { DropdownMenu } from 'element-ui'
import { DropdownItem } from 'element-ui'
import { Divider } from 'element-ui'
import { Link } from 'element-ui'
import { DatePicker } from 'element-ui'
import { Switch } from 'element-ui'
import { Statistic } from 'element-ui'
import { ButtonGroup } from 'element-ui'
import { Popover } from 'element-ui'
import { Upload } from 'element-ui'
import { Progress } from 'element-ui'
import VueBus from 'vue-bus';
import VuePageTransition from 'vue-page-transition'

Vue.use(Dropdown);
Vue.use(DropdownMenu);
Vue.use(DropdownItem);
Vue.use(Button);
Vue.use(Card);
Vue.use(Col);
Vue.use(Row);
Vue.use(Input);
Vue.use(Table);
Vue.use(TableColumn);
Vue.use(Dialog);
Vue.use(Form);
Vue.use(FormItem);
Vue.use(Pagination);
Vue.use(Loading);
Vue.use(Popconfirm);
Vue.use(Tooltip);
Vue.use(Select);
Vue.use(Option);
Vue.use(Tag);
Vue.use(Badge);
Vue.use(Tree);
Vue.use(Container);
Vue.use(Aside);
Vue.use(Header);
Vue.use(Main);
Vue.use(Menu);
Vue.use(MenuItem);
Vue.use(Submenu);
Vue.use(Calendar);
Vue.use(Breadcrumb);
Vue.use(BreadcrumbItem);
Vue.use(Tabs);
Vue.use(TabPane);
Vue.use(Divider);
Vue.use(Link);
Vue.use(DatePicker);
Vue.use(Switch);
Vue.use(Statistic);
Vue.use(ButtonGroup);
Vue.use(Popover);
Vue.use(Upload);
Vue.use(Progress);
Vue.use(VueBus);


Vue.use(VuePageTransition);

//复制插件
import VueClipboardPlus from 'vue-clipboard-plus';
Vue.use(VueClipboardPlus);

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
