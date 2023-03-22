export const DIMENSION = {
	Desktop: 'desktop',
	Tablet: 'tablet',
	Mobile: 'mobile',
};

export const LAYOUT = {
	Fluid: 'fluid',
	Boxed: 'boxed',
};

export const RADIUS = {
	Rounded: 'rounded',
	Standard: 'standard',
	Flat: 'flat',
};

export const THEME_COLOR = {
	LightBlue: 'light-blue',
	DarkBlue: 'dark-blue',
	LightRed: 'light-red',
	DarkRed: 'dark-red',
	LightGreen: 'light-green',
	DarkGreen: 'dark-green',
	LightPurple: 'light-purple',
	DarkPurple: 'dark-purple',
	LightPink: 'light-pink',
	DarkPink: 'dark-pink',
};

export const NAV_COLOR = {
	Default: 'default',
	Light: 'light',
	Dark: 'dark',
};
export const MENU_PLACEMENT = {
	Vertical: 'vertical',
	Horizontal: 'horizontal',
};
export const MENU_BEHAVIOUR = {
	Pinned: 'pinned',
	Unpinned: 'unpinned',
};

export const USER_ROLE = {
	Admin: 'admin',
	Editor: 'editor',
};

export const APP_PARAMS = {
	months: [
		'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
	],

	status: [
		{ 'status': 'pending', 'color': 'warning', 'label': 'Pendente' },
		{ 'status': 'approved', 'color': 'success', 'label': 'Aprovado' },
		{ 'status': 'cancelled', 'color': 'danger', 'label': 'Cancelado' },
		{ 'status': 'rejected', 'color': 'danger', 'label': 'Rejeitado' },

	],

	users_status: [
		{ 'status': 'Ativo', 'color': 'success' },
		{ 'status': 'Ativação pendente', 'color': 'warning' },
		{ 'status': 'Aguardando aprovação', 'color': 'warning' },
		{ 'status': 'Bloqueado', 'color': 'danger' },
		{ 'status': 'Excluído', 'color': 'danger' },
	],

	users_role: [
		{ 'role': 'Usuário', 'color': 'info' },
		{ 'role': 'Administrador', 'color': 'dark' },
		{ 'role': 'Super Usuário', 'color': 'quaternary' },
	],

	users_status_filter: [
		{ 'status': 'Todos', 'color': 'success', 'name': 'all', 'value': undefined },
		{ 'status': 'Ativos', 'color': 'success', 'name': 'actives', 'value': 3 },
		{ 'status': 'Pendentes', 'color': 'warning', 'name': 'pending_activation', 'value': 1 },
		{ 'status': 'Aguardando aprovação', 'color': 'warning', 'name': 'pending_approval', 'value': 2 },
		{ 'status': 'Bloqueado', 'color': 'danger', 'name': 'blocked', 'value': 4 },
		{ 'status': 'Excluídos', 'color': 'danger', 'name': 'deleted', 'value': 5 },
	],

	payments_status: [
		{ 'status': 'Todos', 'color': 'success', 'name': 'all', 'value': undefined },
		{ 'status': 'Pendente', 'color': 'warning', 'name': 'all', 'value': 'pending' },
		{ 'status': 'Aprovado', 'color': 'success', 'name': 'all', 'value': 'approved' },
		{ 'status': 'Cancelado', 'color': 'danger', 'name': 'all', 'value': 'cancelled' },
		{ 'status': 'Rejeitado', 'color': 'danger', 'name': 'all', 'value': 'rejected' },
	],

	crawling: [
		{ 'status': 'fixtures', 'label': 'Jogos', 'color': 'primary' },
		{ 'status': 'standings', 'label': 'Tabelas', 'color': 'quaternary' },
		{ 'status': 'teams', 'label': 'Times', 'color': 'info' },
		{ 'status': 'leagues', 'label': 'Ligas', 'color': 'secondary' },
	],

	crawling_status: [
		{ 'status': 'all', 'label': 'Todos', },
		{ 'status': 'processed', 'label': 'Processado', 'color': 'info' },
		{ 'status': 'pending', 'label': 'Pendente', 'color': 'warning' },
		{ 'status': 'error', 'label': 'Erro', 'color': 'danger' },
	],
}
