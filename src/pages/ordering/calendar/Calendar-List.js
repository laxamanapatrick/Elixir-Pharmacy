import React from 'react'
import './calendar.css'
import { Flex } from '@chakra-ui/react'
import moment from 'moment'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from "@fullcalendar/interaction"
import listPlugin from '@fullcalendar/list'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import BigCalendar from 'react-big-calendar'

export const CalendarList = ({ forMOData }) => {

    // console.log(forMOData)

    moment.locale('en-GB');
    BigCalendar.momentLocalizer(moment);

    const allViews = Object
        .keys(BigCalendar.Views)
        .map(k => BigCalendar.Views[k])

    return (
        <Flex 
        width='full' 
        height='88vh'
        lineHeight='50px' 
        justifyContent='center' 
        >

            <FullCalendar
                plugins={[dayGridPlugin, interactionPlugin, listPlugin]}
                initialView="dayGridMonth"
                headerToolbar={{
                    left: 'prev,next today',
                    center: 'title',
                    right: 'dayGridMonth,dayGridWeek,dayGridDay,listWeek'
                }}
                events={
                    forMOData?.map(item => {
                        return {
                            title: `${item.farmCode} ${item.farm}`,
                            start: `${moment(item.preparedDate).format('yyyy-MM-DD')}`
                        }
                    })
                }
            />


            {/* <BigCalendar
                events={
                    forMOData?.map(item => {
                        return {
                            'title': `${item.farmCode} ${item.farm}`,
                            'start': `${moment(item.preparedDate).format('yyyy-MM-DD')}`
                        }
                    })
                }
                step={60}
                views={allViews}
            /> */}

        </Flex>
    )
}
