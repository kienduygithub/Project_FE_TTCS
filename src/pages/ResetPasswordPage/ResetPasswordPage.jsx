import React, { useEffect, useState } from "react";
import './ResetPasswordPage.scss'
import InputFormComponent from "../../components/InputFormComponent/InputFormComponent";
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent'
import ImageLogo from '../../assests/images/Login/SignIn.png'
import { Image } from "antd";
import { EyeInvisibleOutlined, EyeOutlined } from "@ant-design/icons";
import { useLocation, useNavigate } from "react-router";
import * as userServices from '../../services/userServices'
import * as message from '../../components/Message/Message'
import { useMutationHooks } from '../../hooks/userMutationHook'
import LoadingComponent from "../../components/LoadingComponent/LoadingComponet";
import ModalComponent from "../../components/ModalComponent/ModalComponent";
import arrowBack from '../../assests/images/arrow-back.jpg'
const ResetPasswordPage = () => {
    const [isShow, setIsShow] = useState(false);
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isEqualPassword, setIsEqualPassword] = useState(true);
    const [otp, setOtp] = useState('');
    const [isValidOtp, setIsValidOtp] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const location = useLocation();
    const { state } = location;
    const navigate = useNavigate()
    const ShowHide = () => {
        setIsShow(!isShow)
    }

    let mutationReset = useMutationHooks(
        async (data) => await userServices.resetPassword(data)
    )
    const mutationVerify = useMutationHooks(
        (data) => {
            const { otp } = data;
            const res = userServices.verifyOTP(otp)
            return res;
        }
    )
    const mutationResend = useMutationHooks(
        (data) => {
            const { email } = data;
            const res = userServices.forgotPassword({ email: email });
            return res;
        }
    )
    const { data: dataReset, isLoading: isLoadingReset, isSuccess: isSuccessReset, isError: isErrorReset } = mutationReset;
    const { data: dataVerify, isLoading: isLoadingVerify, isSuccess: isSuccessVerify, isError: isErrorVerify } = mutationVerify;
    const { data: dataResend, isLoading: isLoadingResend, isSuccess: isSuccessResend, isError: isErrorResend } = mutationResend;
    const handleOnChangeOTP = (e) => {
        setOtp(e.target.value);
    }
    const handleOnchangePassword = (e) => {
        setPassword(e.target.value);
    }
    const handleOnchangeConfirmPassword = (e) => {
        setConfirmPassword(e.target.value);
    }
    const handleResetPassword = () => {
        if (password !== confirmPassword) {
            setIsEqualPassword(false);
            setTimeout(() => {
                setIsEqualPassword(true);
            }, 2000)
        } else {
            mutationReset.mutate({ otp: otp, password: password })   
        }
    }
    const handleCheckOTP = () => {
        mutationVerify.mutate({otp: otp})
    }
    const handleResendOTP = () => {
        mutationResend.mutate({email: state?.email})
    }
    const handleBack = () => {
        navigate(state?.path)
    }
    useEffect(() => {
        if (isSuccessReset && dataReset?.message === 'RESET PASSWORD SUCCESS') {
            message.success('Cập nhập lại thành công');
            setIsModalOpen(true);
        } else if (isSuccessReset && dataReset?.status === 'ERR') {
            message.error('Cập nhật thất bại');
        } else if (isErrorReset) {
            message.error('Vui lòng kiểm tra lại')
        }
    }, [dataReset])
    useEffect(() => {
        if (isSuccessVerify && dataVerify?.status === 'OK') {
            message.success('Mã OTP hợp lệ');
            setIsValidOtp(true);
        } else if (isErrorVerify) {
            message.error('Vui lòng kiểm tra lại')
        } else if (dataVerify?.message === 'INVALID OTP') {
            message.error('Mã OTP không hợp lệ')
        }
    }, [isSuccessVerify, isErrorVerify, dataVerify])
    useEffect(() => {
        if (isSuccessResend && dataResend?.status === 'OK') {
            message.success('Vui lòng kiểm tra mã OTP');
        } else if (isErrorResend) {
            message.error('Vui lòng kiểm tra lại')
        }
    }, [isSuccessResend, isErrorResend, dataResend])
    const handleCancelOpen = () => {
        setIsModalOpen(false);
    }
    
    return(
        <div className="background">
            <LoadingComponent isLoading={isLoadingReset || isLoadingResend || isLoadingVerify}>
                <div className="sign-in-container">
                    <div className="container-left">
                        <div style={{display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer'}} onClick={() => handleBack()}>
                            <img src={arrowBack} style={{width: '10px'}} />
                            <span style={{fontSize: '12px', color: '#64646d'}}>Trở về</span>
                        </div>
                        {!isValidOtp ? 
                            <div>
                                <h1 style={{margin: '10px 0 0'}}>Xin chào,</h1>
                                <p>Vui lòng xác nhận OTP</p>
                                <div className="input-otp">
                                    <InputFormComponent
                                        className="input"
                                        placeholder=""
                                        type="text"
                                        valueInput={otp}
                                        onChange={(e) => handleOnChangeOTP(e)}
                                    />
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span style={{ color: '#0b74e5', fontSize: '10px', fontWeight: 'bold', userSelect: 'none' }}>Lấy mã tại gmail của bạn</span>
                                    <span onClick={() => handleResendOTP()} style={{ color: '#0b74e5', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer', position: 'relative' }} className="resend">
                                        Gửi lại OTP
                                        <span className="resend-decorate"></span>
                                    </span>
                                </div>
                                <ButtonComponent
                                    disabled={!otp ? true : false}
                                    onClick={() => handleCheckOTP()}
                                    size={40}
                                    styleButton={{
                                        backgroundColor: 'rgb(255, 57, 69)',
                                        height: '35px',
                                        width: '100%',
                                        border: 'none',
                                        borderRadius: '5px',
                                        margin: '26px 0 10px'
                                    }}
                                    textButton={'Xác nhận'}
                                    styleTextButton={{color: 'white', fontSize: '14px', fontWeight: 'bold'}}
                                />
                            </div>
                            :
                            <div>
                                <h1>Xin chào,</h1>
                                <p>Nhập thông tin để thay đổi tài khoản của bạn</p>
                                <div className="input-password">
                                    <input value={otp} type="text" hidden/>
                                    <InputFormComponent 
                                        className="input"
                                        placeholder="New password"
                                        type={isShow ? 'text' : 'password'}
                                        valueInput={password}
                                        onChange={(e) => handleOnchangePassword(e)}
                                    />
                                    <span className="text-showhide" onClick={() => ShowHide()}>
                                        {isShow === false ? <EyeInvisibleOutlined /> : <EyeOutlined />}
                                    </span>
                                    {!isEqualPassword && <span style={{color: 'red', fontWeight: '400', fontSize: '11px'}}>Mật khẩu không trùng khớp</span>}
                                </div>
                                <div className="input-password">
                                    <InputFormComponent 
                                        className="input"
                                        placeholder="Confirm password"
                                        type={isShow ? 'text' : 'password'}
                                        valueInput={confirmPassword}
                                        onChange={(e) => handleOnchangeConfirmPassword(e)}
                                    />
                                    <span className="text-showhide" onClick={() => ShowHide()}>
                                        {isShow === false ? <EyeInvisibleOutlined /> : <EyeOutlined />}
                                    </span>
                                    {!isEqualPassword && <span style={{color: 'red', fontWeight: '400', fontSize: '11px'}}>Mật khẩu không trùng khớp</span>}
                                </div>
                                <ButtonComponent 
                                    disabled={
                                        !password.length || !confirmPassword.length ? 
                                        true : false
                                    }
                                    onClick={() => handleResetPassword()}
                                    size={40}
                                    styleButton={{
                                        backgroundColor: 'rgb(255, 57, 69)',
                                        height: '35px',
                                        width: '100%',
                                        border: 'none',
                                        borderRadius: '5px',
                                        margin: '26px 0 10px'
                                    }}
                                    textButton={'Cập nhật mật khẩu mới'}
                                    styleTextButton={{
                                        color: '#fff', fontSize: '15px', fontWeight: '700'
                                    }}
                                />
                            </div>
                        }
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
            <ModalComponent forceRender title="Cập nhật thành công" open={isModalOpen} footer={null} onCancel={handleCancelOpen}>
                <div style={{
                    width: '100%', padding: '8px 16px', border: '1px solid #ebebf0',
                    boxSizing: 'border-box', borderRadius: '4px'
                }}>
                    <span style={{color: '#38383d', fontSize: '14px', marginBottom: '4px'}}>Bạn muốn quay lại để đăng nhập ? </span>
                    <ButtonComponent
                        onClick={() => navigate('/sign-in')}
                        size={40}
                        styleButton={{
                            height: '35px',
                            width: '100%',
                            borderRadius: '4px',
                            border: '0px',
                            color: '#fff',
                            backgroundColor: '#0b74e5',
                            fontSize: '14px',
                            cursor: 'pointer',
                            marginTop: '10px'
                        }}
                        textButton={'Chấp nhận'}
                        styleTextButton={{ color: '#fff', fontSize: '14px'}}
                    />
                </div>
            </ModalComponent>
        </div>
    )
}

export default ResetPasswordPage