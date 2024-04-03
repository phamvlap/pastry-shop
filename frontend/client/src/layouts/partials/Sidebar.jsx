import { useState, useEffect } from 'react';
import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';

import { CategoryService } from '~/services/index.js';

import styles from '~/layouts/Layout.module.scss';

const cx = classNames.bind(styles);

const Sidebar = () => {
    const [active, setActive] = useState(-1);
    const [cateogries, setCategories] = useState([]);

    useEffect(() => {
        const fetchCategories = async () => {
            const categoryService = new CategoryService();
            const response = await categoryService.getAll();
            setCategories(response.data);
        };
        fetchCategories();
    }, []);

    return (
        <div className={cx('sidebar-wrapper')}>
            <h2 className={cx('sidebar-header')}>
                <span className={cx('sidebar-header__logo')}>
                    <FontAwesomeIcon icon={faBars} />
                </span>
                <span className={cx('sidebar-header__title')}>Danh mục sản phẩm</span>
            </h2>
            <ul className={cx('sidebar-list')}>
                {cateogries.map((category) => {
                    const classes = cx('sidebar-list__item', {
                        'sidebar-list__item-active': active === category.category_id,
                    });
                    return (
                        <li
                            key={category.category_id}
                            className={classes}
                            onClick={() => setActive(category.category_id)}
                        >
                            {category.category_name}
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};

export default Sidebar;
