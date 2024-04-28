import { useState } from 'react';
import classNames from 'classnames/bind';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRotate } from '@fortawesome/free-solid-svg-icons';

import { FormSelect, InputSearch, Button } from '~/components/index.js';
import UserRole from '~/enums/UserRole.js';

import styles from './../Staff.module.scss';

const cx = classNames.bind(styles);

let roles = [
    {
        value: 'all',
        name: 'Tất cả',
    },
];
roles.push(
    ...['STAFF', 'ADMIN', 'MANAGER'].map((role) => {
        return {
            value: role,
            name: UserRole.retrieveRole(role),
        };
    }),
);
const SearchBar = ({ setCurrentFilter }) => {
    const [filter, setFilter] = useState({
        staff_role: 'all',
        staff_name: '',
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
            staff_role: 'all',
            staff_name: '',
        });
        setCurrentFilter({
            staff_role: 'all',
            staff_name: '',
        });
    };

    return (
        <div className={cx('searchbar-container')}>
            <div className={cx('filter-section')}>
                <div className={cx('filter-section__item')}>
                    <span className={cx('filter-section__text')}>Vai trò: </span>
                    <FormSelect
                        options={roles}
                        name="staff_role"
                        value={filter.staff_role}
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
                    placeholder="Nhập tên nhân viên cần tìm"
                    name="staff_name"
                    value={filter.staff_name}
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
    setRecordsPerPage: PropTypes.func,
    setCurrentFilter: PropTypes.func,
};

export default SearchBar;
