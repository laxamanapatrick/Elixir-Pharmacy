import React, { useEffect, useState } from 'react'
import apiClient from '../../services/apiClient'
import { CalendarList } from './calendar/Calendar-List'

const fetchForMoveOrderApi = async () => {
    const res = await apiClient.get(`Ordering/GetAllApprovedOrderCalendar`)
    return res.data
}

const Calendar = () => {

    const [forMOData, setForMOData] = useState([])

    const fetchForMoveOrder = () => {
        fetchForMoveOrderApi().then(res => {
            setForMOData(res)
        })
    }

    useEffect(() => {
        fetchForMoveOrder()

        return () => {
            setForMOData([])
        }
    }, [])


    return (
        <CalendarList forMOData={forMOData} />
    )
}

export default Calendar
