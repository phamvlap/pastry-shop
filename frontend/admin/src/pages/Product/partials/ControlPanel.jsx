import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import classNames from 'classnames/bind';

import { Button } from '~/components/index.js';
import routes from '~/config/routes.js';

import styles from '~/pages/Product/Product.module.scss';

const cx = classNames.bind(styles);

const ControlPanel = () => {
    const navigate = useNavigate();
    const toAddProduct = () => {
        navigate(routes.productAdd);
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
