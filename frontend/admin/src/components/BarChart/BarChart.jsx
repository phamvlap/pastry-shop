import { Bar } from 'react-chartjs-2';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';

import styles from './BarChart.module.scss';

const cx = classNames.bind(styles);

const BarChart = ({ title, data, unit }) => {
    return (
        <div className={cx('chart-container')}>
            <Bar
                data={data}
                options={{
                    plugins: {
                        legend: {
                            display: false,
                        },
                        title: {
                            display: true,
                            text: title,
                            font: {
                                size: 16,
                            },
                        },
                    },
                    scales: {
                        y: {
                            ticks: {
                                callback: function (value, index, ticks) {
                                    if (unit) {
                                        return value + unit;
                                    }
                                    return value;
                                },
                            },
                        },
                    },
                }}
            />
        </div>
    );
};

BarChart.propTypes = {
    title: PropTypes.string,
    data: PropTypes.object,
    unit: PropTypes.string,
};

export default BarChart;
