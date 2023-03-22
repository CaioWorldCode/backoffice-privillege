import React, { useEffect, useState } from 'react';
import { Row, Col, Spinner, Dropdown, InputGroup, FormControl, Card, Alert, Button, Modal, Form as FormBootstrap } from 'react-bootstrap';
import HtmlHead from 'components/html-head/HtmlHead';
import BreadcrumbList from 'components/breadcrumb-list/BreadcrumbList';
import moment from 'moment';
import pt from 'date-fns/locale/pt';
import DatePicker from 'react-datepicker';
import api from 'services/api';
import CsLineIcons from 'cs-line-icons/CsLineIcons';
import PaginationTable from 'helpers/pagination';
import formatField from 'helpers/formatField';
import { Field, Form, Formik } from 'formik';
import * as Yup from 'yup'
import Swal from 'sweetalert2'
import { SketchPicker } from 'react-color';
import ReactSelect from 'react-select';


const Component = () => {
    const title = 'Tipo de email';
    const description = 'Tipo de email';

    const breadcrumbs = [
        { to: '', text: 'Home' },
        { to: 'config', text: 'Configurações' },
        { to: 'email_type', text: 'Tipo de email' },
    ]

    const columns = [
        { name: 'Id', acessor: 'id', column: 'id' },
        { name: 'Nome', acessor: 'name', column: 'name' },
        { name: 'Cor', acessor: 'color', column: 'hint_home', format: 'color' },
        { name: 'Icon', acessor: 'icon', column: 'fixture', format: 'icon' },
        { name: 'Padrão', acessor: 'default', column: 'points', format: 'boolean' },
        { name: 'Data', acessor: 'created_at', column: 'created_at' },
        { name: '', acessor: 'custom', column: 'custom' },
    ]


    const [modalNewRegister, setModalNewRegister] = useState(false)
    const [limit, setLimit] = useState(10)
    const [loading, setLoading] = useState(true)
    const [startDate, setStartDate] = useState()
    const [endDate, setEndDate] = useState()
    const [order, setOrder] = useState(false)
    const [orderBy, setOrderBy] = useState('asc')
    const [data, setData] = useState(false)
    const [total, setTotal] = useState(false)
    const [searchField, setSearchField] = useState('')
    const [paginationConfig, setPaginationConfig] = useState({
        page: 1
    })

    const [modalEditRegister, setModalEditRegister] = useState(false)
    const [idEdit, setIdEdit] = useState(false)
    const [loadingIdData, setLoadingIdData] = useState(false)
    const [idData, setIdData] = useState(false)

    const loadData = async (pageLimit, page) => {
        document.body.classList.add('spinner')

        pageLimit = limit

        try {
            let url = `/api/v1/private/email_type?order=${orderBy}&limit=${pageLimit}&page=${page}&search=${searchField}`

            if (startDate && endDate) {
                url += `&start=${moment(startDate).format('YYYY-MM-DD')}&end=${moment(endDate).format('YYYY-MM-DD')}`
            }

            if (order) {
                url += `&order=${orderBy}&order_by=${order}`
            }

            const response = await api.get(url)

            setData(response.data.data)
            setTotal(response.data.total)

            setPaginationConfig({
                previousPage: response.data.data.prev_page_url,
                page: response.data.data.current_page,
                nextPage: response.data.data.next_page_url,
                limit: pageLimit,
                total: response.data.data.last_page,
                lastPage: response.data.data.last_page
            })

        } catch (error) {
            console.log(error)
        }

        document.body.classList.remove('spinner')

        setLoading(false)
    }

    const [icons, setIcons] = useState([])

    const getIcons = async () => {
        try {
            const response = await api.get(`/api/v1/private/icons`)

            let array_icons = []

            response.data.map((row) => {
                array_icons.push({
                    label: row.name,
                    value: row.name
                })
            })

            setIcons(array_icons)
        } catch (error) {

        }
    }

    useEffect(() => {
        if (icons.length === 0) {
            getIcons()
        }
    }, [])

    const orderTable = (param) => {
        setOrder(param)

        if (orderBy === 'asc') {
            setOrderBy('desc')
        } else {
            setOrderBy('asc')
        }
    }

    const changePaginationConfig = async (param, value) => {
        await setPaginationConfig({
            ...paginationConfig, [param]: value
        })
    }

    useEffect(() => {
        if (!data) {
            loadData(paginationConfig.limit, paginationConfig.page)
        }
    }, [paginationConfig.page])

    useEffect(() => {
        if (data) {
            loadData(limit, 1)
        }
    }, [limit])

    useEffect(() => {
        if (data) {
            if (startDate && endDate) {
                loadData(limit, 1)
            }
        }
    }, [endDate, startDate])

    useEffect(() => {
        if (data) {
            loadData(limit, 1)
        }
    }, [order, orderBy])

    const handleSearch = (e) => {
        setSearchField(e.target.value)
    }

    const callLoadEditRegister = async () => {
        setLoadingIdData(true)
        try {
            const response = await api.get(`/api/v1/private/email_type/${idEdit}`)

            setIdData(response.data)
        } catch (error) {

        }
        setLoadingIdData(false)
    }

    useEffect(() => {
        if (modalEditRegister) {
            if (idEdit) {
                callLoadEditRegister()
            }
        }
    }, [modalEditRegister])

    const callEdit = (id) => {
        setModalEditRegister(true)
        setIdEdit(id)
    }

    const callDelete = async (id) => {
        Swal.fire({
            title: 'Tem certeza que deseja excluir este cadastro?',
            showDenyButton: true,
            showCancelButton: true,
            showCancelButton: false,
            confirmButtonText: 'Sim',
            confirmButtonColor: '#80D946',
            denyButtonText: `Não`,
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const response = await api.delete(`/api/v1/private/email_type/${id}`)
                    Swal.fire({
                        title: response.data.title,
                        text: response.data.message,
                        icon: 'success',
                        confirmButtonText: 'Fechar'
                    }).then((result) => {
                        loadData()
                    })
                } catch (error) {
                    Swal.fire({
                        title: error.response.data.title,
                        text: error.response.data.message,
                        icon: 'error',
                        confirmButtonText: 'Fechar'
                    })
                }
            }
        })
    }

    const renderTable = () => {
        return (
            <>
                <Row>
                    <Col xs={12} xxl={12} className=" d-flex justify-content-end align-items-end">
                        <Button
                            variant="primary"
                            type="submit"
                            disabled={loading}
                            onClick={() => setModalNewRegister(true)}
                        >
                            Novo Cadastro <CsLineIcons icon="plus" />
                        </Button>
                    </Col>
                </Row>

                {/* FILTERS */}
                <Row>
                    <Col xs={12} xxl={1} className="d-flex d-flex justify-content-end align-items-end">
                        <Dropdown
                            align={{ xs: 'end' }}
                            className="d-inline-block ms-1"
                            onSelect={(e) =>
                                setLimit(e)
                            }
                        >
                            <Dropdown.Toggle variant="foreground-alternate" className="shadow">
                                {limit} Items
                            </Dropdown.Toggle>

                            <Dropdown.Menu
                                className="shadow dropdown-menu-end"
                            >
                                <Dropdown.Item eventKey="5">5 Items</Dropdown.Item>
                                <Dropdown.Item eventKey="10">10 Items</Dropdown.Item>
                                <Dropdown.Item eventKey="20">20 Items</Dropdown.Item>
                                <Dropdown.Item eventKey="50">50 Items</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    </Col>

                    <Col xxl={4}>
                        <Row className="g-2 w-100">
                            <Col>
                                <h2 className="heading title mb-1 text-muted">De</h2>
                                <DatePicker
                                    locale={pt}
                                    dateFormat="dd/MM/yyyy"
                                    className="form-control"
                                    selected={startDate}
                                    onChange={(date) => setStartDate(date)}
                                    selectsStart
                                    startDate={startDate}
                                    endDate={endDate}
                                />
                            </Col>
                            <Col>
                                <h2 className="heading title mb-1 text-muted">Até</h2>
                                <DatePicker
                                    locale={pt}
                                    dateFormat="dd/MM/yyyy"
                                    className="form-control"
                                    selected={endDate}
                                    onChange={(date) => setEndDate(date)}
                                    selectsEnd
                                    startDate={startDate}
                                    endDate={endDate}
                                    minDate={startDate}
                                />
                            </Col>
                        </Row>
                    </Col>
                    <Col xxl={4}>
                        &nbsp;
                    </Col>
                    <Col xs={12} xxl={3} className=" d-flex justify-content-end align-items-end">
                        <InputGroup className="mt-2"
                            onChange={e => handleSearch(e)}
                            onKeyDown={e => e.key === 'Enter' ? loadData(paginationConfig.limit, 1) : false}
                        >
                            <InputGroup.Text >
                                <CsLineIcons icon="search" />
                            </InputGroup.Text>
                            <FormControl placeholder="pesquisar..." aria-label="Pesquisar" aria-describedby="basic-addon1" />
                        </InputGroup>
                    </Col>
                </Row>
                {/* FILTERS */}

                {/* DATA */}
                <Row className='mt-5'>
                    <Col xs={12} xxl={12}>
                        {data.length === 0
                            ? <>
                                <Row className="g-2 mb-5">
                                    <Col sm="12" xxl="12">
                                        <Card className="sh-19">
                                            <Card.Body className="text-center d-flex flex-column justify-content-center align-items-center">
                                                <CsLineIcons icon="warning-hexagon" className="text-warning" size={50} />
                                                <p className="heading mb-0">
                                                    Ops! Nenhum resultado para essa consulta.
                                                </p>

                                                <p className="text-medium mb-0 text-muted">
                                                    Altere os filtros da consulta e tente novamente.
                                                </p>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                </Row>
                            </>
                            : <>

                                {total
                                    ? <>
                                        <Alert variant="info">
                                            Total de registros localizados: <strong>{total}</strong>
                                        </Alert>
                                    </>
                                    : <></>
                                }

                                <table className="react-table rows" >
                                    <thead>
                                        <tr>
                                            {columns.map((row, index) => {
                                                return (
                                                    <th
                                                        key={index}
                                                        className={`text-muted text-small text-uppercase ${row.column ? 'cursor-pointer' : ''}`}
                                                        onClick={() => row.column ? orderTable(row.column) : false}
                                                    >
                                                        <span className={`${order === row.column ? 'text-primary  font-weight-bold' : ''}`}>
                                                            {row.name} &nbsp;

                                                            {order === row.column
                                                                ? <CsLineIcons size={10} icon={orderBy === 'asc' ? 'chevron-top' : 'chevron-bottom'} />
                                                                : <></>
                                                            }
                                                        </span>
                                                    </th>
                                                )
                                            })}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {data.length > 0 && data.map((row, index) => {
                                            return (
                                                <tr key={index}>
                                                    {columns.map((r, i) => {
                                                        return (
                                                            <td key={i}>

                                                                {r.format ?
                                                                    formatField(r.format, row[r.acessor], row)
                                                                    : <>
                                                                        {r.acessor === 'custom'
                                                                            ? <>
                                                                                <Button onClick={() => callEdit(row.id)} variant="outline-info" className="btn-icon btn-icon-only mb-1">
                                                                                    <CsLineIcons icon="edit" />
                                                                                </Button>

                                                                                &nbsp;
                                                                                <Button onClick={() => callDelete(row.id)} variant="outline-danger" className="btn-icon btn-icon-only mb-1">
                                                                                    <CsLineIcons icon="bin" />
                                                                                </Button>

                                                                            </>
                                                                            : <>
                                                                                {row[r.acessor]}
                                                                            </>
                                                                        }
                                                                    </>
                                                                }
                                                            </td>
                                                        )
                                                    })}
                                                </tr>
                                            )
                                        })}
                                    </tbody>

                                </table>


                                <PaginationTable
                                    config={paginationConfig}
                                    gotoPage={(page) => [changePaginationConfig('page', page)]}
                                />

                            </>
                        }
                    </Col>
                </Row>
                {/* DATA */}
            </>
        )
    }

    const validationSchema = Yup.object().shape({
        name: Yup.string().required('Este campo é obrigatório'),
    })

    const formatOptionLabel = ({ value, label, customAbbreviation }) => (
        <div style={{ display: "flex" }}>
            <div>{label}</div>
            <div style={{ marginLeft: "10px", color: "#ccc" }}>
                <CsLineIcons icon={`${label}`} className="text-info" size={20} />
            </div>
        </div>
    );

    return (
        <>
            <HtmlHead title={title} description={description} />
            {/* Title and Top Buttons Start */}
            <div className="page-title-container">
                <Row>
                    {/* Title Start */}
                    <Col md="7">
                        <h1 className="mb-0 pb-0 display-4">{title}</h1>
                        <BreadcrumbList items={breadcrumbs} />
                    </Col>
                    {/* Title End */}
                </Row>
            </div>
            {/* Title and Top Buttons End */}

            {loading
                ? <>
                    <div className="align-items-center">
                        <Spinner as="span" animation="border" size="md" />

                        <div>Carregando...</div>
                    </div>
                </>
                : <>
                    {renderTable()}
                </>
            }

            {/* MODAL NEW REGISTER */}
            <Modal
                className="scroll-out"
                show={modalNewRegister}
                size='md'
                centered
                onHide={() => setModalNewRegister(false)}
            >
                <Modal.Body>
                    <Row>
                        <Col xs={11}>
                            &nbsp;
                        </Col>
                        <Col xs={1}>
                            <div className='d-flex justify-content-end cursor-pointer' onClick={() => setModalNewRegister(false)}>
                                <CsLineIcons icon="close" className="text-primary" size={20} />
                            </div>
                        </Col>
                    </Row>

                    <h4>Novo cadastro</h4>

                    <Formik
                        initialValues={{
                            name: '',
                            icon: '',
                            default: false,
                            color: ''
                        }}
                        validationSchema={validationSchema}
                        onSubmit={async (values, { resetForm }) => {
                            try {
                                const response = await api.post(`/api/v1/private/email_type`, values)

                                resetForm()

                                Swal.fire({
                                    title: response.data.title,
                                    text: response.data.message,
                                    icon: 'success',
                                    confirmButtonText: 'Fechar'
                                }).then((result) => {
                                    setModalNewRegister(false)
                                    loadData()
                                })

                            } catch (error) {
                                Swal.fire({
                                    title: error.response.data.title,
                                    text: error.response.data.message,
                                    icon: 'error',
                                    confirmButtonText: 'Fechar'
                                })
                            }
                        }}
                    >
                        {({ values, errors, touched, setFieldValue }) => (
                            <Form className="tooltip-end-bottom mt-4">
                                <div className="mb-3  form-group tooltip-end-top">
                                    <div className='label'> Nome </div>
                                    <Field className="form-control" disabled={values.loading} type="text" name="name" value={values.name} />
                                    {errors.name && touched.name && <div className="d-block invalid-tooltip">{errors.name}</div>}
                                </div>

                                <div className="mb-3  form-group tooltip-end-top">
                                    <div className='label'> Icone </div>
                                    <ReactSelect
                                        placeholder=""
                                        classNamePrefix="react-select"
                                        options={icons}
                                        value={
                                            icons.filter(option =>
                                                option.label === values.icon)
                                        }
                                        onChange={e => setFieldValue('icon', e.label)}
                                        formatOptionLabel={formatOptionLabel}
                                    />
                                    {errors.icon && touched.icon && <div className="d-block invalid-tooltip">{errors.icon}</div>}
                                </div>

                                <div className="mb-4  form-group tooltip-end-top">
                                    <div className='label'> Cor </div>
                                    <div className='d-flex justify-content-center align-items-center'>
                                        <SketchPicker
                                            color={values.color}
                                            onChange={(e) => setFieldValue('color', e.hex)}
                                        />
                                    </div>
                                </div>

                                <label>
                                    Este atributo será padrão? &nbsp;
                                    <Field className="form-check-input" type="checkbox" name="default" />
                                </label>

                                <Alert variant='info' className='mt-4 mb-4'>
                                    Ao seleciona este campo, caso tenha algum outro campo padrão o anterior será atualizado para um campo <b>Não padrão</b>
                                </Alert>

                                <div className="d-grid gap-2 mb-3 mt-4">
                                    <Button
                                        variant="success"
                                        type="submit"
                                        disabled={values.loading}
                                    >
                                        {values.loading
                                            ? <Spinner as="span" animation="border" size="sm" />
                                            : <>Cadastrar</>
                                        }
                                    </Button>
                                </div>
                            </Form>
                        )}
                    </Formik>

                </Modal.Body>
            </Modal>
            {/* MODAL NEW REGISTER */}

            {/* MODAL EDIT REGISTER */}
            <Modal
                className="scroll-out"
                show={modalEditRegister}
                size='md'
                centered
                onHide={() => setModalEditRegister(false)}
            >
                <Modal.Body>
                    <Row>
                        <Col xs={11}>
                            &nbsp;
                        </Col>
                        <Col xs={1}>
                            <div className='d-flex justify-content-end cursor-pointer' onClick={() => setModalEditRegister(false)}>
                                <CsLineIcons icon="close" className="text-primary" size={20} />
                            </div>
                        </Col>
                    </Row>

                    <h4>Editar</h4>

                    {loadingIdData
                        ? <>
                            <div className="align-items-center">
                                <Spinner as="span" animation="border" size="md" />

                                <div>Carregando...</div>
                            </div>
                        </>
                        : <Formik
                            initialValues={{
                                name: idData.name,
                                icon: idData.icon,
                                default: idData.default ? idData.default : false,
                                color: idData.color
                            }}

                            validationSchema={validationSchema}

                            onSubmit={async (values, { resetForm }) => {
                                try {
                                    const response = await api.post(`/api/v1/private/email_type/${idEdit}`, values)

                                    resetForm()

                                    Swal.fire({
                                        title: response.data.title,
                                        text: response.data.message,
                                        icon: 'success',
                                        confirmButtonText: 'Fechar'
                                    }).then((result) => {
                                        setModalEditRegister(false)
                                        loadData()
                                    })
                                } catch (error) {
                                    Swal.fire({
                                        title: error.response.data.title,
                                        text: error.response.data.message,
                                        icon: 'error',
                                        confirmButtonText: 'Fechar'
                                    })
                                }
                            }}
                        >
                            {({ values, errors, touched, setFieldValue }) => (
                                <Form className="tooltip-end-bottom mt-4">
                                    <div className="mb-3  form-group tooltip-end-top">
                                        <div className='label'> Nome </div>
                                        <Field className="form-control" disabled={values.loading} type="text" name="name" value={values.name} />
                                        {errors.name && touched.name && <div className="d-block invalid-tooltip">{errors.name}</div>}
                                    </div>

                                    <div className="mb-3  form-group tooltip-end-top">
                                        <div className='label'> Icone </div>
                                        <ReactSelect
                                            placeholder=""
                                            classNamePrefix="react-select"
                                            options={icons}
                                            value={
                                                icons.filter(option =>
                                                    option.label === values.icon)
                                            }
                                            onChange={e => setFieldValue('icon', e.label)}
                                            formatOptionLabel={formatOptionLabel}
                                        />
                                        {errors.icon && touched.icon && <div className="d-block invalid-tooltip">{errors.icon}</div>}
                                    </div>

                                    <div className="mb-4  form-group tooltip-end-top">
                                        <div className='label'> Cor </div>
                                        <div className='d-flex justify-content-center align-items-center'>
                                            <SketchPicker
                                                color={values.color ? values.color : false}
                                                onChange={(e) => setFieldValue('color', e.hex)}
                                            />
                                        </div>
                                    </div>

                                    <label>
                                        Este atributo será padrão? &nbsp;
                                        <Field className="form-check-input" type="checkbox" name="default" />
                                    </label>

                                    <Alert variant='info' className='mt-4 mb-4'>
                                        Ao seleciona este campo, caso tenha algum outro campo padrão o anterior será atualizado para um campo <b>Não padrão</b>
                                    </Alert>

                                    <div className="d-grid gap-2 mb-3 mt-4">
                                        <Button
                                            variant="success"
                                            type="submit"
                                            disabled={values.loading}
                                        >
                                            {values.loading
                                                ? <Spinner as="span" animation="border" size="sm" />
                                                : <>Editar</>
                                            }
                                        </Button>
                                    </div>
                                </Form>
                            )}
                        </Formik>
                    }


                </Modal.Body>
            </Modal>
            {/* MODAL EDIT REGISTER */}
        </>
    );
};

export default Component;
