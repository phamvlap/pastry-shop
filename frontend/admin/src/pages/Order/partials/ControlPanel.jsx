import { useState, useEffect } from 'react';
import classNames from 'classnames/bind';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRotate } from '@fortawesome/free-solid-svg-icons';

import { InputSearch, InputItem, Button, FormSelect } from '~/components/index.js';
import { StatusService } from '~/services/index.js';
import Helper from '~/utils/helper.js';

import styles from './../Order.module.scss';

const cx = classNames.bind(styles);

const ControlPanel = ({ setSearchOrderId, setStatusId, setStartDate, setEndDate, setOrderTotalSort }) => {
    const [statusList, setStatusList] = useState([]);
    const [form, setForm] = useState();

    const handleChange = (event) => {
        setForm({
            ...form,
            [event.target.name]: event.target.value,
        });
    };
    const handleSubmit = (event) => {
        event.preventDefault();

        if (form && form.status_id !== 'all') {
            setStatusId(form.status_id);
        }
        if (form && form.start_date) {
            setStartDate(form.start_date);
        }
        if (form && form.end_date) {
            setEndDate(form.end_date);
        }
        if (form && form.order_total_sort !== 'all') {
            setOrderTotalSort(form.order_total_sort);
        }
    };
    const handleRefresh = (event) => {
        event.preventDefault();

        setForm({});
        setSearchOrderId(null);
        setStatusId(null);
        setStartDate(null);
        setEndDate(null);
        setOrderTotalSort(null);
    };
    const handleSearchForm = (event) => {
        event.preventDefault();

        if (form && form.order_id) {
            setSearchOrderId(form.order_id);
            setForm({
                order_id: '',
            });
        }
    };

    useEffect(() => {
        const fetchStatusList = async () => {
            const statusService = new StatusService();
            const response = await statusService.getAll();
            setStatusList(response.data);
        };
        fetchStatusList();
    }, []);
    return (
        <div className={cx('control-panel')}>
            <div className={cx('control-panel__filter')}>
                <div className={cx('panel-item')}>
                    <span className={cx('panel-item__label')}>Từ</span>
                    <InputItem
                        type="date"
                        name="start_date"
                        value={Helper.convertToStandardFormat(form?.start_date)}
                        onChange={(event) => handleChange(event)}
                    />
                    <span className={cx('panel-item__label')}>đến</span>
                    <InputItem
                        type="date"
                        name="end_date"
                        value={Helper.convertToStandardFormat(form?.end_date)}
                        onChange={(event) => handleChange(event)}
                    />
                </div>
                <div className={cx('panel-item')}>
                    <span className={cx('panel-item__label')}>Trạng thái:</span>
                    <FormSelect
                        name="status_id"
                        value={form?.status_id || 'all'}
                        options={[
                            {
                                value: 'all',
                                name: '-- Chọn --',
                            },
                            ...statusList.map((status) => ({
                                value: status.status_id,
                                name: status.vn_status_name,
                            })),
                        ]}
                        onChange={(event) => handleChange(event)}
                    />
                </div>
                <div className={cx('panel-item')}>
                    <span className={cx('panel-item__label')}>Tổng tiền:</span>
                    <FormSelect
                        name="order_total_sort"
                        value={form?.order_total_sort || 'all'}
                        options={[
                            { value: 'all', name: '-- Chọn --' },
                            { value: 'asc', name: 'Tăng dần' },
                            { value: 'desc', name: 'Giảm dần' },
                        ]}
                        onChange={(event) => handleChange(event)}
                    />
                </div>
                <div className={cx('panel-item')}>
                    <Button primary className={cx('panel-item_button')} onClick={(event) => handleSubmit(event)}>
                        Lọc
                    </Button>
                    <Button primary className={cx('panel-item_button')} onClick={(event) => handleRefresh(event)}>
                        <FontAwesomeIcon icon={faRotate} />
                    </Button>
                </div>
            </div>
            <div className={cx('control-panel__search')}>
                <form onSubmit={(event) => handleSearchForm(event)}>
                    <InputSearch
                        placeholder="Nhập mã đơn hàng"
                        name="order_id"
                        value={form?.order_id}
                        onChange={(event) => handleChange(event)}
                    />
                </form>
            </div>
        </div>
    );
};

ControlPanel.propTypes = {
    setSearchOrderId: PropTypes.func,
    setStatusId: PropTypes.func,
    setStartDate: PropTypes.func,
    setEndDate: PropTypes.func,
    setOrderTotalSort: PropTypes.func,
};

export default ControlPanel;
