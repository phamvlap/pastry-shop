import { useState, useEffect } from 'react';
import classNames from 'classnames/bind';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRotate } from '@fortawesome/free-solid-svg-icons';

import { FormSelect, InputSearch, Button } from '~/components/index.js';
import { CategoryService } from '~/services/index.js';

import styles from './../Product.module.scss';

const cx = classNames.bind(styles);

const recordsPerPageOptions = [
    {
        value: 8,
        name: 8,
    },
    {
        value: 12,
        name: 12,
    },
    {
        value: 16,
        name: 16,
    },
];
const statusOptions = [
    {
        value: 'all',
        name: 'Tất cả',
    },
    {
        value: 'in-stock',
        name: 'Còn hàng',
    },
    {
        value: 'out-stock',
        name: 'Hết hàng',
    },
];

const SearchBar = ({ setRecordsPerPage, setCurrentFilter }) => {
    const [categoryOptions, setCategoryOptions] = useState([]);
    const [filter, setFilter] = useState({
        status: 'all',
        category_id: 'all',
        product_name: '',
    });

    const categoryService = new CategoryService();

    useEffect(() => {
        categoryService.getAll().then((res) => {
            let options = [
                {
                    value: 'all',
                    name: 'Tất cả',
                },
            ];
            for (const item of res.data) {
                options.push({
                    value: item.category_id,
                    name: item.category_name,
                });
            }
            setCategoryOptions(options);
        });
    }, []);

    const handleChangeRecordsPerPage = (event) => {
        setRecordsPerPage(Number(event.target.value));
    };
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
        console.log(filter);
        setCurrentFilter(filter);
    };
    const handleRefreshFilter = () => {
        setFilter({
            status: 'all',
            category_id: 'all',
            product_name: '',
        });
        setCurrentFilter({
            status: 'all',
            category_id: 'all',
            product_name: '',
        });
    };

    return (
        <div className={cx('searchbar-container')}>
            <div className={cx('select-section')}>
                <div className={cx('select-section__item')}>Hiển thị</div>
                <div className={cx('select-section__item')}>
                    <FormSelect
                        options={recordsPerPageOptions}
                        onChange={(event) => handleChangeRecordsPerPage(event)}
                    />
                </div>
                <div className={cx('select-section__item')}>sản phẩm</div>
            </div>
            <div className={cx('filter-section')}>
                <div className={cx('filter-section__item')}>
                    <span className={cx('filter-section__text')}>Trạng thái: </span>
                    <FormSelect
                        options={statusOptions}
                        name="status"
                        value={filter.status}
                        onChange={(event) => handleChangeFilter(event)}
                    />
                </div>
                <div className={cx('filter-section__item')}>
                    <span className={cx('filter-section__text')}>Danh mục: </span>
                    <FormSelect
                        options={categoryOptions}
                        name="category_id"
                        value={filter.category_id}
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
                    placeholder="Nhập tên sản phẩm cần tìm"
                    name="product_name"
                    value={filter.product_name}
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
