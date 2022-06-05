import Vue from 'vue'
// 按需引入 element-ui 组件 和 message弹框提示组件
import {
    Form,
    FormItem,
    Button,
    Input,
    Message,
    Header,
    Container,
    Aside,
    Main,
    Submenu,
    Menu,
    MenuItem,
    Breadcrumb,
    BreadcrumbItem,
    Card,
    Select,
    Row,
    Col,
    Table,
    TableColumn,
    Switch,
    Tooltip,
    Pagination,
    Dialog,
    MessageBox,
    Tag,
    Tree,
    Option
} from 'element-ui'
// Message需要进行全局挂载

// 使用插件
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Button)
Vue.use(Header)
Vue.use(Container)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Submenu)
Vue.use(Menu)
Vue.use(MenuItem)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Card)
Vue.use(Select)
Vue.use(Row)
Vue.use(Col)
Vue.use(Switch)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Tooltip)
Vue.use(Pagination)
Vue.use(Dialog)
Vue.use(Tag)
Vue.use(Tree)
Vue.use(Option)

Vue.prototype.$message = Message
Vue.prototype.$confirm = MessageBox.confirm