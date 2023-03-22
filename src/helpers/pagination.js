import React, { useEffect, useState } from 'react';
import { Pagination } from 'react-bootstrap';
import CsLineIcons from 'cs-line-icons/CsLineIcons';

const PaginationTable = (props) => {
    const [paginationConfig, setPaginationConfig] = useState(false)

    useEffect(() => {
        setPaginationConfig(props.config)
    }, [props])

    return (
        <>
            <Pagination className="w-100 d-flex justify-content-center">
                <Pagination.Prev className="shadow" disabled={!paginationConfig.previousPage} onClick={() => props.gotoPage(1)}>
                    <CsLineIcons icon="arrow-double-left" />
                </Pagination.Prev>

                <Pagination.Prev className="shadow" disabled={!paginationConfig.previousPage} onClick={() => props.gotoPage(paginationConfig.page - 1)} >
                    <CsLineIcons icon="chevron-left" />
                </Pagination.Prev>

                {[...Array(paginationConfig.total)].map((x, i) => {
                    if (i <= paginationConfig.page + 2 && i >= paginationConfig.page - 4) {
                        return (
                            <Pagination.Item active={paginationConfig.page === i + 1} key={`pagination${i + 1}`} className="shadow" onClick={() => props.gotoPage(i + 1)}>
                                {i + 1}
                            </Pagination.Item>
                        )
                    }
                    return false
                })}

                <Pagination.Next className="shadow" disabled={!paginationConfig.nextPage} onClick={() => props.gotoPage(paginationConfig.page + 1)}>
                    <CsLineIcons icon="chevron-right" />
                </Pagination.Next>

                <Pagination.Next className="shadow" disabled={!paginationConfig.nextPage} onClick={() => props.gotoPage(paginationConfig.lastPage)}>
                    <CsLineIcons icon="arrow-double-right" />
                </Pagination.Next>
            </Pagination>
        </>
    );
};
export default PaginationTable;
