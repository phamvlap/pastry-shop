import { Link } from 'react-router-dom';
import classNames from 'classnames/bind';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faInstagram, faYoutube } from '@fortawesome/free-brands-svg-icons';

import styles from '~/layouts/Layout.module.scss';

const cx = classNames.bind(styles);

const Footer = ({ className }) => {
    return (
        <div className={cx('footer-wrapper', className)}>
            <div className={cx('container', 'footer')}>
                <div className="row p-3">
                    <div className="col col-md-7">
                        <h3>Thông tin liên hệ</h3>
                        <ul className="list-unstyled m-0">
                            <li className="py-2">
                                Địa chỉ: đường 3/2, phường Xuân Khánh, quận Ninh Kiều, thành phố Cần Thơ
                            </li>
                            <li className="py-2">Email: lapb2105580@student.ctu.edu.vn</li>
                        </ul>
                    </div>
                    <div className="col col-md-5">
                        <div className="row">
                            <div className="col-md-6 p-2">
                                <h3>Về chúng tôi</h3>
                                <ul className="list-unstyled m-0 mt-2 ms-3">
                                    <li className="my-2">
                                        <Link to="/about">Giới thiệu</Link>
                                    </li>
                                    <li className="my-2">
                                        <Link to="#">Liên hệ</Link>
                                    </li>
                                    <li className="my-2">
                                        <Link to="#">Hỏi đáp</Link>
                                    </li>
                                </ul>
                            </div>
                            <div className="col-md-6 p-2">
                                <h3>Kết nối với chúng tôi tại</h3>
                                <ul className="list-unstyled m-0 mt-2 ms-3">
                                    <li className="my-2">
                                        <a href="#" className={cx('footer-link__item')}>
                                            <FontAwesomeIcon icon={faFacebook} />
                                            <span className="col col-md-8">Facebook</span>
                                        </a>
                                    </li>
                                    <li className="my-2">
                                        <a href="#" className={cx('footer-link__item')}>
                                            <FontAwesomeIcon icon={faInstagram} />
                                            <span className="col col-md-8">Instagram</span>
                                        </a>
                                    </li>
                                    <li className="my-2">
                                        <a href="#" className={cx('footer-link__item')}>
                                            <FontAwesomeIcon icon={faYoutube} />
                                            <span className="col col-md-8">Youtube</span>
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

Footer.propTypes = {
    className: PropTypes.string,
};

export default Footer;
