// import React from 'react'
// import { Button, Flex, Table, Tbody, Td, Text, Th, Thead, Tr, useDisclosure, VStack } from '@chakra-ui/react'
// import PageScrollReusable from '../../../components/PageScroll-Reusable'
// import moment from 'moment'
// import { TransactConfirmation } from './Action-Modals-Transact'

// export const ListofMoveOrdersPerFarm = ({ moveOrderListThirdTable, deliveryDate, setMoveOrderInformation, fetchMoveOrderList }) => {

//     const TableHead = [
//         "Line", "Order Date", "Farm Code", "Farm", "Category", "Item Code", "Item Description", "UOM", "Expiration Date", "Quantity"
//     ]

//     const { isOpen: isTransact, onClose: closeTransact, onOpen: openTransact } = useDisclosure()

//     return (
//         <>
//             <Flex w='full' flexDirection='column' borderX='1px'>
//                 <VStack spacing={0}>
//                     <Text pb={2} textAlign='center' fontSize='md' color='white' bgColor='secondary' w='full' mb={-1.5}>List of Move Orders</Text>
//                     <PageScrollReusable minHeight='220px' maxHeight='350px'>
//                         <Table size='sm' variant='simple'>
//                             <Thead bgColor='secondary'>
//                                 <Tr>
//                                     {
//                                         TableHead?.map((t, i) =>
//                                             <Th color='white' key={i}>{t}</Th>
//                                         )
//                                     }
//                                 </Tr>
//                             </Thead>
//                             <Tbody>
//                                 {
//                                     moveOrderListThirdTable?.map((list, i) =>
//                                         <Tr key={i}>
//                                             <Td>{i + 1}</Td>
//                                             <Td>{list.orderDate}</Td>
//                                             <Td>{list.farmCode}</Td>
//                                             <Td>{list.farmName}</Td>
//                                             <Td>{list.category}</Td>
//                                             <Td>{list.itemCode}</Td>
//                                             <Td>{list.itemDescription}</Td>
//                                             <Td>{list.uom}</Td>
//                                             <Td>{moment(list.expiration).format('MM/DD/yyyy')}</Td>
//                                             <Td>{list.quantity}</Td>
//                                         </Tr>
//                                     )
//                                 }
//                             </Tbody>
//                         </Table>
//                     </PageScrollReusable>
//                 </VStack>
//             </Flex>
//             <Flex justifyContent='end' w='full' borderX='1px' borderBottom='1px' p={1} mt={2}>
//                 <Button colorScheme='blue' w='7%' size='sm' disabled={!deliveryDate} onClick={() => openTransact()}>Transact</Button>
//             </Flex>
//             {
//                 isTransact && (
//                     <TransactConfirmation
//                         isOpen={isTransact}
//                         onClose={closeTransact}
//                         moveOrderListThirdTable={moveOrderListThirdTable}
//                         deliveryDate={deliveryDate}
//                         setMoveOrderInformation={setMoveOrderInformation}
//                         fetchMoveOrderList={fetchMoveOrderList}
//                     />
//                 )
//             }
//         </>
//     )
// }



