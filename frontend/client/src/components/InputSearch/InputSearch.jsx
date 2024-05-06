import slugify from 'slugify';
import { useState, useEffect, useRef } from 'react';
import { useSearchParams, useLocation, useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmarkCircle } from '@fortawesome/free-solid-svg-icons';

import useDebounce from '~/hooks/useDebounce.js';
import { ProductService } from '~/services/index.js';
import routes from '~/config/routes.js';

import styles from './InputSearch.module.scss';

const cx = classNames.bind(styles);

const InputSearch = () => {
    const [searchValue, setSearchValue] = useState('');
    const [searchValueView, setSearchValueView] = useState('');
    const [itemList, setItemList] = useState([]);
    const [showResult, setShowResult] = useState(false);
    const [searchParams, setSearchParams] = useSearchParams();

    const location = useLocation();
    const navigate = useNavigate();
    const debounceSearchValue = useDebounce(searchValue, 500);
    const wrapperRef = useRef(null);

    const fetchProductList = async () => {
        try {
            const productService = new ProductService();
            const response = await productService.getAll({
                product_slug: debounceSearchValue,
            });
            if (response.status === 'success') {
                const data = response.data.map((item) => {
                    return {
                        product_id: item.product_id,
                        product_name: item.product_name,
                    };
                });
                setItemList(data);
            }
        } catch (error) {
            console.log(error);
            setItemList([]);
        }
    };
    const handleSearchChange = (event) => {
        setSearchValue(
            slugify(event.target.value, {
                replacement: '_',
                lower: true,
                trim: true,
            }),
        );
        setSearchValueView(event.target.value);
        if (event.target.value.length === 0) {
            setSearchParams({});
        }
    };
    const useClickOutside = (ref) => {
        useEffect(() => {
            const handleClickOutside = (event) => {
                if (ref.current && !ref.current.contains(event.target)) {
                    setShowResult(false);
                }
            };
            document.addEventListener('mousedown', handleClickOutside);
            return () => {
                document.removeEventListener('mousedown', handleClickOutside);
            };
        });
    };
    const handleSubmitSearch = (event) => {
        event.preventDefault();
        if (searchValueView.length > 0) {
            navigate(`${routes.products}?search_name=${searchValue}`);
        } else {
            setSearchParams({});
        }
        setShowResult(false);
    };
    const handleClear = () => {
        setSearchValue('');
        setSearchValueView('');
        setItemList([]);
    };

    useClickOutside(wrapperRef);

    useEffect(() => {
        if (debounceSearchValue) {
            fetchProductList();
        } else {
            setItemList([]);
        }
    }, [debounceSearchValue]);

    useEffect(() => {
        if (location.search.includes('search_name')) {
            setSearchValue(searchParams.get('search_name'));
            setSearchValueView(searchParams.get('search_name'));
        }
    }, []);

    return (
        <div className={cx('wrapper')} ref={wrapperRef}>
            <form className={cx('container')} onSubmit={(event) => handleSubmitSearch(event)}>
                <div className={cx('input-wrapper')}>
                    <input
                        type="text"
                        name="input_search"
                        value={searchValueView}
                        className={cx('form-control', 'input-item')}
                        placeholder="Nhập tên sản phẩm..."
                        onChange={(event) => handleSearchChange(event)}
                        onFocus={() => setShowResult(true)}
                    />
                    {searchValueView.length > 0 && (
                        <FontAwesomeIcon
                            icon={faXmarkCircle}
                            className={cx('icon-clear')}
                            onClick={() => handleClear()}
                        />
                    )}
                </div>
                <button type="submit" className={cx('btn-wrapper')}>
                    <span>Tìm kiếm</span>
                </button>
            </form>
            <ul className={cx('hint-list')}>
                {itemList.length > 0 &&
                    showResult &&
                    itemList.map((item, index) => {
                        return (
                            index <= 9 && (
                                <li key={index} className={cx('hint-list__item')}>
                                    <Link to={`/product/${item.product_id}`} className={cx('hint-list__link')}>
                                        <span className={cx('hint-list__item-name')}>{item.product_name}</span>
                                    </Link>
                                </li>
                            )
                        );
                    })}
            </ul>
        </div>
    );
};

InputSearch.propTypes = {
    placeholder: PropTypes.string,
};

export default InputSearch;
