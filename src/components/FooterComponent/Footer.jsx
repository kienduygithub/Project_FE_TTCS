import React from "react";
import './Footer.scss';
import gojekLogo from '../../assests/images/gojek_logo.png'
const Footer = ({isHiddenFooter}) => {
    return (
        <div>
        {
            isHiddenFooter ?
                <></>
                :
                <div className="footer-component">
                    <div className="footer-col">
                        <h4>Hỗ trợ khách hàng</h4>
                        <p className="hotline">
                            Hotline: 
                            <a href="tel:+84839822333">&nbsp;<span>1900-0000</span></a>
                        </p>
                        <span style={{marginTop: '-5px'}}>Các câu hỏi thường gặp</span>
                        <span>Gửi yêu cầu hỗ trợ</span>
                        <span>Hỗ trợ khách hàng: hotro@gmail.com</span>
                    </div>
                    <div className="footer-col">
                        <h4>Về cửa hàng</h4>
                        <span>Giới thiệu cửa hàng</span>
                        <span>Chính sách bảo mật thông tin cá nhân</span>
                        <span>Điều khoản sử dụng</span>
                        <span>Điều kiện vận chuyển</span>
                    </div>
                    <div className="footer-col">
                        <h4>Hợp tác và liên kết</h4>
                        <span>Quy chế hoạt động sàn GDTMĐT</span>
                        <span>Bán hàng cùng Cửa hàng di động</span>
                        <h4>Dịch vụ giao hàng</h4>
                        <span><img src={gojekLogo} style={{width: '80px', height:'20px', margin: '0'}}/></span>
                    </div>
                    <div className="footer-col">
                        <h4>Kết nối với chúng tôi</h4>
                        <div className="social-connect">
                            <div className="social-icon facebook">
                                <i class="fa-brands fa-facebook-f"></i>
                            </div>
                            <div className="social-icon youtube">
                                <i class="fa-brands fa-youtube"></i>
                            </div>
                            <div className="social-icon google">
                                <i className="fa-brands fa-google"></i>
                            </div>
                        </div>
                    </div>
                </div>
        }
        </div>
    )
}

export default Footer;