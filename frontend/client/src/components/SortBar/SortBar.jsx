import { useState, useEffect } from 'react';
import classNames from 'classnames/bind';
import PropTypes from 'prop-types';

import { Button, FormSelect } from '~/components/index.js';
import styles from '~/components/SortBar/SortBar.module.scss';

const cx = classNames.bind(styles);

const SortBar = ({ filter, setFilter }) => {
    const [activeSortButton, setActiveSortButton] = useState(false);
    const [activeAllButton, setActiveAllButton] = useState(false);

    let options = [
        {
            name: 'Mặc định',
            value: 'default',
        },
        {
            name: 'Giá: Thấp đến cao',
            value: 'asc',
        },
        {
            name: 'Giá: Cao đến thấp',
            value: 'desc',
        },
    ];

    const handleChangeToNewest = () => {
        if (Object.prototype.hasOwnProperty.call(filter, 'createdAtOrder')) {
            setFilter((prevFilter) => {
                let newFilter = {};
                Object.keys(prevFilter).forEach((key) => {
                    if (key !== 'createdAtOrder') {
                        newFilter[key] = prevFilter[key];
                    }
                });
                return newFilter;
            });
            setActiveSortButton(false);
        } else {
            setFilter((prevFilter) => {
                return {
                    ...prevFilter,
                    createdAtOrder: 'desc',
                };
            });
            setActiveSortButton(true);
        }
        setActiveAllButton(false);
    };
    const handleChangOrderPrice = (event) => {
        setFilter((prevFillter) => {
            if (event.target.value === 'default') {
                return prevFillter;
            }
            return {
                ...prevFillter,
                priceOrder: event.target.value,
            };
        });
        setActiveAllButton(false);
    };
    const handleChangeToAll = () => {
        setFilter((prevFilter) => {
            let newFilter = {};
            Object.keys(prevFilter).forEach((key) => {
                if (key !== 'category_id' && key !== 'priceOrder' && key !== 'createdAtOrder') {
                    newFilter[key] = prevFilter[key];
                }
            });
            console.log('newFilter', newFilter);
            return newFilter;
        });
        setActiveAllButton(true);
        setActiveSortButton(false);
        options = options.map((option) => {
            if (option.value === 'default') {
                return {
                    ...option,
                    selected: true,
                };
            }
            return option;
        });
    };

    useEffect(() => {
        if (filter.category_id || filter.priceOrder || filter.createdAtOrder) {
            setActiveAllButton(false);
        }
    }, [filter.category_id, filter.priceOrder, filter.createdAtOrder]);

    return (
        <div className={cx('sort-bar')}>
            <div>Sắp xếp theo:</div>
            <Button
                className={cx('all-button', {
                    active: activeAllButton,
                })}
                onClick={() => handleChangeToAll()}
            >
                Tất cả
            </Button>
            <Button
                className={cx('sort-button', {
                    active: activeSortButton,
                })}
                onClick={() => handleChangeToNewest()}
            >
                Mới nhất
            </Button>
            <div className={cx('sort-select')}>
                <FormSelect
                    options={options}
                    value={filter.priceOrder || 'default'}
                    className={cx('sort-select__order')}
                    onChange={(event) => handleChangOrderPrice(event)}
                />
            </div>
        </div>
    );
};

SortBar.propTypes = {
    filter: PropTypes.object,
    setFilter: PropTypes.func.isRequired,
};

export default SortBar;
