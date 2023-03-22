import BreadcrumbList from "components/breadcrumb-list/BreadcrumbList"
import HtmlHead from "components/html-head/HtmlHead"
import React from "react"
import { Button, Card, Col, Form, Row } from "react-bootstrap"


const NewUser = (props) => {

    const title = 'Usuários'
    const description = ''

    const breadcrumbs = [
        { to: 'home', text: 'Home' },
        { to: '', text: 'Usuários' },
        { to: '', text: 'Cadastrar' },
    ]



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

                            <Row>
                                <Col xs="12">
                                    <section className="scroll-section" id="sizes">
                                        <h2 className="small-title">Cadastrar novo usuário</h2>
                                        <Card body className="mb-5">
                                            <Form>
                                                <Row className="g-3">
                                                    <Col md="6">
                                                        <Form.Label>Email</Form.Label>
                                                        <Form.Control type="email" />
                                                    </Col>

                                                    <Col md="6">
                                                        <Form.Label>Nome</Form.Label>
                                                        <Form.Control as="text" />
                                                    </Col>

                                                    <Col md="6">
                                                        <Form.Label>Senha</Form.Label>
                                                        <Form.Control type="password" />
                                                    </Col>

                                                    <Col md="6">
                                                        <Form.Label>Confirmar senha</Form.Label>
                                                        <Form.Control type="password" />
                                                    </Col>

                                                    <Col md="6">
                                                        <Form.Label>Permissão</Form.Label>
                                                        <Form.Control type="text" />
                                                    </Col>

                                                    <Col md="4">
                                                        <Form.Label>Acesso</Form.Label>
                                                        <Form.Control type="text" />
                                                    </Col>


                                                    <Col md="12">
                                                        <Form.Check type="checkbox" label="Enviar e-mail com acesso" id="basicCheckboxRow" />
                                                    </Col>
                                                    <Col xs="12">
                                                        <Button variant="primary">Cadastrar novo usuário</Button>
                                                    </Col>
                                                </Row>
                                            </Form>
                                        </Card>
                                    </section>
                                </Col>
                            </Row>
                        </div>
                    </section>
                </Col>
            </Row>




        </>
    )
}

export default NewUser
