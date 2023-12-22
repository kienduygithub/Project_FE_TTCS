import React, { useEffect, useState } from "react";
import './ForgotPasswordPage.scss'
import InputFormComponent from "../../components/InputFormComponent/InputFormComponent";
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent'
import ImageLogo from '../../assests/images/Login/SignIn.png'
import { Image } from "antd";
import { EyeInvisibleOutlined, EyeOutlined } from "@ant-design/icons";
import { useLocation, useNavigate } from "react-router";
// import { useMutation } from "react-query";
import * as userServices from '../../services/userServices'
import * as message from '../../components/Message/Message'
import arrowBack from '../../assests/images/arrow-back.jpg'
import { jwtDecode } from 'jwt-decode'
import { useMutationHooks } from '../../hooks/userMutationHook'
import LoadingComponent from "../../components/LoadingComponent/LoadingComponet";
import { useDispatch } from 'react-redux'

const ForgotPasswordPage = () => {
    const [email, setEmail] = useState('');
    const [isOtp, setIsOtp] = useState(false);
    const location = useLocation();
    const dispatch = useDispatch();
    const navigate = useNavigate()

    const mutationGetOTP = useMutationHooks(
        (data) => userServices.forgotPassword(data)
    )
    const { data: dataGetOTP, isLoading: isLoadingGetOTP, isSuccess: isSuccessGetOTP, isError: isErrorGetOTP } = mutationGetOTP;
    const handleOnchangeEmail = (e) => {
        setEmail(e.target.value);
    }
    const handleGetResetOTP = () => {
        mutationGetOTP.mutate({email: email})
    }
    useEffect(() => {
        if (isSuccessGetOTP && dataGetOTP?.status === 'OK') {
            setIsOtp(true);
            navigate('/reset-password', {
                state: {
                    email: email,
                    path: location?.pathname
                }
            })
            console.log('dataGetOTP(data): ', dataGetOTP?.data)
        } else if(isErrorGetOTP) {
            message.error('Vui lòng kiểm tra lại');
        } else if (dataGetOTP?.message === 'The user is not defined') {
            message.error('Email không tồn tại')
        }
    }, [isSuccessGetOTP, isErrorGetOTP, dataGetOTP])
    return(
        
        <div className="background">
            <LoadingComponent isLoading={isLoadingGetOTP}>
            <div className="sign-in-container">
                <div className="container-left">
                    <div style={{display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer'}} onClick={() => navigate('/sign-in')}>
                        <img src={arrowBack} style={{width: '10px'}} />
                        <span style={{fontSize: '12px', color: '#64646d'}}>Trở về đăng nhập</span>
                    </div>
                    <h1>Quên mật khẩu ?</h1>
                    <p>Vui lòng nhập thông tin tài khoản để cấp quyền lấy lại mật khẩu</p>
                    <InputFormComponent 
                        className="input"
                        placeholder="abc@gmail.com"
                        type="email"
                        valueInput={email}
                        onChange={(e) => handleOnchangeEmail(e)}
                    />
                    {/* {isOtp && <div style={{ textAlign: 'right' }}><span style={{ fontSize: '11px', fontWeight: '400' }}>Mã OTP vừa được gửi đến {email}, kiểm tra trước khi hết hạn</span></div>} */}
                    <ButtonComponent 
                        disabled={
                            !email.length ? 
                            true : false
                        }
                        onClick={() => handleGetResetOTP()}
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
                        textButton={'Lấy lại mật khẩu'}
                        styleTextButton={{
                            color: '#fff', fontSize: '15px', fontWeight: '700'
                        }}
                    />
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
            </LoadingComponent>    
        </div>
    )
}

export default ForgotPasswordPage