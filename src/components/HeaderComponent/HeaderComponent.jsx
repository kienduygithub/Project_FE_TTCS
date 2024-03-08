import React, { useEffect, useState } from "react";
import './header.scss'
import {
    Badge,
    Col
} from 'antd'
import {
    UserOutlined,
    CaretDownOutlined,
    ShoppingCartOutlined
} from '@ant-design/icons';
import {
    WrapperHeader,
    WrapperTextHeader, 
    WrapperHeaderAccount
} from "./style";
import ButtonInputSearch from "../ButtonInputSearch/ButtonInputSearch";
import { useLocation, useNavigate } from "react-router";
import { useSelector } from "react-redux";
import { Popover } from 'antd';
import * as userServices from '../../services/userServices'
// const { Search } = Input;
// const onSearch = (value, _e, info) => console.log(info?.source, value);
import { useDispatch } from "react-redux";
import { resetUser } from "../../redux/slices/userSlice";
import LoadingComponent from "../LoadingComponent/LoadingComponet";
import { searchProduct } from "../../redux/slices/productSlice";
import { jwtDecode } from "jwt-decode";
import { isJsonString } from "../../utils";
import { resetCart } from "../../redux/slices/orderSlice";
const HeaderComponent = ({ isHiddenSearch = false, isHiddenCart = false }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const user = useSelector((state) => state.user);
    const [avatar, setAvatar] = useState('');
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState('');
    const [isOpenPopup, setIsOpenPopup] = useState(false);
    const order = useSelector((state) => state.order);
    const location = useLocation();
    const handleNavigationLogin = () => {
        navigate('/sign-in', {state: location.pathname})
    }
    const handleLogout = async () => {
        setLoading(true)
        await userServices.logoutUser();
        dispatch(resetUser());
        dispatch(resetCart());
        navigate('/')
        setLoading(false)
    }
    useEffect(() => {
        setLoading(true);
        setName(user?.name);
        setAvatar(user?.avatar);
        setLoading(false);
    }, [user?.name, user?.avatar])
    const content = (
        <div>
            <p className="content-popup" onClick={() => handleClickNavigate('profile')}>Thông tin tài khoản</p>
            <p className="content-popup" onClick={() => handleClickNavigate(`my-order`)}>Đơn hàng của tôi</p>
            { user?.isAdmin ?
                <p className="content-popup" onClick={() => handleClickNavigate('admin')}>Quản lý hệ thống</p>
                : 
                null
            }
            <p className="content-popup" onClick={() => handleClickNavigate()}>Đăng xuất</p>
        </div>
    );
    
    // SEARCH
    const onSearch = (e) => {
        setSearch(e.target.value);
        dispatch(searchProduct(e.target.value))
    }
    const handleClickNavigate = (type) => {
        if (type === 'profile') {
            navigate('/profile-user');
        } else if (type === 'admin') {
            navigate('/system/admin');
        } else if (type === 'my-order') {
            navigate(`/my-order`, {
                state: {
                    id: user?.id,
                    token: user?.access_token
                }
            })
        } else {
            handleLogout()
        }
        setIsOpenPopup(false)
    }
    
    return(
        <div className="header-container">
            <WrapperHeader className="header-content">
                <Col span={6}>
                    <span
                        className="header-text"
                        onClick={() => navigate('/')
                    }>
                       Cửa hàng di động
                    </span>
                </Col>
                { isHiddenSearch === false ?
                    <Col span={12}>
                        <ButtonInputSearch
                            size={'large'}
                            placeholder={'Nhập tên sản phẩm'}
                            textbutton={'Tìm kiếm'}
                            onChange={onSearch}
                        />
                    </Col>
                  :
                    // <Col span={12}></Col>
                    <></>
                }
                <Col span={6} className="header-right">
                    <WrapperHeaderAccount className="header-right-content">
                        <div className="content-left">
                        {
                            avatar ? 
                            <img src={avatar} className="user-avatar"/>
                            : 
                            <UserOutlined className="user-icon"/>
                        }
                        </div>
                        <LoadingComponent isLoading={loading}>
                            <div className="content-middle">
                                {
                                    user?.access_token ?   
                                        <Popover content={content} trigger="click" open={isOpenPopup}>
                                            <div className="user-account" style={{cursor: 'pointer'}} onClick={() => setIsOpenPopup(!isOpenPopup)}>{(user.name.length > 0 && user.name) || 'User'}</div>
                                        </Popover>
                                    :
                                    <>
                                        <span onClick={() => handleNavigationLogin()}>
                                            Đăng nhập/Đăng ký
                                        </span>
                                        <div className="header-account">
                                            <span>Tài khoản</span>
                                            <CaretDownOutlined className="dropdown-icon-header"/>
                                        </div>
                                    </>
                                }
                            </div>
                        </LoadingComponent>
                        { isHiddenCart === false ?
                            <div className="header-cart" onClick={() => navigate('/order')} style={{cursor: 'pointer'}}>
                                <Badge key={user?.id} data={ user?.id } count={user?.access_token ? order?.orderItems?.length : 0} size={'small'}>
                                    <ShoppingCartOutlined key={user?.id} className="icon-cart"/>
                                </Badge>
                                    <span className="text-cart">Giỏ hàng</span>
                            </div>
                            :
                            <></>
                        }
                    </WrapperHeaderAccount>
                </Col>
            </WrapperHeader>
        </div>
    )
}
export default HeaderComponent