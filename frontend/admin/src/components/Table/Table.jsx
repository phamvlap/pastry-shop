import PropTypes from 'prop-types';
import classNames from 'classnames/bind';

import TableRow from '~/components/TableRow/TableRow.jsx';

import styles from '~/components/Table/Table.module.scss';

const cx = classNames.bind(styles);

const Table = ({
    entityName = '',
    fillable = [],
    header = {},
    data = [],
    setData,
    actions = {},
    activeRow,
    setActiveRow,
}) => {
    return (
        <>
            <table className={cx('container', 'rounded-conners')}>
                <thead className={cx('head')}>
                    <tr>
                        {header.hasCheckbox === true && (
                            <th className={cx('th-checkbox')}>
                                <input className={cx('th-checkbox-input')} type="checkbox" />
                            </th>
                        )}
                        {Object.keys(header).map((field, index) => {
                            if (field !== 'hasCheckbox') {
                                return (
                                    <th key={index} scope="col" className={cx('head', 'cell')}>
                                        {header[field].value}
                                    </th>
                                );
                            }
                        })}
                        {Object.keys(actions).length > 0 && (
                            <th scope="col" className={cx('head', 'cell')}>
                                Thao tác
                            </th>
                        )}
                    </tr>
                </thead>
                <tbody className={cx('body')}>
                    {data.length === 0 ? (
                        <tr>
                            <td
                                colSpan={Object.keys(header).length + 1}
                                className={cx('cell')}
                                style={{ textAlign: 'center' }}
                            >
                                Không có dữ liệu
                            </td>
                        </tr>
                    ) : (
                        data.map((row, index) => {
                            return (
                                <TableRow
                                    key={index}
                                    entityName={entityName}
                                    fillable={fillable}
                                    header={header}
                                    row={row}
                                    setData={setData}
                                    actions={actions}
                                    activeRow={activeRow}
                                    setActiveRow={setActiveRow}
                                />
                            );
                        })
                    )}
                </tbody>
            </table>
        </>
    );
};

Table.propTypes = {
    entityName: PropTypes.string,
    fillable: PropTypes.array,
    header: PropTypes.object,
    data: PropTypes.array,
    setData: PropTypes.func,
    actions: PropTypes.object,
    activeRow: PropTypes.object,
    setActiveRow: PropTypes.func,
};

export default Table;
