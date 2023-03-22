import React from 'react'
import { Badge, OverlayTrigger, Tooltip } from "react-bootstrap"
import moment from "moment"

import { APP_PARAMS } from "../constants"
import checkStatusColor from './checkStatusColor'
import checkStatusLabel from './checkStatusLabel'
import CsLineIcons from 'cs-line-icons/CsLineIcons'

export default function formatField(fieldType, value, row) {
    let formated_value = value

    switch (fieldType) {
        default:

            break;

        case 'boolean':
            if (value) {
                formated_value = <div><CsLineIcons className='text-warning' icon="star" /></div>
            } else {
                formated_value = <div>-</div>
            }
            break;

        case 'color':
            if (value) {
                formated_value = <div style={{ width: 15, height: 15, backgroundColor: value, borderRadius: '50%' }}></div>
            } else {
                formated_value = <div>-</div>
            }
            break;

        case 'icon':
            if (value) {
                formated_value = <div><CsLineIcons icon={value} className='text-info' /></div>
            } else {
                formated_value = <div>-</div>
            }
            break;

        case 'vehicle_status':
            formated_value = <div>
                <CsLineIcons stroke={row.vehicle_status?.color} icon={row.vehicle_status.icon} size={15} /> &nbsp;
                {row.vehicle_status.name}
            </div>
            break;

        case 'vehicle_type':
            formated_value = <div>
                <CsLineIcons stroke={row.vehicle_type?.color} icon={row.vehicle_type.icon} size={15} /> &nbsp;
                {row.vehicle_type.name}
            </div>
            break;

        case 'driver_status':
            formated_value = <div>
                <CsLineIcons stroke={row.driver_status?.color} icon={row.driver_status.icon} size={15} /> &nbsp;
                {row.driver_status.name}
            </div>
            break;

        case 'organization_status':
            formated_value = <div>
                <CsLineIcons stroke={row?.organization_status?.color} icon={row?.organization_status?.icon} size={15} /> &nbsp;
                {row?.organization_status?.name}
            </div>
            break;

        case 'organization_type':
            formated_value = <div>
                <CsLineIcons stroke={row?.organization_type?.color} icon={row?.organization_type?.icon} size={15} /> &nbsp;
                {row?.organization_type?.name}
            </div>
            break;

        case 'username':
            formated_value = <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                <div style={{ background: '#0C5DAF', width: 28, height: 28, borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', textTransform: 'uppercase', color: 'white', fontWeight: 'bold' }}>
                    {row?.name[0]}{row?.name[1]}
                </div> &nbsp;&nbsp;
                {row?.name}
            </div>
            break;

        case 'active':
            if (row?.active) {
                formated_value = <div >
                    <CsLineIcons stroke={'#32a852'} icon={'check'} size={15} />
                </div>
            } else {
                formated_value = <div >
                <CsLineIcons stroke={'#a83232'} icon={'close'} size={15} />
            </div>
            }
            break;
    }

    return formated_value

}