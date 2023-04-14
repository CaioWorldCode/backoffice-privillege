import React, { useEffect, useState } from 'react';
import { Row, Col, Spinner, Dropdown, InputGroup, FormControl, Card, Alert, Button, Modal, Form } from 'react-bootstrap';
import HtmlHead from 'components/html-head/HtmlHead';
import BreadcrumbList from 'components/breadcrumb-list/BreadcrumbList';
import moment from 'moment';
import pt from 'date-fns/locale/pt';
import DatePicker from 'react-datepicker';
import api from 'services/api';
import CsLineIcons from 'cs-line-icons/CsLineIcons';
import PaginationTable from 'helpers/pagination';
import formatField from 'helpers/formatField';
import Swal from 'sweetalert2'
import { Redirect } from 'react-router-dom';
import ReactSelect from 'react-select';


const Component = () => {
    const title = 'Arquivos';
    const description = 'Arquivos';

    const breadcrumbs = [
        { to: '', text: 'Home' },
        { to: 'uploads', text: 'Arquivos' },
        { to: 'new', text: 'Novo' },
    ]


    const paths = [
        {
            label: 'Público',
            value: 'public'
        },

        {
            label: 'Privado',
            value: 'private'
        },
    ]


    const [redirect, setRedirect] = useState(false)
    const [redirectUrl, setRedirectUrl] = useState(false)

    const [fileType, setFileType] = useState(false)
    const [user, setUser] = useState(false)
    const [users, setUsers] = useState([])
    const [file, setFile] = useState(false)
    const [filename, setFileName] = useState('')
    const [loading, setLoading] = useState(false)


    useEffect(() => {
        getUsers()
    }, [])

    const getUsers = async () => {
        try {

            const response = await api.get(`/api/v1/private/users/select`)

            let array_users = []

            response.data.map((row) => {
                array_users.push({
                    label: row.name,
                    value: row.email
                })
            })

            setUsers(array_users)

        } catch (error) {

        }
    }


    const handleFile = (e) => {
        setFile(e.target.files[0])
    }

    const submitFile = async (e) => {
        e.preventDefault()



        if (fileType === 'private') {
            if (!user || user === '') {
                Swal.fire({
                    title: 'Erro ao enviar arquivo',
                    text: 'É necessário informar um usuário para continuar',
                    icon: 'error',
                    confirmButtonText: 'Fechar'
                })
                return
            }
        }

        if (!file) {
            Swal.fire({
                title: 'Erro ao enviar arquivo',
                text: 'Selecione um arquivo',
                icon: 'error',
                confirmButtonText: 'Fechar'
            })
            return
        }

        if (!filename) {
            Swal.fire({
                title: 'Erro ao enviar arquivo',
                text: 'Nome do arquivo é obrigatório',
                icon: 'error',
                confirmButtonText: 'Fechar'
            })
            return
        }


        let folder = ''

        if (fileType === 'private') {
            folder = 'user/' + user
        } else {
            folder = 'public'
        }

        let extra = {
            filename: filename
        }

        const formData = new FormData();

        formData.set('file', file)
        formData.set('directory', folder)
        formData.set('extra', JSON.stringify(extra))

        try {
            const response = await api.post(`/api/v1/private/upload`, formData)

            if (response) {
                Swal.fire({
                    title: 'Arquivo enviado',
                    text: 'Arquivo enviado com sucesso, verifique a lista de uploads',
                    icon: 'success',
                    confirmButtonText: 'Fechar'
                }).then((result) => {
                    setRedirectUrl('/uploads/list')
                    setTimeout(() => {
                        setRedirect(true)
                    }, 300)
                })
            }
        } catch (error) {

        }
    }

    return (
        <>
            {redirect
                ? <Redirect to={redirectUrl} />
                : false
            }

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

            <Card className=" ">
                <Card.Body className=" align-items-center">

                    <Form onSubmit={(e) => submitFile(e)} className="mt-4" style={{ minWidth: '600px' }}>

                        <Row>
                            <Col sm="12" xxl="12">
                                <Card className="sh-19">
                                    <Card.Body className="text-center d-flex flex-column justify-content-center align-items-center">
                                        <CsLineIcons icon="upload" className="text-info" size={50} />
                                        <p className="heading mb-0">
                                            Upload de arquivo
                                        </p>

                                        <p className="text-medium mb-0 text-muted">
                                           Preencha os campos abaixo para enviar um arquivo.
                                        </p>
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>

                        <Row>
                            <Col xs={12}>
                                <div className="mb-3 form-group tooltip-end-top">
                                    <div className='label'> Tipo de notícia </div>
                                    <ReactSelect
                                        placeholder=""
                                        classNamePrefix="react-select"
                                        options={paths}
                                        onChange={e => setFileType(e.value)}
                                    />
                                </div>
                            </Col>
                        </Row>

                        {fileType === 'private'
                            ? <>
                                <Row>
                                    <Col xs={12}>
                                        <div className="mb-3 form-group tooltip-end-top">
                                            <div className='label'> Informe o usuário </div>
                                            <ReactSelect
                                                placeholder=""
                                                classNamePrefix="react-select"
                                                options={users}
                                                onChange={e => setUser(e.value)}
                                            />
                                        </div>
                                    </Col>
                                </Row>
                            </>
                            : false
                        }

                        <Row>
                            <Col xs={12}>
                                <div className="mb-3 form-group tooltip-end-top">
                                    <div className='label'> Nome do arquivo </div>
                                    <input className='form-control' type="text" onChange={e => setFileName(e.target.value)} />
                                </div>
                            </Col>
                        </Row>

                        <Row>
                            <Col xs={12}>
                                <div className="mb-3 form-group tooltip-end-top">
                                    <div className='label'> Selecione um arquivo </div>
                                    <input type="file" onChange={e => handleFile(e)} />
                                </div>
                            </Col>
                        </Row>

                        <Row>
                            <Col xs={12}>
                                <div className='mt-3 mb-3'>
                                    <div className='d-flex justify-content-end align-items-end'>
                                        <Button
                                            variant="success"
                                            type="submit"
                                            onClick={(e) => submitFile(e)}
                                            disabled={loading}
                                        >
                                            {loading
                                                ? <Spinner as="span" animation="border" size="sm" />
                                                : <>Enviar</>
                                            }
                                        </Button>
                                    </div>
                                </div>
                            </Col>
                        </Row>

                    </Form>

                </Card.Body>
            </Card >


        </>
    );
};

export default Component;
