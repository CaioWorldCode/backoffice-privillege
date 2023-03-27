import React, { useEffect, useState } from 'react';
import { Button, Row, Col, Card, Dropdown, Badge } from 'react-bootstrap';
import HtmlHead from 'components/html-head/HtmlHead';
import BreadcrumbList from 'components/breadcrumb-list/BreadcrumbList';
import api from 'services/api';
import CsLineIcons from 'cs-line-icons/CsLineIcons';
import ChartLogs from './chartLogs';


const DashboardsAnalytic = () => {
    const title = 'Analytic Dashboard';
    const description = 'Analytic Dashboard';

    const breadcrumbs = [
        { to: '', text: 'Home' },
        { to: 'dashboards', text: 'Dashboards' },
    ]

    const [data, setData] = useState(false)
    const [loading, setLoading] = useState(true)
    const [logValues, setLogValues] = useState(false)
    const [logLabels, setLogLabels] = useState(false)

    useEffect(() => {

        loadDashboard()

    }, [])

    const loadDashboard = async () => {
        try {
            const response = await api.get(`/api/v1/private/dashboard/home`)
            setData(response.data.data)
        } catch (error) {

        }

        try {
            const response = await api.get(`/api/v1/private/dashboard/logs`)
            setLoading(false)
            let data = response.data
            let array_values = []
            let array_labels = []

            Object.keys(data).forEach(function (key, index) {
                let val = data[key]
                let lab = key
                array_values.push(val)
                array_labels.push(lab)
            })

            setLogLabels(array_labels)
            setLogValues(array_values)
        } catch (error) {

        }
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

            <Row className="g-2">
                <Col sm="3">
                    <Card className="sh-11 hover-scale-up cursor-pointer">
                        <Card.Body className="h-100 py-3 align-items-center">
                            <Row className="g-0 h-100 align-items-center">
                                <Col xs="auto" className="pe-3">
                                    <div className="bg-gradient-light sh-5 sw-5 rounded-xl d-flex justify-content-center align-items-center">
                                        <CsLineIcons icon="user" className="text-white" />
                                    </div>
                                </Col>
                                <Col>
                                    <Row className="gx-2 d-flex justify-content-center align-items-center">
                                        <Col xs="12" className="col-12 d-flex justify-content-center align-items-center">
                                            <div className="d-flex align-items-center lh-1-25">Usuários</div>
                                        </Col>

                                        <Col xl="auto" className="col-12 d-flex justify-content-center align-items-center">
                                            <div className="cta-2 text-primary">{data.users}</div>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                </Col>
                <Col sm="3">
                    <Card className="sh-11 hover-scale-up cursor-pointer">
                        <Card.Body className="h-100 py-3 align-items-center">
                            <Row className="g-0 h-100 align-items-center">
                                <Col xs="auto" className="pe-3">
                                    <div className="bg-success sh-5 sw-5 rounded-xl d-flex justify-content-center align-items-center">
                                        <CsLineIcons icon="book" className="text-white" />
                                    </div>
                                </Col>
                                <Col>
                                    <Row className="gx-2 d-flex justify-content-center align-items-center">
                                        <Col xs="12" className="col-12 d-flex justify-content-center align-items-center">
                                            <div className="d-flex align-items-center lh-1-25">Contratos</div>
                                        </Col>

                                        <Col xl="auto" className="col-12 d-flex justify-content-center align-items-center">
                                            <div className="cta-2 text-primary">{data.contracts}</div>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                </Col>

                <Col sm="3">
                    <Card className="sh-11 hover-scale-up cursor-pointer">
                        <Card.Body className="h-100 py-3 align-items-center">
                            <Row className="g-0 h-100 align-items-center">
                                <Col xs="auto" className="pe-3">
                                    <div className="bg-warning sh-5 sw-5 rounded-xl d-flex justify-content-center align-items-center">
                                        <CsLineIcons icon="pen" className="text-white" />
                                    </div>
                                </Col>
                                <Col>
                                    <Row className="gx-2 d-flex justify-content-center align-items-center">
                                        <Col xs="12" className="col-12 d-flex justify-content-center align-items-center">
                                            <div className="d-flex align-items-center lh-1-25">Assinaturas</div>
                                        </Col>

                                        <Col xl="auto" className="col-12 d-flex justify-content-center align-items-center">
                                            <div className="cta-2 text-primary">{data.signatures}</div>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Row className="g-2 mt-4">
                <Col sm="6">
                    <Card className="mb-2 sh-10 sh-md-8">
                        <Card.Body className="pt-0 pb-0 h-100">
                            <Row className="w-100 h-100">
                                <Col xs="2" className='h-100'>
                                    <div className='d-flex align-items-center h-100'>
                                        Nome
                                    </div>
                                </Col>
                                <Col xs="5" className='h-100'>
                                    <div className='d-flex align-items-center  h-100'>
                                        E-mail
                                    </div>
                                </Col>

                                <Col xs="2" className='h-100'>
                                    <div className='d-flex align-items-center h-100'>
                                        Nível
                                    </div>
                                </Col>

                                <Col xs="3" className='h-100'>
                                    <div className='d-flex align-items-center h-100'>
                                        Status
                                    </div>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>

                    {data.last_users.map((row, index) => {
                        return (
                            <Card className="mb-2 sh-10 sh-md-8" key={index}>
                                <Card.Body className="pt-0 pb-0 h-100">
                                    <Row className="w-100 h-100">
                                        <Col xs="2" className='h-100'>
                                            <div className='d-flex align-items-center h-100'>
                                                {row.name}
                                            </div>
                                        </Col>
                                        <Col xs="5" className='h-100'>
                                            <div className='d-flex align-items-center  h-100'>
                                                {row.email}
                                            </div>
                                        </Col>

                                        <Col xs="2" className='h-100'>
                                            <div className='d-flex align-items-center h-100'>
                                                {row.role}
                                            </div>
                                        </Col>

                                        <Col xs="3" className='h-100'>
                                            <div className='d-flex align-items-center h-100'>
                                                {row.status}
                                            </div>
                                        </Col>
                                    </Row>
                                </Card.Body>
                            </Card>
                        )
                    })}
                </Col>

                <Col sm="6">
                    {!loading
                        ? <ChartLogs label={logLabels} values={logValues} />
                        : <></>
                    }

                </Col>
            </Row>

        </>
    );
};

export default DashboardsAnalytic;
