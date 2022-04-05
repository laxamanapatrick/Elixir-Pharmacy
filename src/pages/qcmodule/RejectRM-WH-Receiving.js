// Reject RM - Warehouse Receiving

import React, { useState, useEffect } from 'react'
import {
  Badge,
  Button,
  Flex,
  Heading,
  HStack,
  Input,
  InputGroup,
  InputLeftElement,
  Select,
  Skeleton,
  Stack,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useToast
} from '@chakra-ui/react';
import apiClient from '../../services/apiClient';
import { useDisclosure } from '@chakra-ui/react';
import { decodeUser } from '../../services/decode-user';
import { FaSearch } from 'react-icons/fa';
import {
  Pagination,
  usePagination,
  PaginationNext,
  PaginationPage,
  PaginationPrevious,
  PaginationContainer,
  PaginationPageGroup,
} from '@ajna/pagination'
import PageScroll from '../../components/PageScroll';
import ApproveModal from './rm-nearly-expire-page/Approve-Modal';
import RejectModal from './rm-nearly-expire-page/Reject-Modal';


const RejectRMWHReceiving = () => {

  const [isLoading, setIsLoading] = useState(false)

  return (
    <Flex p={5} w="full" flexDirection='column'>
      <Flex justifyContent='center'>
        <Heading color='secondary' fontSize='xl' justifyContent='center'>Rejected Raw Materials for Warehouse Receiving</Heading>
      </Flex>

      <Flex mb={2} justifyContent='space-between'>
        <HStack>
          <InputGroup>
            <InputLeftElement
              pointerEvents='none'
              children={<FaSearch color='gray.300' />}
            />
            <Input
              // onChange={(e) => searchHandler(e.target.value)}
              type='text'
              placeholder='Search: PO Number'
              focusBorderColor='accent'
            />
          </InputGroup>

        </HStack>
        <HStack>
          <Badge colorScheme='green'>
            <Text color='secondary'>
              {/* Number of Records: {nearlyExpireData.expiry?.length} */}
            </Text>
          </Badge>
        </HStack>
      </Flex>

      {/* Table of data start */}

      <PageScroll>
        {
          isLoading ? (
            <Stack width="full">
              <Skeleton height='20px' />
              <Skeleton height='20px' />
              <Skeleton height='20px' />
              <Skeleton height='20px' />
              <Skeleton height='20px' />
              <Skeleton height='20px' />
            </Stack>
          ) : (
            <Table variant='striped' size="sm">
              <Thead>
                <Tr bgColor="secondary" >
                  <Th color="white">PO NO.</Th>
                  <Th color="white">Item Code</Th>
                  <Th color="white">Description</Th>
                  <Th color="white">Supplier</Th>
                  <Th color="white">UOM</Th>
                  <Th color="white">Qty. Ordered</Th>
                  <Th color="white">Actual Good</Th>
                  <Th color="white">Actual Reject</Th>
                  <Th color="white">Receiving Date</Th>
                  <Th color="white">Remarks</Th>
                  <Th color="white">Confirm</Th>
                  <Th color="white">Return</Th>
                </Tr>
              </Thead>
              <Tbody>
                {/* {
                nearlyExpireData.expiry?.map((ne, i) =>
                  <Tr key={i}>
                    <Td>{ne.pO_Number}</Td>
                    <Td>{ne.itemCode}</Td>
                    <Td>{ne.itemDescription}</Td>
                    <Td>{ne.supplier}</Td>
                    <Td> uom </Td>
                    <Td>{ne.quantityOrdered}</Td>
                    <Td>{ne.actualGood}</Td>
                    <Td>{ne.actualReject}</Td>
                    <Td>{ne.receivingdate}</Td>
                    <Td>{ne.remarkas}</Td>
                    <Td>
                      <Button
                        onClick={() => approveHandler(ne.receivingId)}
                        color='white' bgColor='#3C8DBC' _hover={{ bgColor: 'secondary', color: 'white' }} size='xs'
                      >
                        Confirm
                      </Button>
                    </Td>

                    <Td>
                      <Button
                        onClick={() => rejectHandler(ne.receivingId)}
                        color='white' bgColor='danger' _hover={{ bgColor: 'secondary', color: 'white' }} size='xs'
                      >
                        Return
                      </Button>
                    </Td>
                  </Tr>
                )
                } */}
              </Tbody>
            </Table>
          )
        }
      </PageScroll>

      {/* Table data end */}

      {/* <Flex justifyContent='end' mt={5}>

        <Stack>
          <Pagination
            pagesCount={pagesCount}
            currentPage={currentPage}
            onPageChange={handlePageChange}
          >
            <PaginationContainer>
              <PaginationPrevious bg="secondary" color='white' p={1} _hover={{ bg: 'accent', color: 'white' }}>{"<<"}</PaginationPrevious>
              <PaginationPageGroup ml={1} mr={1}>
                {pages.map((page) => (
                  <PaginationPage
                    _hover={{ bg: 'accent', color: 'white' }}
                    p={3}
                    bg="secondary"
                    color='white'
                    key={`pagination_page_${page}`}
                    page={page}
                  />
                ))}
              </PaginationPageGroup>
              <HStack>
                <PaginationNext bg="secondary" color='white' p={1} _hover={{ bg: 'accent', color: 'white' }}>{">>"}</PaginationNext>
                <Select onChange={handlePageSizeChange} variant='filled'>
                  <option value={Number(5)}>5</option>
                  <option value={Number(10)}>10</option>
                  <option value={Number(25)}>25</option>
                  <option value={Number(50)}>50</option>
                </Select>
              </HStack>
            </PaginationContainer>
          </Pagination>
        </Stack>
      </Flex>

      {
        isApproveModalOpen && (
          <ApproveModal
            receivingId={receivingId}
            fetchRMNearlyExpire={fetchRMNearlyExpire}
            isOpen={isApproveModalOpen}
            onClose={closeApproveModal}
          />
        )
      }

      {
        isRejectModalOpen && (
          <RejectModal
            receivingId={receivingId}
            fetchRMNearlyExpire={fetchRMNearlyExpire}
            isOpen={isRejectModalOpen}
            onClose={closeRejectModal}
          />
        )
      } */}

    </Flex >
  )
}

export default RejectRMWHReceiving