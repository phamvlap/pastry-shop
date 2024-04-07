import PropTypes from 'prop-types';
import classNames from 'classnames/bind';

import styles from '~/components/Pagination/Pagination.module.scss';

const cx = classNames.bind(styles);

const Pagination = ({
    totalPages,
    currentPage,
    setCurrentPage,
    recordsPerPage,
    setRecordsPerPage,
    recordOffset,
    setRecordsOffset,
    length = Number(import.meta.env.VITE_MAX_PAGE_SIZE),
}) => {
    const halfLength = Math.floor(length / 2);
    let start = currentPage - halfLength;
    let end = currentPage + halfLength;
    let pages = [];

    if (start < 1) {
        start = 1;
        end = length;
    }
    if (end > totalPages) {
        start = totalPages - length + 1;
        end = totalPages;
        if (start < 1) {
            start = 1;
        }
    }
    for (let i = start; i <= end; i++) {
        pages.push(i);
    }

    return (
        <nav className={cx('container')}>
            <ul className={cx('pagination')}>
                <li
                    className={cx('page-item')}
                    onClick={() => {
                        if (currentPage > 1) {
                            setCurrentPage(currentPage - 1);
                            setRecordsOffset((currentPage - 2) * recordsPerPage);
                        }
                    }}
                    disabled={currentPage === 1}
                >
                    &laquo;
                </li>
                {pages.map((page) => {
                    return (
                        <li
                            key={page}
                            className={cx('page-item', { active: page === currentPage })}
                            onClick={() => {
                                setCurrentPage(page);
                                setRecordsOffset((page - 1) * recordsPerPage);
                            }}
                        >
                            {page}
                        </li>
                    );
                })}
                <li
                    className={cx('page-item')}
                    onClick={() => {
                        if (currentPage < totalPages) {
                            setCurrentPage(currentPage + 1);
                            setRecordsOffset(currentPage * recordsPerPage);
                        }
                    }}
                    disabled={currentPage === totalPages}
                >
                    &raquo;
                </li>
            </ul>
        </nav>
    );
};

Pagination.propTypes = {
    totalPages: PropTypes.number,
    currentPage: PropTypes.number,
    setCurrentPage: PropTypes.func,
    recordsPerPage: PropTypes.number,
    setRecordsPerPage: PropTypes.func,
    recordOffset: PropTypes.number,
    setRecordsOffset: PropTypes.func,
    length: PropTypes.number,
    endPoint: PropTypes.string,
};

export default Pagination;
