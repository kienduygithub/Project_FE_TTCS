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
import {updateUser} from "../../redux/slices/userSlice";
import _ from 'lodash';
const SignInPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const defaultValueInput = {
        email: true,
        password: true
    }
    const [isValidInput, setIsValidInput] = useState(defaultValueInput);
    const location = useLocation();
    const dispatch = useDispatch();
    const navigate = useNavigate()
    const handleNavgationSignUp = () => {
        navigate('/sign-up')
    }
    const handleOnchangeEmail = (e) => {
        setEmail(e.target.value);
        if (email !== '') {
            let _isValidInput = _.cloneDeep(isValidInput);
            _isValidInput.email = true;
            setIsValidInput(_isValidInput);
        }
    }
    const handleOnchangePassword = (e) => {
        setPassword(e.target.value);
        if (password !== '') {
            let _isValidInput = _.cloneDeep(isValidInput);
            _isValidInput.password = true;
            setIsValidInput(_isValidInput);
        }
    }
    const mutation = useMutationHooks(
        data => userServices.loginUser(data)
    )
    let { data, isLoading, isSuccess, isError } = mutation;
    useEffect(() => {
        async function Delay(){
            if(data?.status === 'OK' && data?.data){
                message.success('Đăng nhập thành công');
                localStorage.setItem('access_token', data?.access_token);
                if(data?.access_token){
                    const decoded = jwtDecode(data?.access_token);
                    if(decoded?.id){
                        handleGetDetailsUser(decoded?.id, data?.access_token)
                    }
                }
                if (location?.state) {
                    let type = location?.state?.split('/')
                    navigate(location?.state, {state: type[type.length - 1]})
                }else{
                    navigate('/')
                }
            } else if (data?.status === 'ERR') {
                if (data?.err_fields) {
                    let _isValidInput = _.cloneDeep(isValidInput);
                    _isValidInput[data.err_fields] = false;
                    setIsValidInput(_isValidInput);
                }
            }
        }
        setTimeout(Delay, 200)
    }, [isSuccess])
    const handleGetDetailsUser = async (id, access_token) => {
        const res = await userServices.getDetailsUser(id, access_token);
        const refresh_token = data?.refresh_token;
        dispatch(updateUser({...res?.data, access_token, refresh_token}))
    } 
    const validateBeforeSubmit = () => {
        setIsValidInput(defaultValueInput);
        let arrErr = [];
        if (!email) {
            arrErr.push('email');
        };
        if (!password) {
            arrErr.push('password');
        };
        if (arrErr.length > 0) {
            let _isValidInput = _.cloneDeep(isValidInput);
            arrErr.forEach((item) => {
                _isValidInput[item] = false;
            })
            setIsValidInput(_isValidInput);
            return false;
        }
        return true;
    }
    const handleSignIn = async () => {
        const isValid = validateBeforeSubmit();
        if (isValid) {
            mutation.mutate({ email, password})
        }
    }
    const handleEnterLogin = async (e) => {
        if (e.key === 'Enter') {
            const isValid = validateBeforeSubmit();
            if (isValid) {
                mutation.mutate({ email, password})
            }
        }
    }
    return(
        
        <div className="background">
            <div className="sign-in-container">
                <div className="container-left">
                    <h1>Xin chào,</h1>
                    <p>Đăng nhập và tạo tài khoản</p>
                    <div style={{height: 55}} className="mt-3">
                        <InputFormComponent 
                            className={isValidInput.email === true ? "input form-control" : "input form-control is-invalid"} 
                            placeholder="Nhập email"
                            type="email"
                            valueInput={email}
                            onChange={(e) => handleOnchangeEmail(e)}
                        />
                    </div>
                    <div style={{height: 40}}>
                        <div className="input-password">
                            <InputFormComponent 
                                className={isValidInput.password === true ? "input form-control" : "input form-control is-invalid"}
                                placeholder="Nhập mật khẩu"
                                type={'password'}
                                valueInput={password}
                                onChange={(e) => handleOnchangePassword(e)}
                                onKeyDown={(e) => handleEnterLogin(e)}
                            />
                            {data?.status === 'ERR' && <span className="text-error">{data?.message}</span>}
                        </div>
                    </div>
                    <LoadingComponent isLoading={isLoading}>
                        <ButtonComponent 
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