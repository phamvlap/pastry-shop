import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import classNames from 'classnames/bind';
import { InputItem, Button } from '~/components/index.js';

import styles from './InputSearch.module.scss';

const cx = classNames.bind(styles);

const InputSearch = ({ placeholder, name, value, onChange, onSubmit }) => {
    return (
        <div className={cx('input-group', 'input-search-container')}>
            <InputItem name={name} value={value} onChange={onChange} type="text" placeholder={placeholder} />
            <Button primary onClick={onSubmit}>
                <FontAwesomeIcon icon={faSearch} />
            </Button>
        </div>
    );
};

InputSearch.propTypes = {
    placeholder: PropTypes.string,
    name: PropTypes.string,
    value: PropTypes.string,
    onChange: PropTypes.func,
    onSubmit: PropTypes.func,
};

export default InputSearch;
