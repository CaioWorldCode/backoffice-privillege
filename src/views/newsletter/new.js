import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Button, Spinner, Alert } from 'react-bootstrap';
import HtmlHead from 'components/html-head/HtmlHead';
import BreadcrumbList from 'components/breadcrumb-list/BreadcrumbList';
import CsLineIcons from 'cs-line-icons/CsLineIcons';
import { Field, Form, Formik } from 'formik';
import { Editor } from "react-draft-wysiwyg";
import { ContentState, EditorState } from 'draft-js';
import { convertToHTML } from 'draft-convert';
import Swal from 'sweetalert2';
import api from 'services/api';
import { Redirect } from 'react-router-dom';
import ReactSelect from 'react-select';
import htmlToDraft from 'html-to-draftjs';

const getInitialState = (defaultValue) => {
    if (defaultValue) {
        const blocksFromHtml = htmlToDraft(defaultValue);
        const { contentBlocks, entityMap } = blocksFromHtml;
        const contentState = ContentState.createFromBlockArray(contentBlocks, entityMap);
        return EditorState.createWithContent(contentState);
    } else {
        return EditorState.createEmpty();
    }
};

const DashboardsAnalytic = (props) => {
    const [editorState, setEditorState] = useState(false);
    const [convertedContent, setConvertedContent] = useState(null);
    const [redirect, setRedirect] = useState(false);
    const [redirectUrl, setRedirectUrl] = useState('');
    const [idEdit, setIdEdit] = useState(false);
    const [data, setData] = useState(false)
    const [loading, setLoading] = useState(true)
    const [loadingParams, setLoadingParams] = useState(true)
    const [newsletterType, setNewsletterType] = useState([])
    const [errors, setErrors] = useState([])

    useEffect(() => {
        if (!loading) {
            let html = convertToHTML(editorState.getCurrentContent())
            setConvertedContent(html)
        }
    }, [editorState]);

    useEffect(() => {

        if (props.match.params.slug) {
            setIdEdit(props.match.params.slug)
            loadContract(props.match.params.slug)
        } else {
            setLoading(false)
        }
        getParams()
    }, [])

    const title = idEdit ? 'Editar notícia' : 'Nova notícia'
    const description = idEdit ? 'Editar notícia' : 'Nova notícia'

    const breadcrumbs = [
        { to: '', text: 'Home' },
        { to: 'newsletter', text: idEdit ? 'Editar notícia' : 'Nova notícia' },
        { to: 'new', text: idEdit ? 'Editar notícia' : 'Nova notícia' },
    ]

    const loadContract = async (id) => {
        try {
            const response = await api.get(`/api/v1/private/newsletter/${id}`)
            setData(response.data)
            if (response.data.content) {
                setEditorState(getInitialState(`${response.data.content}`))
            }
        } catch (error) {
        }
        setLoading(false)
    }

    const getParams = async () => {
        let array_newsletter_type = []

        try {
            const response = await api.get(`/api/v1/private/newsletter_type`)

            response.data.data.map((row) => {
                array_newsletter_type.push({
                    label: row.name,
                    value: row.id
                })
            })

            setNewsletterType(array_newsletter_type)

        } catch (error) {

        }

        setLoadingParams(false)
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
                                        newsletter_type_id: data.newsletter_type_id ? data.newsletter_type_id : false,
                                        active: true,
                                    }}

                                    onSubmit={async (values, { resetForm }) => {
                                        let array_errors = []

                                        if (values.title.length < 3) { array_errors.push({ 'label': 'O campo título é obrigatório' }) }
                                        if (values.description.length < 3) { array_errors.push({ 'label': 'O campo descrição é obrigatório' }) }
                                        if (!values.newsletter_type_id) { array_errors.push({ 'label': 'Informe um tipo de notícia' }) }

                                        setErrors(array_errors)

                                        if (array_errors.length > 0) {
                                            return
                                        }

                                        setErrors(false)

                                        try {
                                            const response = await api.post(`/api/v1/private/newsletter/${data.id}`, {
                                                title: values.title,
                                                description: values.description,
                                                content: convertedContent,
                                                newsletter_type_id: values.newsletter_type_id,
                                                active: true,
                                            })

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
                                                    <div className="mb-3 form-group tooltip-end-top">
                                                        <div className='label'> Tipo de notícia </div>
                                                        <ReactSelect
                                                            placeholder=""
                                                            classNamePrefix="react-select"
                                                            options={newsletterType}
                                                            value={newsletterType.filter(option => option.value === values.newsletter_type_id)}
                                                            onChange={e => setFieldValue('newsletter_type_id', e.value)}
                                                        />
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
                                                            editorStyle={{ height: '300px', width: '100%' }}

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
                                            contract_type_id: false
                                        }}

                                        onSubmit={async (values, { resetForm }) => {
                                            let array_errors = []

                                            if (values.title.length < 3) { array_errors.push({ 'label': 'O campo título é obrigatório' }) }
                                            if (values.description.length < 3) { array_errors.push({ 'label': 'O campo descrição é obrigatório' }) }
                                            if (!values.newsletter_type_id) { array_errors.push({ 'label': 'Informe um tipo de notícia' }) }

                                            setErrors(array_errors)

                                            if (array_errors.length > 0) {
                                                return
                                            }

                                            setErrors(false)

                                            try {
                                                const response = await api.post(`/api/v1/private/newsletter`, {
                                                    title: values.title,
                                                    description: values.description,
                                                    newsletter_type_id: values.newsletter_type_id,
                                                    content: convertedContent,
                                                    active: true,
                                                })

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
                                                        <div className="mb-3 form-group tooltip-end-top">
                                                            <div className='label'> Tipo de contato </div>
                                                            <ReactSelect
                                                                placeholder=""
                                                                classNamePrefix="react-select"
                                                                options={newsletterType}
                                                                value={newsletterType.filter(option => option.value === values.newsletter_type_id)}
                                                                onChange={e => setFieldValue('newsletter_type_id', e.value)}
                                                            />
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

                                    {errors.length > 0
                                        ? <>
                                            <Row className='w-100'>
                                                <Col xs={2}></Col>
                                                <Col xs={8}>
                                                    <div className='w-100'>
                                                        <Alert variant="danger w-100">
                                                            <b>Verifique os erros abaixo:</b>
                                                            {errors.map((row, index) => {
                                                                return (
                                                                    <div key={index} style={{ marginLeft: 10 }}>
                                                                        <CsLineIcons icon="arrow-double-right" size={12} /> {row.label}
                                                                    </div>
                                                                )
                                                            })}
                                                        </Alert>
                                                    </div>
                                                </Col>
                                            </Row>

                                        </>
                                        : <></>
                                    }
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
