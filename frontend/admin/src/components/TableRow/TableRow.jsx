import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';

import { Button, InputItem, Modal } from '~/components/index.js';
import { staffActions, getButton } from '~/utils/index.js';
import { CategoryService, ProductService, DiscountService, SupplierService } from '~/services/index.js';

import styles from './TableRow.module.scss';

const cx = classNames.bind(styles);

const TableRow = ({ setActiveRow, entityName = '', fillable = [], header = {}, row = {}, setData, actions }) => {
    const [activeAction, setActiveAction] = useState({});
    const [newValue, setNewValue] = useState({});

    const navigate = useNavigate();
    let instanceService = null;

    const config = {
        headers: {
            authorization: `Bearer ${staffActions.getToken()}`,
        },
    };

    const entity = entityName.trim().toLowerCase();
    switch (entity) {
        case 'category':
            instanceService = new CategoryService(config);
            break;
        case 'product':
            instanceService = new ProductService(config);
            break;
        case 'discount':
            instanceService = new DiscountService(config);
            break;
        case 'supplier':
            instanceService = new SupplierService(config);
            break;
    }

    const handleOnChange = (event) => {
        setNewValue({ ...newValue, [event.target.name]: event.target.value });
    };
    const handleUpdateRow = async (event) => {
        event.preventDefault();

        let payload = {};
        fillable.forEach((key) => {
            payload[key] = newValue[key] ? newValue[key] : row[key];
        });
        const id = row[`${entity}_id`];
        try {
            await instanceService.update(id, payload);
            setData((prevData) => {
                return prevData.map((item) => {
                    if (item[`${entity}_id`] === id) {
                        return { ...item, ...payload };
                    }
                    return item;
                });
            });
            setActiveAction({});
        } catch (error) {
            throw new Error(error.message);
        }
    };
    const handleDeleteRow = async (itemId) => {
        try {
            await instanceService.delete(itemId);
            setData((prevData) => {
                return prevData.filter((item) => item[`${entity}_id`] !== itemId);
            });
            setActiveAction({});
        } catch (error) {
            throw new Error(error.message);
        }
    };

    useEffect(() => {
        if (Object.keys(activeAction).length > 0 && activeAction.isDirected === true) {
            let directTo = '';
            switch (entity) {
                case 'category':
                    directTo = 'categories';
                    break;
                case 'product':
                    directTo = 'products';
                    break;
                case 'discount':
                    directTo = 'discounts';
                    break;
                case 'supplier':
                    directTo = 'suppliers';
                    break;
                case 'order':
                    directTo = 'orders';
                    break;
            }
            navigate(`/${directTo}/${row[`${entity}_id`]}/${activeAction.name}`);
        }
    }, [activeAction]);

    return (
        <tr>
            {header.hasCheckbox && (
                <th className={cx('th-checkbox')}>
                    <input className={cx('th-checkbox-input')} type="checkbox" />
                </th>
            )}
            {Object.keys(header).map((field, index) => {
                if (Object.keys(activeAction).length > 0 && activeAction.isModifiedInRow === true) {
                    if (activeAction.isModifiedInRow === true) {
                        if (header[field].isModified === true) {
                            if (field !== 'hasCheckbox') {
                                return (
                                    <td key={index} className={cx('cell')}>
                                        <InputItem
                                            value={newValue[field] !== undefined ? newValue[field] : row[field]}
                                            name={field}
                                            onChange={(event) => handleOnChange(event)}
                                        />
                                    </td>
                                );
                            }
                        }
                    }
                }
                if (field !== 'hasCheckbox') {
                    if (field.includes('image')) {
                        return (
                            <td key={index} className={cx('cell')}>
                                <img className={cx('cell-image')} src={row[field]} />
                            </td>
                        );
                    }
                    return (
                        <td key={index} className={cx('cell')}>
                            {row[field] !== undefined
                                ? typeof row[field] === 'boolean'
                                    ? row[field]
                                        ? header[field].views[0]
                                        : header[field].views[1]
                                    : row[field]
                                : ''}
                        </td>
                    );
                }
            })}
            {Object.keys(actions).length > 0 && (
                <td className={cx('cell')}>
                    <Modal
                        modalId={`${entity}-${row[`${entity}_id`]}`}
                        modalContent={{
                            title: 'Xác nhận xóa',
                            body: (
                                <p>
                                    Bạn có chắc chắn muốn xóa <b>{row[`${entity}_name`]}</b> này không?
                                </p>
                            ),
                            footer: (
                                <>
                                    <Button className={cx('table-row__btn')} primary data-bs-dismiss="modal">
                                        Hủy
                                    </Button>
                                    <Button
                                        className={cx('table-row__btn')}
                                        danger
                                        onClick={() => handleDeleteRow(row[`${entity}_id`])}
                                        data-bs-dismiss="modal"
                                    >
                                        Xóa
                                    </Button>
                                </>
                            ),
                        }}
                    />
                    {!(Object.keys(activeAction).length > 0 && activeAction.isModifiedInRow === true) ? (
                        <div className="d-flex">
                            {Object.keys(actions).map((action, index) => {
                                const button = getButton(action);
                                if (action === 'detail') {
                                    button['onClick'] = () => {
                                        setActiveAction({
                                            name: 'detail',
                                            isDirected: actions[action].isDirected,
                                            isModifiedInRow: actions[action].isModifiedInRow,
                                        });
                                    };
                                }
                                if (action === 'edit') {
                                    button['onClick'] = () => {
                                        setActiveAction({
                                            name: 'edit',
                                            isDirected: actions[action].isDirected,
                                            isModifiedInRow: actions[action].isModifiedInRow,
                                        });
                                        setActiveRow(row);
                                    };
                                }
                                if (action === 'delete') {
                                    button['data-bs-toggle'] = 'modal';
                                    button['data-bs-target'] = `#${entity}-${row[`${entity}_id`]}`;
                                }
                                return (
                                    <Button className={cx('table-row__btn')} key={index} {...button}>
                                        {actions[action].value}
                                    </Button>
                                );
                            })}
                        </div>
                    ) : (
                        <>
                            <Button
                                className={cx('table-row__btn')}
                                success
                                onClick={(event) => handleUpdateRow(event)}
                            >
                                Áp dụng
                            </Button>
                            <Button className={cx('table-row__btn')} danger onClick={() => setActiveAction({})}>
                                Hủy
                            </Button>
                        </>
                    )}
                </td>
            )}
        </tr>
    );
};

TableRow.propTypes = {
    entityName: PropTypes.string,
    fillable: PropTypes.array,
    entity: PropTypes.string,
    header: PropTypes.object,
    row: PropTypes.object,
    setData: PropTypes.func,
    actions: PropTypes.object,
    setActiveRow: PropTypes.func,
};

export default TableRow;
