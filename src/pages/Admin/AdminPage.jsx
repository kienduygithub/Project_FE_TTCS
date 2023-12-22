import React, { Fragment, useEffect, useRef, useState } from "react";
import './AdminPage.scss';
import { Menu } from "antd";
import { 
    SettingOutlined, AppstoreOutlined, UserOutlined, InboxOutlined, InsertRowAboveOutlined, PicLeftOutlined
} from '@ant-design/icons'
import { getItem } from "../../utils";
import HeaderComponent from '../../components/HeaderComponent/HeaderComponent'
import AdminUser from "../../components/AdminUser/AdminUser";
import AdminProduct from "../../components/AdminProduct/AdminProduct";
import AdminOrder from "../../components/AdminOrder/AdminOrder";
import AdminDashBoard from "../../components/AdminDashBoard/AdminDashBoard";
import AdminReport from "../../components/AdminReport/AdminReport";
// function getItem(label, key, icon, children, type) {
//     return {
//         key,
//         icon,
//         children,
//         label,
//         type,
//     };
// }
const items = [
    getItem('Tổng quan', 'dashboard', <AppstoreOutlined />),
    getItem('Người dùng', 'user', <UserOutlined />),
    getItem('Sản phẩm', 'product', <InsertRowAboveOutlined />),
    getItem('Đơn hàng', 'order', <InboxOutlined />),
    getItem('Thống kê', 'report', <PicLeftOutlined />)
];
const rootSubmenuKeys = ['user', 'product', 'order', 'report'];
const AdminPage = () => {
    const [openKeys, setOpenKeys] = useState(['user']);
    const [keySelected, setKeySelected] = useState('');
    const renderPage = (key) => {
        switch (key) {
            case 'dashboard': 
                return (
                    <AdminDashBoard/>
                )
            case 'user':
                return(
                    <AdminUser/>
                )
            case 'product':
                return(
                    <AdminProduct/>
                )
            case 'order': 
                return (
                    <AdminOrder/>
                )
            case 'report': 
                return (
                    <AdminReport/>
                )
            default:
                return (
                    <AdminDashBoard/>
                )
        }
    }
    const handleOnclick = ({key}) => {
       setKeySelected(key)
    }
    console.log('Keyselected: ', keySelected)
    return(
        <div>
            <HeaderComponent isHiddenSearch isHiddenCart/>

            <div style={{ display: 'flex', alignItems: 'stretch'}}>
                <Menu
                    mode="inline"
                    items={items}
                    onClick={handleOnclick}
                    className="menu-container"
                />
                <div style={{flex: '1', padding: '15px'}}>
                    {renderPage(keySelected)}
                </div>
            </div>
        </div>
    )
}

export default AdminPage