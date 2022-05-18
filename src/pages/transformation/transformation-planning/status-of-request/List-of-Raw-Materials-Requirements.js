// Status of Request

import React, { useState, useEffect } from 'react'
import {
    Flex,
    Heading,
    Select,
    Table,
    Tbody,
    Td,
    Text,
    Th,
    Thead,
    Tr,
    VStack
} from '@chakra-ui/react'
import PageScrollTransformation from '../../../../components/PageScroll-Transformation'
import apiClient from '../../../../services/apiClient'

const fetchRequirementsApi = async (transformId) => {
    const res = await apiClient.get(`Planning/GetAllPendingRequestWithRequirements/${transformId}`)
    return res.data
}

export const ListofRawMaterialsRequirements = ({ transformId }) => {

    const [requirements, setRequirements] = useState([])

    const fetchRequirements = () => {
        fetchRequirementsApi(transformId).then(res => {
            setRequirements(res)
        })
    }

    useEffect(() => {
        if (transformId) {
            fetchRequirements()
        }
    }, [transformId])

    return (
        <Flex w='90%' flexDirection='column' mt={3}>
            <Flex justifyContent='center' bgColor='secondary' p={1}>
                <Heading color='white' fontSize='l' fontWeight='semibold'>List of Raw Materials Requirements</Heading>
            </Flex>
            <Flex>
                <PageScrollTransformation minHeight='100px' maxHeight='270px'>
                    <Table variant='striped' size='sm'>
                        <Thead bgColor='secondary'>
                            <Tr>
                                <Th color='white'>Line</Th>
                                <Th color='white'>Transform Id</Th>
                                <Th color='white'>Item Code</Th>
                                <Th color='white'>Item Description</Th>
                                <Th color='white'>UOM</Th>
                                <Th color='white'>Batch</Th>
                                <Th color='white'>Version</Th>
                                <Th color='white'>Quantity</Th>
                                <Th color='white'>Prod Plan</Th>
                                {/* <Th color='white'>Request By</Th> */}
                            </Tr>
                        </Thead>
                        <Tbody>
                            {transformId ?
                                requirements?.map((r, i) =>
                                    <Tr key={i}>
                                        <Td>{r.line}</Td>
                                        <Td>{transformId}</Td>
                                        <Td>{r.itemCode}</Td>
                                        <Td>{r.itemDescription}</Td>
                                        <Td>{r.uom}</Td>
                                        <Td>{r.batch}</Td>
                                        <Td>{r.version}</Td>
                                        <Td>{r.quantity}</Td>
                                        <Td>{r.prodPlan}</Td>
                                        {/* <Td>{r.addedBy}</Td> */}
                                    </Tr>
                                )
                                : null
                            }
                        </Tbody>
                    </Table>
                </PageScrollTransformation>
            </Flex>
            <Flex justifyContent='start' mt={1}>
                <Text fontSize='xs'>Showing entries</Text>
            </Flex>
        </Flex>
    )
}
