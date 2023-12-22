import React, { useEffect, useState } from "react";
import './SignInPage.scss'
import InputFormComponent from "../../components/InputFormComponent/InputFormComponent";
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent'
import ImageLogo from '../../assests/images/Login/SignIn.png'
import { Image } from "antd";
import { EyeInvisibleOutlined, EyeOutlined } from "@ant-design/icons";
import { useLocation, useNavigate } from "react-router";
// import { useMutation } from "react-query";
import * as userServices from '../../services/userServices'
import * as message from '../../components/Message/Message'
import { jwtDecode } from 'jwt-decode'
import { useMutationHooks } from '../../hooks/userMutationHook'
import LoadingComponent from "../../components/LoadingComponent/LoadingComponet";
import { useDispatch } from 'react-redux'
import { updateUser } from "../../redux/slices/userSlice";
const SignInPage = () => {
    const [isShow, setIsShow] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const location = useLocation();
    const dispatch = useDispatch();
    const ShowHide = () => {
        setIsShow(!isShow)
    }
    const navigate = useNavigate()
    const handleNavgationSignUp = () => {
        navigate('/sign-up')
    }
    const handleOnchangeEmail = (e) => {
        setEmail(e.target.value);
    }
    const handleOnchangePassword = (e) => {
        setPassword(e.target.value);
    }
    const mutation = useMutationHooks(
        data => userServices.loginUser(data)
    )
    let { data, isLoading, isSuccess, isError } = mutation;
    useEffect(() => {
        async function Delay(){
            console.log('location:', location)
            if(data?.status === 'OK' && data?.data){
                message.success('Đăng nhập thành công');
                console.log('>>> Data (Login): ', data);
                localStorage.setItem('access_token', JSON.stringify(data?.access_token));
                localStorage.setItem('refresh_token', JSON.stringify(data?.refresh_token));
                if(data?.access_token){
                    const decoded = jwtDecode(data?.access_token);
                    console.log('>>> Decoded JWT: ', decoded)
                    if(decoded?.id){
                        handleGetDetailsUser(decoded?.id, data?.access_token)
                    }
                }
                console.log('Location: ', location)
                if (location?.state) {
                    let type = location?.state?.split('/')
                    navigate(location?.state, {state: type[type.length - 1]})
                }else{
                    navigate('/')
                }
            }else if(data?.status === 'ERR' && !data?.data){
                message.error('Đăng nhập không thành công');
            }
        }
        setTimeout(Delay, 200)
    }, [isSuccess])
    const handleGetDetailsUser = async (id, access_token) => {
        const res = await userServices.getDetailsUser(id, access_token);
        const refresh_token = data?.refresh_token;
        console.log('>>> Result: ', res);
        dispatch(updateUser({...res?.data, access_token, refresh_token}))
    } 
    const handleSignIn =async () => {
        console.log('>>> Sign In: ', email, password);
        mutation.mutate({ email, password})
    }
    return(
        
        <div className="background">
            <div className="sign-in-container">
                <div className="container-left">
                    <h1>Xin chào,</h1>
                    <p>Đăng nhập và tạo tài khoản</p>
                    <InputFormComponent 
                        className="input"
                        placeholder="abc@gmail.com"
                        type="email"
                        valueInput={email}
                        onChange={(e) => handleOnchangeEmail(e)}
                    />
                    <div className="input-password">
                        <InputFormComponent 
                            className="input"
                            placeholder="password"
                            type={isShow ? 'text' : 'password'}
                            valueInput={password}
                            onChange={(e) => handleOnchangePassword(e)}
                        />
                        <span className="text-showhide" onClick={() => ShowHide()}>
                            {isShow === false ? <EyeInvisibleOutlined /> : <EyeOutlined />}
                        </span>
                    </div>
                    {/* { data?.response.status === 'ERR' && <span style={{color: 'red', fontSize: '9px'}}>{data?.response.message}</span>} */}
                    {data?.status === 'ERR' && <span style={{color: 'red', fontSize: '9px'}}>{data?.message}</span>}
                    <LoadingComponent isLoading={isLoading}>
                        <ButtonComponent 
                            disabled={
                                !email.length || !password.length ? 
                                true : false
                            }
                            onClick={() => handleSignIn()}
                            bordered={false}
                            size={40}
                            styleButton={{
                                backgroundColor: 'rgb(255, 57, 69)',
                                height: '35px',
                                width: '100%',
                                border: 'none',
                                borderRadius: '5px',
                                margin: '26px 0 10px'
                            }}
                            textButton={'Đăng nhập'}
                            styleTextButton={{
                                color: '#fff', fontSize: '15px', fontWeight: '700'
                            }}
                        />
                    </LoadingComponent>
                    <span className="text-forget-password" onClick={() => navigate('/forgot-password', {state: location.pathname})}>Quên mật khẩu</span>
                    <p>Chưa có tài khoản? <span className="text-create-account" onClick={() => handleNavgationSignUp()}>Tạo tài khoản</span></p>
                </div>
                <div className="container-right">
                    <Image src={ImageLogo} alt="Image Logo" preview={false}
                        className="image-logo"
                    />
                    <div className="content">
                        <h4>Mua sắm tại Mobile Shop</h4>
                        <span>Siêu ưu đãi mỗi ngày</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SignInPage