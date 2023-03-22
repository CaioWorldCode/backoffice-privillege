
import { APP_PARAMS } from '../constants';

export default function checkStatusColor(status) {
    if (APP_PARAMS.status.find(item => item.status === status)) {
        const param_color = APP_PARAMS.status.find(item => item.status === status)
        return param_color.color
    }

    return 'dark'
}