import BreadcrumbList from "components/breadcrumb-list/BreadcrumbList"
import HtmlHead from "components/html-head/HtmlHead"
import React, { useMemo, useState } from "react"
import { Badge, Col, Form, Row } from "react-bootstrap"
import { useTable, useGlobalFilter, useSortBy, usePagination, useRowSelect, useRowState } from 'react-table';
import ControlsAdd from "./components/ControlsAdd";
import ControlsDelete from "./components/ControlsDelete";
import ControlsEdit from "./components/ControlsEdit";
import ControlsPageSize from "./components/ControlsPageSize";
import ControlsSearch from "./components/ControlsSearch";
import Table from "./components/Table";
import TablePagination from "./components/TablePagination";

const dummyData = [
    { id: 1, name: 'Caio Magalhães', level: 'Administrador', status: 'Ativo', last_access: '11/02/2023 16:45', created: '02/01/2022 12:11' },
    { id: 2, name: 'Aren Stark', level: 'Operador', status: 'Inativo', last_access: '30/11/2023 16:45', created: '13/01/2022 13:11' },
    { id: 3, name: 'Monica R. Romero', level: 'Administrador', status: 'Ativo', last_access: '21/12/2023 16:45', created: '02/01/2022 11:11' },
    { id: 4, name: 'Anne J. Champion', level: 'Operador', status: 'Ativo', last_access: '13/02/2023 16:45', created: '12/01/2022 12:11' },
    { id: 5, name: 'Kim G. Warren', level: 'Administrador', status: 'Ativo', last_access: '23/11/2023 16:45', created: '02/01/2022 13:11' },
    { id: 6, name: 'Frances R. Schenck', level: 'Administrador', status: 'Inativo', last_access: '13/12/2023 16:45', created: '12/01/2022 13:11' },
    { id: 7, name: 'Elisabeth H. Whitehead', level: 'Administrador', status: 'Ativo', last_access: '16/02/2023 16:45', created: '12/01/2022 13:11' },
    { id: 8, name: 'Sean M. Shifflett', level: 'Operador', status: 'Ativo', last_access: '18/01/2023 16:45', created: '02/01/2022 13:11' },
    { id: 9, name: 'Kenneth P. Barker', level: 'Operador', status: 'Inativo', last_access: '13/02/2023 16:45', created: '12/01/2022 13:11' },
    { id: 10, name: 'Kimberly B. Campanelli', level: 'Administrador', status: 'Ativo', last_access: '13/01/2023 16: 45', created: '02/01/2022 13:11' },
    { id: 11, name: 'John D. Hardy', level: 'Operador', status: 'Ativo', last_access: '19/01/2023 16:45', created: '12/01/2022 13:11' },
    { id: 12, name: 'Henry P. Perez', level: 'Operador', status: 'Bloqueado', last_access: '13/02/2023 16:45', created: '12/01/2022 13:11' },
];

const Users = (props) => {

    const title = 'Usuários'
    const description = ''

    const breadcrumbs = [
        { to: 'home', text: 'Home' },
        { to: '', text: 'Usuários' },
        { to: '', text: 'Listar' },
    ]

    const columns = useMemo(() => {
        return [
            {
                Header: 'Name',
                accessor: 'name',
                sortable: true,
                headerClassName: 'text-muted text-small text-uppercase w-30',
                Cell: ({ cell }) => {
                    return (
                        <a
                            className="list-item-heading body"
                            href="#!"
                            onClick={(e) => {
                                e.preventDefault();
                            }}
                        >
                            {cell.value}
                        </a>
                    );
                },
            },
            { Header: 'Nível', accessor: 'level', sortable: true, headerClassName: 'text-muted text-small text-uppercase w-10' },
            {
                Header: 'Status',
                accessor: 'status',
                sortable: true,
                headerClassName: 'text-muted text-small text-uppercase w-10',
                Cell: ({ cell }) => {
                    return <Badge bg="outline-primary">{cell.value}</Badge>;
                },
            },
            { Header: 'Últ.Acesso', accessor: 'last_access', sortable: true, headerClassName: 'text-muted text-small text-uppercase w-20' },
            { Header: 'Criação', accessor: 'created', sortable: true, headerClassName: 'text-muted text-small text-uppercase w-20' },
            {
                Header: '',
                id: 'action',
                headerClassName: 'empty w-10',
                Cell: ({ row }) => {
                    const { checked, onChange } = row.getToggleRowSelectedProps();
                    return <Form.Check className="form-check float-end mt-1" type="checkbox" checked={checked} onChange={onChange} />;
                },
            },
        ];
    }, [])

    const [data, setData] = useState(dummyData)
    const [isOpenAddEditModal, setIsOpenAddEditModal] = useState(false)

    const tableInstance = useTable(
        { columns, data, setData, isOpenAddEditModal, setIsOpenAddEditModal, initialState: { pageIndex: 0 } },
        useGlobalFilter,
        useSortBy,
        usePagination,
        useRowSelect,
        useRowState
    )



    return (
        <>

            <HtmlHead
                title={title}
                description={description} />

            <Row>
                <Col>
                    <section className="scroll-section" id="title">
                        <div className="page-title-container">
                            <h1 className="mb-0 pb-0 display-4">{title}</h1>
                            <BreadcrumbList items={breadcrumbs} />
                        </div>

                        <div>
                            <Row className="mb-3">
                                <Col sm="12" md="5" lg="3" xxl="2">
                                    <div className="d-inline-block float-md-start me-1 mb-1 mb-md-0 search-input-container w-100 shadow bg-foreground">
                                        <ControlsSearch tableInstance={tableInstance} />
                                    </div>
                                </Col>
                                <Col sm="12" md="7" lg="9" xxl="10" className="text-end">
                                    <div className="d-inline-block me-0 me-sm-3 float-start float-md-none">
                                        <ControlsAdd tableInstance={tableInstance} />
                                        <ControlsEdit tableInstance={tableInstance} />
                                        <ControlsDelete tableInstance={tableInstance} />
                                    </div>
                                    <div className="d-inline-block">
                                        <ControlsPageSize tableInstance={tableInstance} />
                                    </div>
                                </Col>
                            </Row>
                            <Row>
                                <Col xs="12">
                                    <Table className="react-table rows" tableInstance={tableInstance} />
                                </Col>
                                <Col xs="12">
                                    <TablePagination tableInstance={tableInstance} />
                                </Col>
                            </Row>
                        </div>
                    </section>
                </Col>
            </Row>





        </>
    )
}

export default Users
