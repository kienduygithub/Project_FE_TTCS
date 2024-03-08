import React, {Fragment, useEffect, useState} from 'react'
import {
    BrowserRouter as Router,
    Routes,
    Route
} from 'react-router-dom'
import {routes} from './routes'
import DefaultComponent from './components/DefaultComponent/DefaultComponent'
import './index.scss'
import {isJsonString} from './utils'
import {jwtDecode} from 'jwt-decode'
import * as userServices from './services/userServices'
import {useDispatch, useSelector} from 'react-redux'
import {resetUser, updateUser} from './redux/slices/userSlice'
import LoadingComponent from './components/LoadingComponent/LoadingComponet'
import axios from 'axios';
import store from './redux/store'
import * as message from './components/Message/Message';
import 'bootstrap/dist/css/bootstrap.css';
const App = () => {
    // KHAI BÁO CÁC STATE 
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(false);
    const user = useSelector((state) => state.user);
    useEffect(() => {
        setIsLoading(true)
        const {decoded, storageData} = handleDecoded();
        if (decoded?.id) {
            handleGetDetailsUser(decoded?.id, storageData)
        }
        setIsLoading(false)
    }, []);
    const handleDecoded = () => {
        let storageData = localStorage.getItem('access_token');
        let decoded = {};
        if (storageData && isJsonString(storageData)) {
            storageData = JSON.parse(storageData);
            decoded = jwtDecode(storageData);
        }
        return {decoded, storageData}
    }
    userServices.axiosJWT.interceptors.request.use(async (config) => {
        // const currentTime = new Date();
        // const { decoded } = handleDecoded();
        // let token = localStorage.getItem('refresh_token');
        // // let refreshToken = token ? JSON.parse(token) : null;
        // let total = decoded?.exp - (currentTime.getTime() / 1000);
        // if (total < 0) {
        //   if (token) {
        //     const data = await userServices.refreshToken(token);
        //     config.headers[ 'token' ] = `Beare ${ data?.access_token }`
        //   }
        // }
        const access_token = localStorage.getItem('access_token');
        if (access_token) {
            config.headers.Authorization = `Bearer ${access_token}`
        }
        return config;
    }, function(error) {
        return Promise.reject(error);
    });
    userServices.axiosJWT.interceptors.response.use(
        (response) => {
            return response;
        },
        async (error) => {
            if (error.response && error.response.status === 401) {
                try {
                    const response = await userServices.refreshToken();
                    if (response) {
                        const newToken = response.access_token;
                        error.config.headers.Authorization = `Bearer ${newToken}`;
                    }
                    return axios(error.config);
                } catch (error) {
                    // REFRESH TOKEN EXPIRED
                    console.log('Hết hạn đăng nhập!');
                    // message.error('Hết hạn đăng nhập, vui lòng đăng nhập lại!');
                    alert('Hết hạn đăng nhập, vui lòng đăng nhập lại!');
                    await userServices.logoutUser();
                    dispatch(resetUser());
                    window.location.href = '/';
                    return Promise.reject(error);
                }
            }
        }
    )
    const handleGetDetailsUser = async (id, access_token) => {
        const res = await userServices.getDetailsUser(id, access_token);
        dispatch(updateUser({...res?.data, access_token}))
    }
    return (
        <div>
            <LoadingComponent isLoading={isLoading} style={{background: '#ccc'}}>
                <Router>
                    <Routes>
                        {routes.map((route) => {
                            const Page = route.page
                            const Layout = route.isShowHeader ? DefaultComponent : Fragment
                            const isCheckAuth = !route.isPrivate || (user.isAdmin === 0 ? false : true);
                            return (
                                <Route key={isCheckAuth && route.path} path={route.path} element={
                                    <Layout>
                                        <Page />
                                    </Layout>
                                } />
                            )
                        })}
                    </Routes>
                </Router>
            </LoadingComponent>
        </div>
    )
}

export default App