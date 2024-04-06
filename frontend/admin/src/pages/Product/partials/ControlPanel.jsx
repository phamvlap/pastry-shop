import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

import classNames from 'classnames/bind';

import styles from '~/pages/Product/Product.module.scss';

const cx = classNames.bind(styles);

import { Button } from '~/components/index.js';

const ControlPanel = () => {
    const navigate = useNavigate();
    const toAddProduct = () => {
        navigate('/products/add');
    };
    return (
        <div className={cx('control-panel')}>
            <Button primary leftIcon={<FontAwesomeIcon icon={faPlus}></FontAwesomeIcon>} onClick={toAddProduct}>
                Thêm sản phẩm mới
            </Button>
        </div>
    );
};

export default ControlPanel;
