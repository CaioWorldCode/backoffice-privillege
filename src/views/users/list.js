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
import ReactSelect from 'react-select';
import axios from 'axios';


const Component = () => {
    const title = 'Usuários';
    const description = 'Usuários';

    const breadcrumbs = [
        { to: '', text: 'Home' },
        { to: 'users', text: 'Usuários' },
        { to: 'list', text: 'Listar' },
    ]

    const columns = [
        { name: 'Id', acessor: 'id', column: 'id' },
        { name: 'Nome', acessor: 'name', column: 'name', format: 'username' },
        { name: 'Email', acessor: 'email', column: 'email' },
        { name: 'Status', acessor: 'status', column: 'status' },
        { name: 'Nível', acessor: 'role', column: 'role' },
        { name: 'Data', acessor: 'created_at', column: 'created_at' },
        { name: '', acessor: 'custom', column: 'custom' },
    ]

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

    const loadData = async (pageLimit, page) => {

        document.body.classList.add('spinner')

        pageLimit = limit

        try {
            let url = `/api/v1/private/user/list?order=${orderBy}&limit=${pageLimit}&page=${page}&search=${searchField}`

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


    const [modalView, setModalView] = useState(false)
    const [modalEdit, setModalEdit] = useState(false)
    const [modalChangePass, setModalChangePass] = useState(false)
    const [userData, setUserData] = useState(false)
    const [modalNewRegister, setModalNewRegister] = useState(false)

    const [status] = useState([
        { label: 'Approved', value: 'Approved' },
        { label: 'Disapproved', value: 'Disapproved' },
        { label: 'Suspended', value: 'Suspended' },
        { label: 'Pending', value: 'Pending' },
    ])

    const [role] = useState([
        { label: 'Master', value: 'Master' },
        { label: 'Admin', value: 'Admin' },
        { label: 'Customer', value: 'Customer' },
        { label: 'Client', value: 'Client' },
        { label: 'Tester', value: 'Tester' },
    ])

    const callView = (data) => {
        setUserData(data)
        setModalView(true)
    }

    const callEdit = (data) => {
        setUserData(data)
        setModalEdit(true)
    }

    const callChangePass = (data) => {
        setUserData(data)
        setModalChangePass(true)
    }

    const validationSchema = Yup.object().shape({
        name: Yup.string().required('Este campo é obrigatório'),
        password: Yup.string().required('Este campo é obrigatório'),
        email: Yup.string().required('Este campo é obrigatório'),
        role: Yup.string().required('Este campo é obrigatório'),
        status: Yup.string().required('Este campo é obrigatório'),
    })

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
                            Novo Usuário <CsLineIcons icon="user" />
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
                                                                                <Button onClick={() => callView(row)} variant="outline-success" className="btn-icon btn-icon-only mb-1">
                                                                                    <CsLineIcons icon="eye" />
                                                                                </Button> &nbsp;&nbsp;
                                                                                <Button onClick={() => callEdit(row)} variant="outline-info" className="btn-icon btn-icon-only mb-1">
                                                                                    <CsLineIcons icon="edit" />
                                                                                </Button>&nbsp;&nbsp;
                                                                                <Button onClick={() => callChangePass(row)} variant="outline-warning" className="btn-icon btn-icon-only mb-1">
                                                                                    <CsLineIcons icon="lock-off" />
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

            {/* MODAL REGISTER */}
            <Modal
                show={modalNewRegister}
                size='lg'
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
                            email: '',
                            password: '',
                            status: '',
                            role: ''
                        }}

                        validationSchema={validationSchema}

                        onSubmit={async (values, { resetForm }) => {
                            try {
                                const response = await api.post(`/api/v1/private/user/create`, values)

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
                            <Form className=" mt-4">
                                <div className="mb-3  form-group tooltip-end-top">
                                    <div className='label'> Nome </div>
                                    <Field className="form-control" disabled={values.loading} type="text" name="name" value={values.name} />
                                    {errors.name && touched.name && <div className="d-block invalid-tooltip">{errors.name}</div>}
                                </div>

                                <div className="mb-3  form-group tooltip-end-top">
                                    <div className='label'> Email </div>
                                    <Field className="form-control" disabled={values.loading} type="text" name="email" value={values.email} />
                                    {errors.email && touched.email && <div className="d-block invalid-tooltip">{errors.email}</div>}
                                </div>

                                <div className="mb-3  form-group tooltip-end-top">
                                    <div className='label'> Senha </div>
                                    <Field className="form-control" disabled={values.loading} type="password" name="password" value={values.password} />
                                    {errors.password && touched.password && <div className="d-block invalid-tooltip">{errors.password}</div>}
                                </div>

                                <div className="mb-3 form-group tooltip-end-top">
                                    <div className='label'> Status </div>
                                    <ReactSelect
                                        placeholder=""
                                        classNamePrefix="react-select"
                                        options={status}
                                        value={status.filter(option => option.value === values.status)}
                                        onChange={e => setFieldValue('status', e.value)}
                                    />
                                    {errors.status && touched.status && <div className="d-block invalid-tooltip">{errors.status}</div>}
                                </div>

                                <div className="mb-3 form-group tooltip-end-top">
                                    <div className='label'> Nível </div>
                                    <ReactSelect
                                        placeholder=""
                                        classNamePrefix="react-select"
                                        options={role}
                                        value={role.filter(option => option.value === values.role)}
                                        onChange={e => setFieldValue('role', e.value)}
                                    />
                                    {errors.role && touched.role && <div className="d-block invalid-tooltip">{errors.role}</div>}
                                </div>

                                <Row className='mt-2 mb-2'>
                                    <Col xs={12}>
                                        <div className='d-flex justify-content-end align-items-end'>
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
                                    </Col>
                                </Row>
                            </Form>
                        )}
                    </Formik>
                </Modal.Body>
            </Modal>
            {/* MODAL REGISTER */}

            {userData
                ? <>
                    <Modal
                        show={modalView}
                        size='lg'
                        centered
                        onHide={() => setModalView(false)}
                    >
                        <Modal.Body>
                            <Row>
                                <Col xs={11}>
                                    &nbsp;
                                </Col>
                                <Col xs={1}>
                                    <div className='d-flex justify-content-end cursor-pointer' onClick={() => setModalView(false)}>
                                        <CsLineIcons icon="close" className="text-primary" size={20} />
                                    </div>
                                </Col>
                            </Row>


                            <Row>
                                <Col xs={12}>
                                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', }}>
                                        <div style={{
                                            textTransform: 'uppercase', width: 100, height: 100, borderRadius: '50%', backgroundColor: '#0C5DAF', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: 40, fontWeight: 'bold', color: 'white'
                                        }}>
                                            {userData?.name[0]}{userData?.name[1]}
                                        </div>
                                    </div>
                                </Col>
                            </Row>

                            <Row className='mt-3 mb-3'>
                                <Col xs={12} className="mt-4">
                                    <span className='text-primary'><b>Nome:</b> </span>  {userData?.name}
                                </Col>

                                <Col xs={12} className="mt-4">
                                    <span className='text-primary'><b>E-mail:</b> </span>  {userData?.email}
                                </Col>

                                <Col xs={12} className="mt-4">
                                    <span className='text-primary'><b>Status:</b> </span>  {userData?.status}
                                </Col>

                                <Col xs={12} className="mt-4">
                                    <span className='text-primary'><b>Nível:</b> </span>  {userData?.role}
                                </Col>

                                <Col xs={12} className="mt-4">
                                    <span className='text-primary'><b>Criação:</b> </span>  {userData?.created_at}
                                </Col>
                            </Row>

                        </Modal.Body>
                    </Modal>
                </>
                : <></>
            }

            {/* MODAL EDIT */}
            <Modal
                show={modalEdit}
                size='lg'
                centered
                onHide={() => setModalEdit(false)}
            >
                <Modal.Body>
                    <Row>
                        <Col xs={11}>
                            &nbsp;
                        </Col>
                        <Col xs={1}>
                            <div className='d-flex justify-content-end cursor-pointer' onClick={() => setModalEdit(false)}>
                                <CsLineIcons icon="close" className="text-primary" size={20} />
                            </div>
                        </Col>
                    </Row>


                    <h4>Editar cadastro</h4>

                    <Formik
                        initialValues={{
                            name: userData?.name,
                            email: userData?.email,
                            status: userData?.status,
                            role: userData?.role,
                        }}


                        onSubmit={async (values, { resetForm }) => {
                            try {
                                const response = await api.post(`/api/v1/private/user/update/${userData?.id}`, values)

                                resetForm()

                                Swal.fire({
                                    title: response.data.title,
                                    text: response.data.message,
                                    icon: 'success',
                                    confirmButtonText: 'Fechar'
                                }).then((result) => {
                                    setModalEdit(false)
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
                            <Form className=" mt-4">
                                <div className="mb-3  form-group tooltip-end-top">
                                    <div className='label'> Nome </div>
                                    <Field className="form-control" disabled={values.loading} type="text" name="name" value={values.name} />
                                    {errors.name && touched.name && <div className="d-block invalid-tooltip">{errors.name}</div>}
                                </div>

                                <div className="mb-3  form-group tooltip-end-top">
                                    <div className='label'> Email </div>
                                    <Field className="form-control" disabled={values.loading} type="text" name="email" value={values.email} />
                                    {errors.email && touched.email && <div className="d-block invalid-tooltip">{errors.email}</div>}
                                </div>

                                <div className="mb-3 form-group tooltip-end-top">
                                    <div className='label'> Status </div>
                                    <ReactSelect
                                        placeholder=""
                                        classNamePrefix="react-select"
                                        options={status}
                                        value={status.filter(option => option.value === values.status)}
                                        onChange={e => setFieldValue('status', e.value)}
                                    />
                                    {errors.status && touched.status && <div className="d-block invalid-tooltip">{errors.status}</div>}
                                </div>

                                <div className="mb-3 form-group tooltip-end-top">
                                    <div className='label'> Nível </div>
                                    <ReactSelect
                                        placeholder=""
                                        classNamePrefix="react-select"
                                        options={role}
                                        value={role.filter(option => option.value === values.role)}
                                        onChange={e => setFieldValue('role', e.value)}
                                    />
                                    {errors.role && touched.role && <div className="d-block invalid-tooltip">{errors.role}</div>}
                                </div>

                                <Row className='mt-2 mb-2'>
                                    <Col xs={12}>
                                        <div className='d-flex justify-content-end align-items-end'>
                                            <Button
                                                variant="success"
                                                type="submit"
                                                disabled={values.loading}
                                            >
                                                {values.loading
                                                    ? <Spinner as="span" animation="border" size="sm" />
                                                    : <>Atualizar</>
                                                }
                                            </Button>
                                        </div>
                                    </Col>
                                </Row>
                            </Form>
                        )}
                    </Formik>
                </Modal.Body>
            </Modal>
            {/* MODAL EDIT */}

            {/* CHANGE PASS */}

            <Modal
                show={modalChangePass}
                size='lg'
                centered
                onHide={() => setModalChangePass(false)}
            >
                <Modal.Body>
                    <Row>
                        <Col xs={11}>
                            &nbsp;
                        </Col>
                        <Col xs={1}>
                            <div className='d-flex justify-content-end cursor-pointer' onClick={() => setModalChangePass(false)}>
                                <CsLineIcons icon="close" className="text-primary" size={20} />
                            </div>
                        </Col>
                    </Row>


                    <h4>Alterar senha</h4>

                    <Formik
                        initialValues={{
                            password: '',
                        }}

                        onSubmit={async (values, { resetForm }) => {
                            try {
                                const response = await api.post(`/api/v1/private/user/update_password/${userData?.id}`, values)

                                resetForm()

                                Swal.fire({
                                    title: response.data.title,
                                    text: response.data.message,
                                    icon: 'success',
                                    confirmButtonText: 'Fechar'
                                }).then((result) => {
                                    setModalChangePass(false)
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
                            <Form className=" mt-4">
                                <div className="mb-3  form-group tooltip-end-top">
                                    <div className='label'> Nova senha </div>
                                    <Field className="form-control" disabled={values.loading} type="password" name="password" value={values.password} />
                                    {errors.password && touched.password && <div className="d-block invalid-tooltip">{errors.password}</div>}
                                </div>

                                <Row className='mt-2 mb-2'>
                                    <Col xs={12}>
                                        <div className='d-flex justify-content-end align-items-end'>
                                            <Button
                                                variant="info"
                                                type="submit"
                                                disabled={values.loading}
                                            >
                                                {values.loading
                                                    ? <Spinner as="span" animation="border" size="sm" />
                                                    : <>Atualizar senha</>
                                                }
                                            </Button>
                                        </div>
                                    </Col>
                                </Row>
                            </Form>
                        )}
                    </Formik>
                </Modal.Body>
            </Modal>
            {/* CHANGE PASS */}
        </>
    )
}

export default Component
