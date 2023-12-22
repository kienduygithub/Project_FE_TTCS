import React, { useEffect, useState } from "react";
import './SignUpPage.scss'
import InputFormComponent from "../../components/InputFormComponent/InputFormComponent";
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent'
import ImageLogo from '../../assests/images/Login/SignIn.png'
import { Image } from "antd";
import {
    EyeOutlined,
    EyeInvisibleOutlined
} from '@ant-design/icons'
import { useNavigate } from "react-router";
import { useMutationHooks } from "../../hooks/userMutationHook";
import * as userServices from '../../services/userServices'
import * as message from '../../components/Message/Message'
import LoadingComponent from "../../components/LoadingComponent/LoadingComponet";
const SignUpPage = () => {
    const [isShow, setIsShow] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('')
    const ShowHide = () => {
        setIsShow(!isShow)
    }
    const navigate = useNavigate()
    const handleNavigationSignIn = () => {
        navigate('/sign-in')
    }
    const handleOnchangeEmail = (e) => {
        setEmail(e.target.value);
    }
    const handleOnchangePassword = (e) => {
        setPassword(e.target.value);
    }
    const handleOnchangeConfirmPassword = (e) => {
        setConfirmPassword(e.target.value);
    }
    
    const mutation = useMutationHooks(
        data => userServices.signupUser(data)
    )
    const {data, isLoading, isSuccess, isError} = mutation;
    useEffect(() => {
        if(isSuccess){
            message.success();
            navigate('/sign-in');
        }else if(isError){
            message.error();
        }
    }, [isSuccess, isError])
    const handleSignUp = async () => {
        console.log('>>> Sign up: ', email, password, confirmPassword)
        mutation.mutate({ email, password, confirmPassword})
        console.log('>>> Mutation Sign-up: ', mutation)
    }
    return(
        <div className="background">
            <div className="sign-up-container">
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
                            type={isShow ? 'text': 'password'}
                            valueInput={password}
                            onChange={(e) => handleOnchangePassword(e)}
                        />
                        <span className="text-showhide" onClick={() => ShowHide()}>
                            {isShow === false ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                        </span>
                    </div>
                    <InputFormComponent 
                        className="input"
                        placeholder= 'Confirm password'
                        type='password'
                        valueInput={confirmPassword}
                        onChange={(e) => handleOnchangeConfirmPassword(e)}
                    />
                    {data?.status === 'ERR' && <span style={{color: 'red', fontSize:'9px'}}>{data?.message}</span>}
                    {data?.response.status === 'ERR' && <span style={{color: 'red', fontSize:'9px'}}>{data?.response.message}</span>}
                    <LoadingComponent isLoading={isLoading}>
                    <ButtonComponent 
                        disabled={ 
                            !email.length || !password.length || !confirmPassword.length ?
                            true : false
                        }
                        onClick={() => handleSignUp()}
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
                        textButton={'Tạo tài khoản'}
                        styleTextButton={{
                            color: '#fff', fontSize: '15px', fontWeight: '700'
                        }}
                    />
                    </LoadingComponent>
                    <p>Bạn đã có tài khoản? <span className="text-create-account" onClick={() => handleNavigationSignIn()}>Đăng nhập</span></p>
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

export default SignUpPage