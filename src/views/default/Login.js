import React, { useState } from 'react'
import { NavLink, Redirect } from 'react-router-dom'
import { Alert, Button, Form, Spinner } from 'react-bootstrap'
import axios from 'axios'
import * as Yup from 'yup'
import { useFormik } from 'formik'
import { useDispatch } from 'react-redux'

import LayoutFullpage from 'layout/LayoutFullpage'
import CsLineIcons from 'cs-line-icons/CsLineIcons'
import HtmlHead from 'components/html-head/HtmlHead'
import { API_URL } from 'config'

import { userChangeState } from 'auth/authSlice'


const Login = () => {
	const dispatch = useDispatch()

	const title = 'Login';
	const description = 'Login Page';

	const [redirect, setRedirect] = useState(false)
	const [loading, setLoading] = useState(false)
	const [errorResponse, setErrorResponse] = useState(false)

	const validationSchema = Yup.object().shape({
		email: Yup.string().email('Informe um endereço de email válido').required('Email é obrigatório'),
		password: Yup.string().min(6, 'A senha precisa ter no mínimo 6 caracteres').required('Senha é obrigatório'),
	})

	const initialValues = {
		email: '',
		password: ''
	}

	const onSubmit = async (values) => {
		setLoading(true)


		try {
			const response = await axios.post(`${API_URL}/api/v1/auth/login`, {
				email: values.email,
				password: values.password
			})

			dispatch(userChangeState({
				'data': response.data.user,
				'token': response.data.authorization.token
			}))

			setRedirect(true)
		} catch (error) {
			setErrorResponse(error.response.data)
		}


		setLoading(false)
	}

	const formik = useFormik({ initialValues, validationSchema, onSubmit })

	const { handleSubmit, handleChange, values, touched, errors } = formik

	const renderErrorResponse = () => {

		const isArray = Array.isArray(errorResponse)

		if (isArray) {
			return (
				<Alert variant="danger">
					<span className='alert-title'>Verifique os erros abaixo</span> <br />
					{errorResponse.map((row, index) => {
						return (
							<div key={index}>
								<span className='alert-title-item'>{row.type}</span>: &nbsp;
								{row.values.map((r, i) => {
									return (
										<span className='error-message' key={i}>
											{r}
										</span>
									)
								})}
							</div>
						)
					})}
				</Alert>
			)
		}

		return (
			<div>
				<Alert variant="danger">
					<span className='alert-title'>{errorResponse.title}</span> <br />
					{errorResponse.message}
				</Alert>
			</div>
		)
	}

	const leftSide = (
		<div className="min-h-100 d-flex align-items-center">
			<div className="w-100 w-lg-75 w-xxl-50">
				{/* <div>
				</div> */}
			</div>
		</div>
	)

	const rightSide = (
		<div className="sw-lg-70 min-h-100 bg-foreground d-flex justify-content-center align-items-center shadow-deep py-5 full-page-content-right-border">
			<div className="sw-lg-50 px-5">
				<div className="sh-11">
					<NavLink to="/">
						<div className="logo-default" />
					</NavLink>
				</div>
				<div className="mb-5">
					<h2 className="cta-1 mb-0 text-primary">Bem-vindo,</h2>
					<h2 className="cta-1 text-primary">Área administrativa</h2>
				</div>
				<div className="mb-5">
					<p className="h6">Informe suas credenciais para fazer o login.</p>
					<p className="h6">
						Este portal é de uso exclusivo administrativo.
					</p>
				</div>
				<div>
					<form id="loginForm" className="tooltip-end-bottom" onSubmit={handleSubmit}>
						<div className="mb-3 filled form-group tooltip-end-top">
							<CsLineIcons icon="email" />
							<Form.Control disabled={loading} type="text" name="email" placeholder="Email" value={values.email} onChange={handleChange} />
							{errors.email && touched.email && <div className="d-block invalid-tooltip">{errors.email}</div>}
						</div>
						<div className="mb-3 filled form-group tooltip-end-top">
							<CsLineIcons icon="lock-off" />
							<Form.Control disabled={loading} type="password" name="password" onChange={handleChange} value={values.password} placeholder="Password" />
							{errors.password && touched.password && <div className="d-block invalid-tooltip">{errors.password}</div>}
						</div>
						<div className="d-grid gap-2 mb-3">
							<Button
								variant="primary"
								type="submit"
								disabled={loading}
							>
								{loading
									? <Spinner as="span" animation="border" size="sm" />
									: <>Login</>
								}
							</Button>
						</div>

						{errorResponse ? renderErrorResponse() : false}
					</form>
				</div>
			</div>
		</div>
	)



	return (
		<>
			{redirect ? <Redirect to='/' /> : null}

			<HtmlHead title={title} description={description} />
			<LayoutFullpage left={leftSide} right={rightSide} />
		</>
	);
};

export default Login;
