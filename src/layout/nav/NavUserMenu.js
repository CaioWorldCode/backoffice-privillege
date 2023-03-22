import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import classNames from 'classnames'
import { Col, Dropdown, Row } from 'react-bootstrap'
import { MENU_PLACEMENT } from 'constants.js'
import CsLineIcons from 'cs-line-icons/CsLineIcons'
import { layoutShowingNavMenu } from 'layout/layoutSlice'
import { Link } from 'react-router-dom'
import { DEFAULT_PATHS } from '../../config'

import UnknowProfile from '../../assets/images/unknow.webp'

const appRoot = DEFAULT_PATHS.APP.endsWith('/') ? DEFAULT_PATHS.APP.slice(1, DEFAULT_PATHS.APP.length) : DEFAULT_PATHS.APP;

const NavUserMenuContent = () => (
	<div>
		<Row className="mb-3 ms-0 me-0">
			<Col xs="12" className="ps-1 mb-2">
				<div className="heading text-primary">Profile</div>
			</Col>
			<Col xs="12" className="ps-1 pe-1">
				<ul className="list-unstyled">
					<li>
						<a href="#/!">Dados do usuário</a>
					</li>
					<li>
						<a href="#/!">Preferências</a>
					</li>
				</ul>
			</Col>
		</Row>


		<Row className="mb-1 ms-0 me-0">
			<Col xs="12" className="p-1 mb-3 pt-3">
				<div className="separator-light" />
			</Col>
			<Col xs="12" className="ps-1 pe-1">
				<ul className="list-unstyled">
					<li>
						<a href="#/!">
							<CsLineIcons icon="help" className="me-2" size="17" /> <span className="align-middle">Ajuda</span>
						</a>
					</li>
					<li>
						<a href="#/!">
							<CsLineIcons icon="file-text" className="me-2" size="17" /> <span className="align-middle">Documentação</span>
						</a>
					</li>

					<li>
						<a href="#/!">
							<CsLineIcons icon="gear" className="me-2" size="17" /> <span className="align-middle">Configurações</span>
						</a>
					</li>
					<li>
						<Link to={`${appRoot}/profile/logout`}>
							<CsLineIcons icon="logout" className="me-2" size="17" /> <span className="align-middle">Sair</span>
						</Link>
					</li>
				</ul>
			</Col>
		</Row>
	</div>
);

const NavUserMenuDropdownToggle = React.memo(
	React.forwardRef(({ onClick, expanded = false, user = {} }, ref) => (
		<a
			href="#/!"
			ref={ref}
			className="d-flex user position-relative"
			data-toggle="dropdown"
			aria-expanded={expanded}
			onClick={(e) => {
				e.preventDefault();
				e.stopPropagation();
				onClick(e);
			}}
		>
			<img className="profile" alt={user.data.name} src={user.data.avatar ? user.data.avatar : UnknowProfile} />
			<div className="name">{user.data.name}</div>
		</a>
	))
);

// Dropdown needs access to the DOM of the Menu to measure it
const NavUserMenuDropdownMenu = React.memo(
	React.forwardRef(({ style, className }, ref) => {
		return (
			<div ref={ref} style={style} className={classNames('dropdown-menu dropdown-menu-end user-menu wide', className)}>
				<NavUserMenuContent />
			</div>
		);
	})
);

NavUserMenuDropdownMenu.displayName = 'NavUserMenuDropdownMenu';

const MENU_NAME = 'NavUserMenu';

const NavUserMenu = () => {
	const dispatch = useDispatch();
	const {
		placementStatus: { view: placement },
		behaviourStatus: { behaviourHtmlData },
		attrMobile,
		attrMenuAnimate,
	} = useSelector((state) => state.menu);

	const { isLogin, currentUser } = useSelector((state) => state.auth);
	const { color } = useSelector((state) => state.settings);
	const { showingNavMenu } = useSelector((state) => state.layout);

	const onToggle = (status, event) => {
		if (event && event.stopPropagation) event.stopPropagation();
		else if (event && event.originalEvent && event.originalEvent.stopPropagation) event.originalEvent.stopPropagation();
		dispatch(layoutShowingNavMenu(status ? MENU_NAME : ''));
	};

	useEffect(() => {
		dispatch(layoutShowingNavMenu(''));
		// eslint-disable-next-line
	}, [attrMenuAnimate, behaviourHtmlData, attrMobile, color]);

	if (!isLogin) {
		return <></>;
	}
	return (
		<Dropdown as="div" bsPrefix="user-container d-flex" onToggle={onToggle} show={showingNavMenu === MENU_NAME} drop="down">
			<Dropdown.Toggle as={NavUserMenuDropdownToggle} user={currentUser} />
			<Dropdown.Menu
				as={NavUserMenuDropdownMenu}
				className="dropdown-menu dropdown-menu-end user-menu wide"
				popperConfig={{
					modifiers: [
						{
							name: 'offset',
							options: {
								offset: () => {
									if (placement === MENU_PLACEMENT.Horizontal) {
										return [0, 7];
									}
									if (window.innerWidth < 768) {
										return [-84, 7];
									}

									return [-78, 7];
								},
							},
						},
					],
				}}
			/>
		</Dropdown>
	);
};
export default React.memo(NavUserMenu);
