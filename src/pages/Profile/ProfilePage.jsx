import React, { useEffect, useState } from "react"
import './ProfilePage.scss'
import InputFormComponent from "../../components/InputFormComponent/InputFormComponent"
import ButtonComponent from "../../components/ButtonComponent/ButtonComponent";
import LoadingComponent from '../../components/LoadingComponent/LoadingComponet'
import ModalComponent from "../../components/ModalComponent/ModalComponent";
import avatarImage from '../../assests/images/avatar-profiles.png'
import phoneIcon from '../../assests/images/phone-profile.png'
import emailIcon from '../../assests/images/email-profile.png'
import addressIcon from '../../assests/images/address-profile-3.jpg'
import lockIcon from '../../assests/images/lock-profile.png'
import * as userServices from '../../services/userServices'
import * as message from '../../components/Message/Message'
import { useMutationHooks} from '../../hooks/userMutationHook'
import { useDispatch, useSelector } from "react-redux";
import { Button, Form, Upload } from "antd";
import { EditOutlined } from '@ant-design/icons'
import { getBase64 } from "../../utils";
import { updateUser } from "../../redux/slices/userSlice";
import HeaderComponent from "../../components/HeaderComponent/HeaderComponent";
const ProfilePage = () => {
    const user = useSelector((state) => state.user);
    const [email, setEmail] = useState(user?.email);
    const [name, setName] = useState(user?.name);
    const [phone, setPhone] = useState(user?.phone);
    const [address, setAddress] = useState(user?.address);
    const [avatar, setAvatar] = useState(user?.avatar);
    const [userId, setUserId] = useState(user?.id);
    const [access_token, setAccess_Token] = useState(user?.access_token)

    const [isModalPhoneOpen, setIsModalPhoneOpen] = useState(false)
    const [isModalAddressOpen, setIsModalAddressOpen] = useState(false)
    const [isModalChangePasswordOpen, setIsModalChangePasswordOpen] = useState(false)
    const [password, setPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [isNotEqualPassword, setIsNotEqualPassword] = useState(false);
    const [isPasswordInCorrect, setIsPasswordInCorrect] = useState(false);
    const [isStateChangePassword, setIsStateChangePassword] = useState({
        isPasswordNull: false,
        isNewPasswordNull: false,
        isConfirmPasswordNull: false
    })
    const [form] = Form.useForm();
    const handleOnChangePassword = (e) => {
        setPassword(e.target.value);
    }
    const handleOnChangeNewPassword = (e) => {
        setNewPassword(e.target.value);
    }
    const handleOnChangeConfirmPassword = (e) => {
        setConfirmPassword(e.target.value);
    }
    const mutationChangePassword = useMutationHooks(
        (data) => {
            let { id, password, newPassword, access_token } = data;
            const res = userServices.changePassword(id, password, newPassword, access_token);
            return res;
        }
    )
    const handleCheckChangePassword = () => {
        setIsNotEqualPassword(false);
        setIsPasswordInCorrect(false);
        if (!password) {
            setIsStateChangePassword({
                ...isStateChangePassword,
                isPasswordNull: true
            })
            setTimeout(() => {
                setIsStateChangePassword({
                    ...isStateChangePassword,
                    isPasswordNull: false
                })
            }, 2000)
        } else if (!newPassword) {
            setIsStateChangePassword({
                ...isStateChangePassword,
                isNewPasswordNull: true
            })
            setTimeout(() => {
                setIsStateChangePassword({
                    ...isStateChangePassword,
                    isNewPasswordNull: false
                })
            }, 2000)
        } else if (!confirmPassword) {
            setIsStateChangePassword({
                ...isStateChangePassword,
                isConfirmPasswordNull: true
            })
            setTimeout(() => {
                setIsStateChangePassword({
                    ...isStateChangePassword,
                    isConfirmPasswordNull: true
                })
            }, 2000)
        } else {
            if (newPassword !== confirmPassword) {
                setIsNotEqualPassword(true);
                setTimeout(() => {
                    setIsNotEqualPassword(false);
                }, 1000);
            } else {
                mutationChangePassword.mutate({ id: user?.id, password, newPassword, access_token: user?.access_token });
            }
        }
    }

    const dispatch = useDispatch();
    const handlePhoneCancel = () => {
        setIsModalPhoneOpen(false)
    }
    const handleAddressCancel = () => {
        setIsModalAddressOpen(false)
    }
    const handleChangePasswordCancel = () => {
        setIsModalChangePasswordOpen(false);
        setPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setIsPasswordInCorrect(false);
    }
    // CÁC HANDLE ONCHANGE
    const handleOnChangeEmail = (e) => {
        setEmail(e.target.value);
    }
    const handleOnChangeName = (e) => {
        setName(e.target.value);
    }
    const handleOnChangePhone = (e) => {
        setPhone(e.target.value);
    }
    const handleOnChangeAddress = (e) => {
        setAddress(e.target.value);
    }
    const handleOnChangeAvatar = async ({fileList}) => {
        const file = fileList[0];
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        setAvatar(file.preview)
    }
    // CÁC QUERY VÀ MUTATION
    const mutation = useMutationHooks(
        (data) => userServices.updateUser(data)
    )
    const { data, isLoading, isSuccess, isError } = mutation;
    const { data: dataChangePassword, isLoading: isLoadingChangePassword, isSuccess: isSuccessChangePassword, isError: isErrorChangePassword } = mutationChangePassword;
    useEffect(() => {
        if(isSuccess){
            message.success('Thay đổi thành công');
            if (isModalPhoneOpen) {
                setIsModalPhoneOpen(false);
            }
            if (isModalAddressOpen) {
                setIsModalAddressOpen(false);
            }
            handleGetDetailsUser(user?.id, user?.access_token);
        }
    }, [isSuccess, isError])
    useEffect(() => {
        setEmail(user?.email);
        setName(user?.name);
        setPhone(user?.phone);
        setAddress(user?.address);
        setAvatar(user?.avatar);
        setUserId(user?.id);
        setAccess_Token(user?.access_token)
    }, [user])
    useEffect(() => {
        console.log('dataChangePassword', dataChangePassword)
        if (isSuccessChangePassword && dataChangePassword?.message === "The password is incorrect") {
            setIsPasswordInCorrect(true);
            setTimeout(() => {
                setIsPasswordInCorrect(false);
            }, 1000);
        } else if (isSuccessChangePassword && dataChangePassword?.message === "CHANGE PASSWORD SUCCESS") {
            message.success('Cập nhật mật khẩu thành công');
            setIsPasswordInCorrect(false);
            handleChangePasswordCancel();
        }
    }, [isSuccessChangePassword, isErrorChangePassword, dataChangePassword])
    const handleUpdate = async () => {
        mutation.mutate({ id: userId, email, name, phone, address, avatar, access_token }, {
            onSuccess: () => {
                dispatch(updateUser({name, email, phone, address, avatar}))
            }
        });
    }
    const handleGetDetailsUser = async (id, access_token) => {
        const res = await userServices.getDetailsUser(id, access_token);
        return res.data;
    }
    return (
        <>
            <HeaderComponent isHiddenCart isHiddenSearch/>
            <div style={{padding: '0 120px', backgroundColor: '#f5f5fa'}}>
                <div className="profile-page-container">
                    <h1>Thông tin tài khoản</h1>
                    <LoadingComponent isLoading={isLoading}>
                    <div className="content-profile">
                        <div className="content-left">
                            <span className="info-title">Thông tin cá nhân</span>
                            <div className="info-left">
                                <div className="info-user">
                                    <div className="info-avatar">
                                        {/* <label htmlFor="avatar" className="form-label">Avatar</label> */}
                                        <Upload onChange={(e) => handleOnChangeAvatar(e)} maxCount={1}>
                                            <div style={{ width: '120px', height: '120px', position: 'relative'}}>
                                                <div style={{
                                                    width: '100%', height: '100%', display: 'flex',
                                                    alignItems: 'center', justifyContent: 'center', borderRadius: '50%',
                                                    backgroundColor: '#f0f8ff', border: '4px solid #c2e1ff', boxSizing: 'border-box',
                                                }}>
                                                {avatar ? 
                                                    <img src={avatar} style={{
                                                        height: '100%',
                                                        width: '100%',
                                                        borderRadius: '50%',
                                                        objectFit: 'cover'
                                                    }} alt="avatar" />
                                                    :
                                                    <img src={avatarImage} style={{
                                                        width: '40%',
                                                        height: '40%',
                                                    }}/>    
                                                }
                                                </div>
                                                <Button icon={<EditOutlined style={{fontSize: '11px'}}/>}
                                                    style={{
                                                        position: 'absolute', bottom: '5px', right: '14px',
                                                        width: '18px', height: '18px', borderRadius: '50%',
                                                        display: 'flex', justifyContent: 'center', alignItems: 'center'
                                                    }}>
                                                </Button>
                                            </div>
                                        </Upload>
                                    </div>
                                    <div className="info-name">
                                        <div className="user-id">
                                            <label>ID Name</label>
                                            <div style={{marginLeft: '4px'}}>{ user?.id }</div>
                                        </div>
                                        <div className="name-user">
                                            <label htmlFor="name" className="form-label">Tên người dùng</label>
                                            <InputFormComponent id="name" value={name} onChange={(e) => handleOnChangeName(e)}
                                                className="form-input"
                                                // bordered={false}
                                            />
                                        </div>
                                        <ButtonComponent
                                            onClick={() => handleUpdate()}
                                            size={40}
                                            styleButton={{
                                                height: '35px',
                                                width: '180px',
                                                borderRadius: '4px',
                                                border: '0px',
                                                color: '#fff',
                                                backgroundColor: '#0b74e5',
                                                fontSize: '14px',
                                                cursor: 'pointer',
                                                marginTop: '40px'
                                            }}
                                            textButton={'Lưu thay đổi'}
                                            styleTextButton={{ color: '#fff', fontSize: '14px' }}
                                            className="btn-save-all"
                                        />
                                    </div> 
                                </div>
                                
                            </div>
                        </div>
                        <div className="content-vertical"></div>
                        <div className="content-right">
                            <span className="info-title">Số điện thoại và Email</span>
                            <div className="info-item">
                                <div className="list-item">
                                    <div className="info">
                                        <img src={phoneIcon} style={{width: '18px', height: '18px'}}/>
                                        <div className="details">
                                            <span>Số điện thoại</span>
                                            <span>{ phone ? phone : '' }</span>
                                        </div>
                                    </div>
                                    <div className="status">
                                        <span></span>
                                        <ButtonComponent
                                            onClick={() => setIsModalPhoneOpen(true)}
                                            size={40}
                                            styleButton={{
                                                height: '28px',
                                                width: '80px',
                                                borderRadius: '4px',
                                                border: '1px solid #0b74e5',
                                                fontSize: '14px',
                                                cursor: 'pointer',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                            }}
                                            textButton={'Cập nhật'}
                                            styleTextButton={{ color: '#0b74e5', fontSize: '14px'}}
                                        />
                                    </div>
                                </div>
                                <div className="list-item" style={{borderTop: '1px solid rgb(235, 235, 240)'}}>
                                    <div className="info">
                                        <img src={emailIcon} style={{width: '18px', height: '18px'}}/>
                                        <div className="details">
                                            <span>Tài khoản</span>
                                            <span>{ email }</span>
                                        </div>
                                    </div>
                                </div>     
                            </div>
                            <span className="info-title">Thông tin địa chỉ</span>
                            <div className="info-item">
                                <div className="list-item">
                                    <div className="info">
                                        <img src={addressIcon} style={{width: '18px', height: '18px'}}/>
                                        <div className="details">
                                            <span>Địa chỉ</span>
                                            <span>{ address ? address : 'Không có' }</span>
                                        </div>
                                    </div>
                                    <div className="status">
                                        <span></span>
                                        <ButtonComponent
                                            onClick={() => setIsModalAddressOpen(true)}
                                            size={40}
                                            styleButton={{
                                                height: '28px',
                                                width: '80px',
                                                borderRadius: '4px',
                                                border: '1px solid #0b74e5',
                                                fontSize: '14px',
                                                cursor: 'pointer',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                // marginLeft: 'auto'
                                            }}
                                            textButton={'Cập nhật'}
                                            styleTextButton={{ color: '#0b74e5', fontSize: '14px'}}
                                        />
                                    </div>
                                </div>
                            </div>
                            <span className="info-title">Bảo mật</span>
                            <div className="info-item">
                                <div className="list-item">
                                    <div className="info">
                                        <img src={lockIcon} style={{width: '18px', height: '18px'}}/>
                                        <div className="details">
                                            <span>Mật khẩu</span>
                                        </div>
                                    </div>
                                    <div className="status">
                                        <span></span>
                                        <ButtonComponent
                                            onClick={() => setIsModalChangePasswordOpen(true)}
                                            size={40}
                                            styleButton={{
                                                height: '28px',
                                                width: '80px',
                                                borderRadius: '4px',
                                                border: '1px solid #0b74e5',
                                                fontSize: '14px',
                                                cursor: 'pointer',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                            }}
                                            textButton={'Cập nhật'}
                                            styleTextButton={{ color: '#0b74e5', fontSize: '14px'}}
                                        />
                                    </div>
                                </div>
                            </div>    
                        </div>
                    </div>
                    <ModalComponent forceRender title="Cập nhật số điện thoại" open={isModalPhoneOpen} footer={null} onCancel={handlePhoneCancel}>
                        <div style={{
                            width: '100%', padding: '8px 16px', border: '1px solid #ebebf0',
                            boxSizing: 'border-box', borderRadius: '4px'
                        }}>
                            <span style={{color: '#38383d', fontSize: '14px', marginBottom: '4px'}}>Số điện thoại</span>
                            <InputFormComponent id="phone" value={phone} onChange={(e) => handleOnChangePhone(e)}
                                className="form-input"
                            />
                            <ButtonComponent
                                onClick={() => handleUpdate()}
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
                                textButton={'Lưu thay đổi'}
                                styleTextButton={{ color: '#fff', fontSize: '14px'}}
                            />
                        </div>
                    </ModalComponent>
                    <ModalComponent forceRender title="Cập nhật địa chỉ" open={isModalAddressOpen} footer={null} onCancel={handleAddressCancel}>
                        <div style={{
                            width: '100%', padding: '8px 16px', border: '1px solid #ebebf0',
                            boxSizing: 'border-box', borderRadius: '4px'
                        }}>
                            <span style={{color: '#38383d', fontSize: '14px', marginBottom: '4px'}}>Địa chỉ</span>
                            <InputFormComponent id="address" value={address} onChange={(e) => handleOnChangeAddress(e)}
                                className="form-input"
                            />
                            <ButtonComponent
                                onClick={() => handleUpdate()}
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
                                textButton={'Lưu thay đổi'}
                                styleTextButton={{ color: '#fff', fontSize: '14px'}}
                            />
                        </div>
                    </ModalComponent>
                    <ModalComponent forceRender title="Đổi mật khẩu" open={isModalChangePasswordOpen} footer={null} onCancel={handleChangePasswordCancel}>
                        <div style={{
                            width: '100%', padding: '8px 16px', border: '1px solid #ebebf0',
                            boxSizing: 'border-box', borderRadius: '4px'
                        }}>
                            <span style={{color: '#38383d', fontSize: '14px', marginBottom: '4px'}}>Mật khẩu hiện tại</span>
                            <InputFormComponent id="password" name="password" value={password} onChange={(e) => handleOnChangePassword(e)}
                                className="form-input" type='password'
                            />
                            {isStateChangePassword.isPasswordNull && <div><span style={{fontSize: '10px', color: 'red', fontWeight: '400'}}>Không để trống thông tin</span></div>}        
                            {isPasswordInCorrect && <div><span style={{fontSize: '10px', color: 'red', fontWeight: '400'}}>Mật khẩu không đúng</span></div>}    
                            <span style={{color: '#38383d', fontSize: '14px', marginBottom: '4px'}}>Mật khẩu mới</span>
                            <InputFormComponent id="newPassword" value={newPassword} onChange={(e) => handleOnChangeNewPassword(e)}
                                className="form-input" type='password'
                            />
                            {isStateChangePassword.isNewPasswordNull && <div><span style={{fontSize: '10px', color: 'red', fontWeight: '400'}}>Không để trống thông tin</span></div>}    
                            {isNotEqualPassword && <div><span style={{fontSize: '10px', color: 'red', fontWeight: '400'}}>Mật khẩu không trùng khớp</span></div>}
                            <span style={{color: '#38383d', fontSize: '14px', marginBottom: '4px'}}>Xác nhận mật khẩu</span>
                            <InputFormComponent id="confirmPassword" value={confirmPassword} onChange={(e) => handleOnChangeConfirmPassword(e)}
                                className="form-input" type='password'
                            />
                            {isStateChangePassword.isConfirmPasswordNull && <div><span style={{fontSize: '10px', color: 'red', fontWeight: '400'}}>Không để trống thông tin</span></div>}    
                            {isNotEqualPassword && <div><span style={{fontSize: '10px', color: 'red', fontWeight: '400'}}>Mật khẩu không trùng khớp</span></div>}
                            <ButtonComponent
                                onClick={() => handleCheckChangePassword()}
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
                                textButton={'Lưu thay đổi'}
                                styleTextButton={{ color: '#fff', fontSize: '14px'}}
                            />
                        </div>
                    </ModalComponent>
                    </LoadingComponent>
                </div>
            </div>
        </>
    )
}

export default ProfilePage