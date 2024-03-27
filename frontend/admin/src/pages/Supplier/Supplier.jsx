import { useState, useEffect } from 'react';

import { Wrapper } from '~/components/index.js';
import SupplierList from '~/pages/Supplier/partials/SupplierList.jsx';
import SupplierForm from '~/pages/Supplier/partials/SupplierForm.jsx';
import SupplierService from '~/services/supplier.service.js';
import ColumnLayout from '~/layouts/ColumnLayout/ColumnLayout.jsx';

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
        <Wrapper>
            <ColumnLayout
                sides={[
                    {
                        columns: 8,
                        element: (
                            <SupplierList
                                supplierList={supplierList}
                                setSupplierList={setSupplierList}
                                setSupplier={setSupplier}
                            />
                        ),
                    },
                    {
                        columns: 4,
                        element: <SupplierForm supplier={supplier} setSupplier={setSupplier} />,
                    },
                ]}
            />
        </Wrapper>
    );
};

export default Suppllier;
