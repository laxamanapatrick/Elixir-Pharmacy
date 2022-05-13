//Request Reject

import React from 'react'
import {
    Button,
    ButtonGroup,
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

export const ListofRawMaterialsRequirements = () => {
    return (
        <>
            <Flex w='90%' flexDirection='column' mt={3}>
                <Flex justifyContent='center' bgColor='secondary' p={1}>
                    <Heading color='white' fontSize='l' fontWeight='semibold'>List of Raw Materials Requirements</Heading>
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
            </Flex>

            <Flex justifyContent='end' w='90%' bgColor='gray.200'>
                <ButtonGroup size='xs'>
                    <Button colorScheme='blue'>REQUEST</Button>
                    {/* <Button bgColor='warning' color='white'>EDIT</Button> */}
                    <Button colorScheme='red'>CANCEL</Button>
                </ButtonGroup>
            </Flex>
        </>
    )
}
