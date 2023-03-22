
import { APP_PARAMS } from '../constants';

export default function checkStatusLabel(status) {
    if (APP_PARAMS.status.find(item => item.status === status)) {
        const param_color = APP_PARAMS.status.find(item => item.status === status)
        return param_color.label
    }

    return '-'
}