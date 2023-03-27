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
}

const contracts = {
	list: lazy(() => import('views/contracts/list')),
	new: lazy(() => import('views/contracts/new')),
	signatures: lazy(() => import('views/contracts/signatures')),
	contract_type: lazy(() => import('views/contracts/contract_type')),
}

const newsletter = {
	list: lazy(() => import('views/newsletter/list')),
	new: lazy(() => import('views/newsletter/new')),
	newsletter_type: lazy(() => import('views/newsletter/newsletter_type')),
}

const signatures = lazy(() => import('views/signatures/list'))



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
				{ path: '/list', label: 'Listar', component: users.list },
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
				{ path: '/contract_type', label: 'Tipo de contrato', component: contracts.contract_type },
			],
		},

		{
			path: `${appRoot}/signatures`,
			component: signatures,
			label: 'Assinaturas',
			icon: 'pen',
			protected: true
		},


		{
			path: `${appRoot}/newsletter`,
			component: newsletter.index,
			label: 'Notícias',
			icon: 'news',
			protected: true,
			subs: [
				{ path: '/list', label: 'Listar', component: newsletter.list },
				{ path: '/new', label: 'Nova notícia', component: newsletter.new },
				{ path: '/newsletter_type', label: 'Tipo de notícia', component: newsletter.newsletter_type },
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
		{
			path: `${appRoot}/newsletter`,
			component: newsletter.index,
			label: 'Notícias',
			icon: 'news',
			protected: false,
			visible: false,
			subs: [
				{ path: '/edit/:slug', label: 'Editar notícia', component: newsletter.new },
			],
		},
	],
}

export default routesAndMenuItems
