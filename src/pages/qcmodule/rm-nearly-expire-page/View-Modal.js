import React, { useEffect, useState } from 'react'
import { Button, Flex, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Text } from '@chakra-ui/react'
import apiClient from '../../../services/apiClient'

const fetchViewDataApi = async (receivingId) => {
    const res = await apiClient.get(`Receiving/GetDetailsForNearlyExpire?id=${receivingId}`)
    return res.data
}

export const ViewModal = ({ isOpen, onClose, receivingId }) => {

    const [viewData, setViewData] = useState([])

    const fetchViewData = () => {
        fetchViewDataApi(receivingId).then(res => {
            setViewData(res)
        })
    }

    useEffect(() => {
        fetchViewData()

        return () => {
            setViewData([])
        }
    }, [receivingId])


    console.log(viewData)

    return (
        <Modal isOpen={isOpen} onClose={() => { }} isCentered size='xl'>
            <ModalContent>
                <ModalHeader>
                    <Flex justifyContent='center'>
                        <Text>PO Summary</Text>
                    </Flex>
                </ModalHeader>
                <ModalBody mt={2}>

                </ModalBody>
                <ModalFooter mt={10}>
                    <Button variant='ghost' size='xs' onClick={onClose}>Close</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}
