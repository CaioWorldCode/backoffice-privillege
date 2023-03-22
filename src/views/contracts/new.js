import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Button, Spinner } from 'react-bootstrap';
import HtmlHead from 'components/html-head/HtmlHead';
import BreadcrumbList from 'components/breadcrumb-list/BreadcrumbList';
import { Field, Form, Formik } from 'formik';
import { Editor } from "react-draft-wysiwyg";
import { EditorState } from 'draft-js';
import { convertToHTML } from 'draft-convert';
import Swal from 'sweetalert2';
import api from 'services/api';
import { Redirect, useHistory } from 'react-router-dom';


const DashboardsAnalytic = (props) => {
    const [editorState, setEditorState] = useState(() => EditorState.createEmpty());
    const [convertedContent, setConvertedContent] = useState(null);
    const [redirect, setRedirect] = useState(false);
    const [redirectUrl, setRedirectUrl] = useState('');
    const [idEdit, setIdEdit] = useState(false);
    const [data, setData] = useState(false)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        let html = convertToHTML(editorState.getCurrentContent());
        setConvertedContent(html);

    }, [editorState]);


    useEffect(() => {
        if (props.match.params.slug) {
            setIdEdit(props.match.params.slug)
            loadContract(props.match.params.slug)
        }else{
            setLoading(false)
        }
    }, [])

    const title = idEdit ? 'Editar Contrato' : 'Novo contrato';
    const description = idEdit ? 'Editar Contrato' : 'Novo contrato';

    const breadcrumbs = [
        { to: '', text: 'Home' },
        { to: 'contracts', text: idEdit ? 'Editar Contrato' : 'Novo contrato' },
        { to: 'new', text: idEdit ? 'Editar Contrato' : 'Novo contrato' },
    ]

    const loadContract = async (id) => {
        try {
            const response = await api.get(`/api/v1/private/contract/${id}`)

            setData(response.data)
        } catch (error) {

        }

        setLoading(false)
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

            {loading
                ? <></>
                : <>
                    {data ? <>
                        <Card className=" ">
                            <Card.Body className=" align-items-center">

                                <Formik
                                    initialValues={{
                                        title: data.title ? data.title : '',
                                        description: data ? data.description : '',
                                        active: true,
                                    }}

                                    onSubmit={async (values, { resetForm }) => {
                                        try {
                                            const response = await api.post(`/api/v1/private/contract/${data.id}`, {
                                                title: values.title,
                                                description: values.description,
                                                content: convertedContent,
                                                active: true,
                                            })

                                            resetForm()

                                            Swal.fire({
                                                title: response.data.title,
                                                text: response.data.message,
                                                icon: 'success',
                                                confirmButtonText: 'Fechar'
                                            }).then((result) => {
                                                setRedirect(true)
                                                setRedirectUrl('/contracts/list')
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
                                            <Row>
                                                <Col xs={2}></Col>
                                                <Col xs={8}>
                                                    <div className="mb-3  form-group tooltip-end-top">
                                                        <div className='label'> Título </div>
                                                        <Field className="form-control" disabled={values.loading} type="text" name="title" value={values.title} />
                                                        {errors.title && touched.title && <div className="d-block invalid-tooltip">{errors.title}</div>}
                                                    </div>
                                                </Col>
                                            </Row>

                                            <Row>
                                                <Col xs={2}></Col>
                                                <Col xs={8}>
                                                    <div className="mb-3  form-group tooltip-end-top">
                                                        <div className='label'> Descrição </div>
                                                        <Field className="form-control" disabled={values.loading} type="text" name="description" value={values.description} />
                                                        {errors.description && touched.description && <div className="d-block invalid-tooltip">{errors.description}</div>}
                                                    </div>
                                                </Col>
                                            </Row>

                                            <Row>
                                                <Col xs={2}></Col>
                                                <Col xs={8}>
                                                    <div className="mb-3  form-group tooltip-end-top">
                                                        <div className='label'> Conteúdo </div>
                                                    </div>
                                                    <div style={{ background: 'white', border: '1px solid #ccc' }}>
                                                        <Editor
                                                            editorState={editorState}
                                                            onEditorStateChange={setEditorState}
                                                            toolbarClassName="toolbarClassName"
                                                            wrapperClassName="demo-wrapper"
                                                            editorClassName="demo-editor"
                                                            editorStyle={{ height: '300px', }}

                                                        />
                                                    </div>
                                                </Col>
                                            </Row>


                                            <Row>
                                                <Col xs={2}></Col>
                                                <Col xs={8}>
                                                    <div className='mt-3 mb-3'>
                                                        <div className='d-flex justify-content-end align-items-end'>
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
                                                    </div>
                                                </Col>
                                            </Row>
                                        </Form>
                                    )}
                                </Formik>

                            </Card.Body>
                        </Card>
                    </>
                        : <>
                            <Card className=" ">
                                <Card.Body className=" align-items-center">

                                    <Formik
                                        initialValues={{
                                            title: '',
                                            description: '',
                                            active: true,
                                        }}

                                        onSubmit={async (values, { resetForm }) => {
                                            try {
                                                const response = await api.post(`/api/v1/private/contract`, {
                                                    title: values.title,
                                                    description: values.description,
                                                    content: convertedContent,
                                                    active: true,
                                                })

                                                resetForm()

                                                Swal.fire({
                                                    title: response.data.title,
                                                    text: response.data.message,
                                                    icon: 'success',
                                                    confirmButtonText: 'Fechar'
                                                }).then((result) => {
                                                    setRedirect(true)
                                                    setRedirectUrl('/contracts/list')
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
                                                <Row>
                                                    <Col xs={2}></Col>
                                                    <Col xs={8}>
                                                        <div className="mb-3  form-group tooltip-end-top">
                                                            <div className='label'> Título </div>
                                                            <Field className="form-control" disabled={values.loading} type="text" name="title" value={values.title} />
                                                            {errors.title && touched.title && <div className="d-block invalid-tooltip">{errors.title}</div>}
                                                        </div>
                                                    </Col>
                                                </Row>

                                                <Row>
                                                    <Col xs={2}></Col>
                                                    <Col xs={8}>
                                                        <div className="mb-3  form-group tooltip-end-top">
                                                            <div className='label'> Descrição </div>
                                                            <Field className="form-control" disabled={values.loading} type="text" name="description" value={values.description} />
                                                            {errors.description && touched.description && <div className="d-block invalid-tooltip">{errors.description}</div>}
                                                        </div>
                                                    </Col>
                                                </Row>

                                                <Row>
                                                    <Col xs={2}></Col>
                                                    <Col xs={8}>
                                                        <div className="mb-3  form-group tooltip-end-top">
                                                            <div className='label'> Conteúdo </div>
                                                        </div>
                                                        <div style={{ background: 'white', border: '1px solid #ccc' }}>
                                                            <Editor
                                                                editorState={editorState}
                                                                onEditorStateChange={setEditorState}
                                                                toolbarClassName="toolbarClassName"
                                                                wrapperClassName="demo-wrapper"
                                                                editorClassName="demo-editor"
                                                                editorStyle={{ height: '300px', }}

                                                            />
                                                        </div>
                                                    </Col>
                                                </Row>


                                                <Row>
                                                    <Col xs={2}></Col>
                                                    <Col xs={8}>
                                                        <div className='mt-3 mb-3'>
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
                                                        </div>
                                                    </Col>
                                                </Row>
                                            </Form>
                                        )}
                                    </Formik>

                                </Card.Body>
                            </Card>
                        </>
                    }
                </>
            }


        </>
    );
};

export default DashboardsAnalytic;
