import React from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from "@fullcalendar/interaction"
import listPlugin from '@fullcalendar/list'
import { Flex } from '@chakra-ui/react'
import moment from 'moment'

export const CalendarList = ({ forMOData }) => {

    // console.log(forMOData)

    return (
        <Flex width='full' justifyContent='center'>
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
                            date: `${moment(item.preparedDate).format('yyyy-MM-DD')}`
                        }
                    })

                }
            />
        </Flex>
    )
}
