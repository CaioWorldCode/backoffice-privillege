import { lazy } from 'react'
import { DEFAULT_PATHS } from 'config.js'


const appRoot = DEFAULT_PATHS.APP.endsWith('/') ? DEFAULT_PATHS.APP.slice(1, DEFAULT_PATHS.APP.length) : DEFAULT_PATHS.APP;

const home = lazy(() => import('views/home'))


const config = {
	document_type: lazy(() => import('views/config/document_type')),
	newsletter_type: lazy(() => import('views/config/newsletter_type')),
}

const users = {
	list: lazy(() => import('views/users/list')),
	user_type: lazy(() => import('views/config/user_type')),
}

const contracts = {
	list: lazy(() => import('views/contracts/list')),
	new: lazy(() => import('views/contracts/new')),
	signatures: lazy(() => import('views/contracts/signatures')),
}


const routesAndMenuItems = {
	mainMenuItems: [
		{
			path: DEFAULT_PATHS.APP,
			exact: true,
			redirect: true,
			to: `${appRoot}/home`,
			protected: true
		},

		{
			path: `${appRoot}/home`,
			component: home,
			label: 'Home',
			icon: 'dashboard-1',
			protected: true
		},

		{
			path: `${appRoot}/users`,
			component: config.index,
			label: 'Usuários',
			icon: 'user',
			protected: true,
			subs: [
				{ path: '/list', label: 'Contratos', component: contracts.list },
			
			],
		},


		{
			path: `${appRoot}/contracts`,
			component: config.index,
			label: 'Contratos',
			icon: 'book',
			protected: true,
			subs: [
				{ path: '/list', label: 'Contratos', component: contracts.list },
				{ path: '/new', label: 'Novo contrato', component: contracts.new },
				{ path: '/signatures', label: 'Assinaturas', component: contracts.signatures },
			],
		},



		{
			path: `${appRoot}/config`,
			component: config.index,
			label: 'Configurações',
			icon: 'gear',
			protected: true,
			subs: [
				{ path: '/contract_type', label: 'Tipo de documento', component: config.document_type },
				{ path: '/newsletter_type', label: 'Tipo de notícia', component: config.newsletter_type },
			],
		},
	],
	sidebarItems: [
		{
			path: `${appRoot}/contracts`,
			component: config.index,
			label: 'Contratos',
			icon: 'book',
			protected: false,
			visible: false,
			subs: [
				{ path: '/edit/:slug', label: 'Editar contrato', component: contracts.new },
			],
		},
	],
}

export default routesAndMenuItems
