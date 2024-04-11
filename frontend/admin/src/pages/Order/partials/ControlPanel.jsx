import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import classNames from 'classnames/bind';

import InputSearch from '~/components/InputSearch/InputSearch.jsx';
import InputItem from '~/components/InputItem/InputItem.jsx';
import Button from '~/components/Button/Button.jsx';

import styles from '~/pages/Order/Order.module.scss';

const cx = classNames.bind(styles);

const ControlPanel = () => {
    // const navigate = useNavigate();
    return (
        <div className={cx('control-panel')}>
            <div className={cx('panel-item')}>
                <div className={cx('panel-item__period')}>
                    <span className={cx('panel-item__text')}>Từ</span>
                    <InputItem type="date" />
                    <span className={cx('panel-item__text')}>đến</span>
                    <InputItem type="date" />
                    <div className={cx('panel-item__button')}>
                        <Button primary>Tìm</Button>
                    </div>
                </div>
            </div>
            <div className={cx('panel-item')}>
                <InputSearch placeholder="Nhập mã đơn hàng" />
            </div>
        </div>
    );
};

export default ControlPanel;
