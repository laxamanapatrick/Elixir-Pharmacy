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

export const ListofReject = () => {

    const { isOpen: isEditOpen, onOpen: openEdit, onClose: closeEdit } = useDisclosure()

    const editHandler = () => {
        openEdit()
    }

    return (
        <Flex w='90%' flexDirection='column' mt={3}>
            <Flex justifyContent='center' bgColor='secondary' p={1}>
                <Heading color='white' fontSize='l' fontWeight='semibold'>List of Reject</Heading>
            </Flex>
            <Flex>
                <PageScrollTransformation minHeight='100px' maxHeight='280px'>
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
                                <Th color='white'>Request By</Th>
                                <Th color='white'>Edit</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            <Tr>
                                <Td>Laman</Td>
                                <Td>Laman</Td>
                                <Td>Laman</Td>
                                <Td>Laman</Td>
                                <Td>Laman</Td>
                                <Td>Laman</Td>
                                <Td>Laman</Td>
                                <Td>Laman</Td>
                                <Td>Laman</Td>
                                <Td>Laman</Td>
                                <Td>
                                    <Button
                                        onClick={() => editHandler()}
                                        p={0} background='none' color='secondary' size='sm'>
                                        <RiEditBoxFill />
                                    </Button>
                                </Td>
                            </Tr>
                            <Tr>
                                <Td>Laman</Td>
                                <Td>Laman</Td>
                                <Td>Laman</Td>
                                <Td>Laman</Td>
                                <Td>Laman</Td>
                                <Td>Laman</Td>
                                <Td>Laman</Td>
                                <Td>Laman</Td>
                                <Td>Laman</Td>
                                <Td>Laman</Td>
                            </Tr>
                            <Tr>
                                <Td>Laman</Td>
                                <Td>Laman</Td>
                                <Td>Laman</Td>
                                <Td>Laman</Td>
                                <Td>Laman</Td>
                                <Td>Laman</Td>
                                <Td>Laman</Td>
                                <Td>Laman</Td>
                                <Td>Laman</Td>
                                <Td>Laman</Td>
                            </Tr>
                            <Tr>
                                <Td>Laman</Td>
                                <Td>Laman</Td>
                                <Td>Laman</Td>
                                <Td>Laman</Td>
                                <Td>Laman</Td>
                                <Td>Laman</Td>
                                <Td>Laman</Td>
                                <Td>Laman</Td>
                                <Td>Laman</Td>
                                <Td>Laman</Td>
                            </Tr>
                            <Tr>
                                <Td>Laman</Td>
                                <Td>Laman</Td>
                                <Td>Laman</Td>
                                <Td>Laman</Td>
                                <Td>Laman</Td>
                                <Td>Laman</Td>
                                <Td>Laman</Td>
                                <Td>Laman</Td>
                                <Td>Laman</Td>
                                <Td>Laman</Td>
                            </Tr>
                            <Tr>
                                <Td>Laman</Td>
                                <Td>Laman</Td>
                                <Td>Laman</Td>
                                <Td>Laman</Td>
                                <Td>Laman</Td>
                                <Td>Laman</Td>
                                <Td>Laman</Td>
                                <Td>Laman</Td>
                                <Td>Laman</Td>
                                <Td>Laman</Td>
                            </Tr>
                            <Tr>
                                <Td>Laman</Td>
                                <Td>Laman</Td>
                                <Td>Laman</Td>
                                <Td>Laman</Td>
                                <Td>Laman</Td>
                                <Td>Laman</Td>
                                <Td>Laman</Td>
                                <Td>Laman</Td>
                                <Td>Laman</Td>
                                <Td>Laman</Td>
                            </Tr>
                            <Tr>
                                <Td>Laman</Td>
                                <Td>Laman</Td>
                                <Td>Laman</Td>
                                <Td>Laman</Td>
                                <Td>Laman</Td>
                                <Td>Laman</Td>
                                <Td>Laman</Td>
                                <Td>Laman</Td>
                                <Td>Laman</Td>
                                <Td>Laman</Td>
                            </Tr>
                            <Tr>
                                <Td>Laman</Td>
                                <Td>Laman</Td>
                                <Td>Laman</Td>
                                <Td>Laman</Td>
                                <Td>Laman</Td>
                                <Td>Laman</Td>
                                <Td>Laman</Td>
                                <Td>Laman</Td>
                                <Td>Laman</Td>
                                <Td>Laman</Td>
                            </Tr>
                            <Tr>
                                <Td>Laman</Td>
                                <Td>Laman</Td>
                                <Td>Laman</Td>
                                <Td>Laman</Td>
                                <Td>Laman</Td>
                                <Td>Laman</Td>
                                <Td>Laman</Td>
                                <Td>Laman</Td>
                                <Td>Laman</Td>
                                <Td>Laman</Td>
                            </Tr>
                            <Tr>
                                <Td>Laman</Td>
                                <Td>Laman</Td>
                                <Td>Laman</Td>
                                <Td>Laman</Td>
                                <Td>Laman</Td>
                                <Td>Laman</Td>
                                <Td>Laman</Td>
                                <Td>Laman</Td>
                                <Td>Laman</Td>
                                <Td>Laman</Td>
                            </Tr>
                        </Tbody>
                    </Table>
                </PageScrollTransformation>
            </Flex>
            <Flex justifyContent='start' mt={1}>
                <Text fontSize='xs'>Showing entries</Text>
            </Flex>

            {
                isEditOpen && (
                    <EditModalReject
                        isOpen={isEditOpen}
                        onClose={closeEdit}
                    />
                )
            }

        </Flex>
    )
}
