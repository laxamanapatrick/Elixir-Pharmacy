//Request Reject

import React from 'react'
import {
    Button,
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
    useDisclosure,
    VStack
} from '@chakra-ui/react'
import { RiEditBoxFill } from 'react-icons/ri'
import EditModalReject from './Edit-Modal-Reject'
import PageScrollTransformation from '../../../../components/PageScroll-Transformation'

export const ListofReject = ({ rejects, setTransformId, transformId, setEditData }) => {

    const requirementsHandler = (data) => {
        setEditData(data)
        setTransformId(data.id)
    }

    return (
        <Flex w='90%' flexDirection='column' mt={3}>
            <Flex justifyContent='center' bgColor='secondary' p={1}>
                <Heading color='white' fontSize='l' fontWeight='semibold'>List of Reject</Heading>
            </Flex>
            <Flex>
                <PageScrollTransformation minHeight='100px' maxHeight='280px'>
                    <Table variant='simple' size='sm'>
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
                                <Th color='white'>Request By</Th>
                                <Th color='white'>Remarks</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {rejects?.map((reject, i) =>
                                <Tr key={i} onClick={(e) => requirementsHandler(reject)}
                                    cursor='pointer'
                                    bgColor={transformId === reject.id ? 'table_accent' : 'none'}
                                >
                                    <Td>{i + 1}</Td>
                                    <Td>{reject.id}</Td>
                                    <Td>{reject.itemCode}</Td>
                                    <Td>{reject.itemDescription}</Td>
                                    <Td>{reject.uom}</Td>
                                    <Td>{reject.batch}</Td>
                                    <Td>{reject.version}</Td>
                                    <Td>{reject.quantity}</Td>
                                    <Td>{reject.prodPlan}</Td>
                                    <Td>{reject.addedBy}</Td>
                                    <Td>{reject.rejectRemarks}</Td>
                                </Tr>
                            )}
                        </Tbody>
                    </Table>
                </PageScrollTransformation>
            </Flex>
            <Flex justifyContent='start' mt={1}>
                <Text fontSize='xs'>Showing entries</Text>
            </Flex>

        </Flex >
    )
}
