import { useState } from 'react';
import classNames from 'classnames/bind';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRotate } from '@fortawesome/free-solid-svg-icons';

import { FormSelect, InputSearch, Button } from '~/components/index.js';

import styles from './Customer.module.scss';

const cx = classNames.bind(styles);

const statusOptions = [
    {
        value: 'all',
        name: 'Tất cả',
    },
    {
        value: 'active',
        name: 'Đang hoạt động',
    },
    {
        value: 'inactive',
        name: 'Đã bị khóa',
    },
];

const SearchBar = ({ setCurrentFilter }) => {
    const [filter, setFilter] = useState({
        status: 'all',
        customer_name: '',
    });

    const handleChangeFilter = (event) => {
        setFilter({
            ...filter,
            [event.target.name]: event.target.value,
        });
    };
    const submitFilter = () => {
        setCurrentFilter(filter);
    };
    const handleSubmitSearch = () => {
        setCurrentFilter(filter);
    };
    const handleRefreshFilter = () => {
        setFilter({
            status: 'all',
            customer_name: '',
        });
        setCurrentFilter({
            status: 'all',
            customer_name: '',
        });
    };

    return (
        <div className={cx('searchbar-container')}>
            <div className={cx('filter-section')}>
                <div className={cx('filter-section__item')}>
                    <span className={cx('filter-section__text')}>Trạng thái tài khoản: </span>
                    <FormSelect
                        options={statusOptions}
                        name="status"
                        value={filter.status}
                        onChange={(event) => handleChangeFilter(event)}
                    />
                </div>
                <div className={cx('filter-section__item')}>
                    <Button primary className={cx('filter-section__btn')} onClick={() => submitFilter()}>
                        Lọc
                    </Button>
                </div>
            </div>
            <div className={cx('col col-sm-4', 'search-section')}>
                <InputSearch
                    placeholder="Nhập tên khách hàng cần tìm"
                    name="customer_name"
                    value={filter.customer_name}
                    onChange={(event) => handleChangeFilter(event)}
                    onSubmit={() => handleSubmitSearch()}
                />
                <Button outline className={cx('search-section__button')} onClick={handleRefreshFilter}>
                    <FontAwesomeIcon icon={faRotate} />
                </Button>
            </div>
        </div>
    );
};

SearchBar.propTypes = {
    setCurrentFilter: PropTypes.func,
};

export default SearchBar;
