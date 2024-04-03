import classNames from 'classnames/bind';

import Button from '~/components/Button/Button.jsx';
import FormSelect from '~/components/FormSelect/FormSelect.jsx';
import styles from '~/components/SortBar/SortBar.module.scss';

const cx = classNames.bind(styles);

const options = [
    {
        name: 'Mặc định',
        value: 'default',
    },
    {
        name: 'Giá: Thấp đến cao',
        value: 'price-asc',
    },
    {
        name: 'Giá: Cao đến thấp',
        value: 'price-desc',
    },
];

const SortBar = () => {
    return (
        <div className={cx('sort-bar')}>
            <div>Sắp xếp theo:</div>
            <Button className={cx('sort-button')}>Tất cả</Button>
            <Button className={cx('sort-button')}>Mới nhất</Button>
            <div className={cx('sort-select')}>
                <FormSelect options={options} className={cx('sort-select__order')} />
            </div>
        </div>
    );
};

export default SortBar;
