import classNames from 'classnames/bind';

import { SortBar, CardItem } from '~/components/index.js';
import styles from '~/pages/Home/Home.module.scss';

const cx = classNames.bind(styles);

const Home = () => {
    return (
        <div className={cx('container')}>
            <SortBar />
            <div className={cx('products-list')}>
                <h2 className={cx('list-title')}>Dành cho bạn</h2>
                <div className={cx('list-container')}>
                    <div className="row">
                        <div className="col-3">
                            <CardItem />
                        </div>
                        <div className="col-3">
                            <CardItem />
                        </div>
                        <div className="col-3">
                            <CardItem />
                        </div>
                        <div className="col-3">
                            <CardItem />
                        </div>
                        <div className="col-3">
                            <CardItem />
                        </div>
                        <div className="col-3">
                            <CardItem />
                        </div>
                        <div className="col-3">
                            <CardItem />
                        </div>
                        <div className="col-3">
                            <CardItem />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
