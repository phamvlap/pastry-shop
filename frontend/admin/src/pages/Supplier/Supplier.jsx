import { useState, useEffect } from 'react';
import classNames from 'classnames/bind';

import SupplierList from '~/pages/Supplier/partials/SupplierList.jsx';
import SupplierForm from '~/pages/Supplier/partials/SupplierForm.jsx';
import SupplierService from '~/services/supplier.service.js';

import styles from '~/pages/Supplier/Supplier.module.scss';

const cx = classNames.bind(styles);

const Suppllier = () => {
    const [supplier, setSupplier] = useState({});
    const [supplierList, setSupplierList] = useState([]);

    const supplierService = new SupplierService();

    useEffect(() => {
        const formatDate = (date = new Date()) => {
            const year = date.getFullYear();
            const month = 1 + date.getMonth();
            const day = date.getDate();
            return `${month < 10 ? `0${month}` : month}-${day < 10 ? `0${day}` : day}-${year}`;
        };
        const fetchSuppllier = async () => {
            const response = await supplierService.getAll();
            let data = [];
            for (const supplier of response.data) {
                data.push({
                    supplier_id: supplier.supplier_id,
                    supplier_name: supplier.supplier_name,
                    supplier_phone_number: supplier.supplier_phone_number,
                    supplier_email: supplier.supplier_email,
                    supplier_address: supplier.supplier_address,
                });
            }
            setSupplierList(data);
        };
        fetchSuppllier();
    }, [supplier]);

    return (
        <div className={cx('supplier-container')}>
            <div className="row">
                <div className={cx('col col-md-8', 'supplier-container__col')}>
                    <SupplierList
                        supplierList={supplierList}
                        setSupplierList={setSupplierList}
                        setSupplier={setSupplier}
                    />
                </div>
                <div className={cx('col col-md-4', 'supplier-container__col')}>
                    <SupplierForm supplier={supplier} setSupplier={setSupplier} />
                </div>
            </div>
        </div>
    );
};

export default Suppllier;
