import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import classNames from 'classnames/bind';

import { Button } from '~/components/index.js';
import routes from '~/config/routes.js';

import styles from './../Staff.module.scss';

const cx = classNames.bind(styles);

const ControlPanel = () => {
    const navigate = useNavigate();
    const goToAddStaff = () => {
        navigate(routes.staffAdd);
    };
    return (
        <div className={cx('control-panel')}>
            <Button primary leftIcon={<FontAwesomeIcon icon={faPlus}></FontAwesomeIcon>} onClick={goToAddStaff}>
                Thêm nhân viên mới
            </Button>
        </div>
    );
};

export default ControlPanel;
