import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Flex,
  HStack,
  Input,
  InputGroup,
  InputLeftElement,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverTrigger,
  Portal,
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
  useToast,
  VStack,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  FormLabel
} from '@chakra-ui/react';
import apiClient from '../../services/apiClient';
import { FcAddDatabase } from 'react-icons/fc'
import { RiEditBoxFill } from 'react-icons/ri'
import { GiChoice } from 'react-icons/gi'
import { useDisclosure } from '@chakra-ui/react';
import { ToastComponent } from '../../components/Toast';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import { decodeUser } from '../../services/decode-user';
import PageScroll from '../../components/PageScroll';
import {
  Pagination,
  usePagination,
  PaginationNext,
  PaginationPage,
  PaginationPrevious,
  PaginationContainer,
  PaginationPageGroup,
} from '@ajna/pagination'
import { FaSearch } from 'react-icons/fa';

const currentUser = decodeUser()

const schema = yup.object().shape({
  formData: yup.object().shape({
    id: yup.string(),
    lotCategoryId: yup.string().required("Lot Category is required"),
    sectionName: yup.string().required("Section Name is required"),
  })
})

const fetchLotApi = async (pageNumber, pageSize, status, search) => {
  const res = await apiClient.get(`Lot/GetAllLotNameWithPaginationOrig/${status}?pageNumber=${pageNumber}&pageSize=${pageSize}&search=${search}`)
  return res.data
}

const LotManagementPage = () => {
  const [lots, setLots] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [status, setStatus] = useState(true)
  const [search, setSearch] = useState("")
  const toast = useToast()
  const [pageTotal, setPageTotal] = useState(undefined)
  const { isOpen: isDrawerOpen, onOpen: openDrawer, onClose: closeDrawer } = useDisclosure()

  const [disableEdit, setdisableEdit] = useState(false)

  const { register, handleSubmit, formState: { errors, isValid }, setValue, reset } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
    defaultValues: {
      formData: {
        id: "",
        lotCategoryId: "",
        sectionName: "",
        addedBy: currentUser.userName
      }
    }
  })

  const outerLimit = 2;
  const innerLimit = 2;
  const { currentPage, setCurrentPage, pagesCount, pages, setPageSize, pageSize } = usePagination({
    total: pageTotal,
    limits: {
      outer: outerLimit,
      inner: innerLimit,
    },
    initialState: { currentPage: 1, pageSize: 5 },
  })

  const fetchLot = () => {
    fetchLotApi(currentPage, pageSize, status, search).then(res => {
      setIsLoading(false)
      setLots(res)
      setPageTotal(res.totalCount)
    })
  }

  useEffect(() => {
    fetchLot()

    return () => {
      setLots([])
    }
  }, [status, pageSize, currentPage, search])

  const handlePageChange = (nextPage) => {
    setCurrentPage(nextPage)
  }

  const handlePageSizeChange = (e) => {
    const pageSize = Number(e.target.value)
    setPageSize(pageSize)
  }

  const statusHandler = (data) => {
    setStatus(data)
  }

  const changeStatusHandler = (id, status) => {
    let routeLabel;
    if (status) {
      routeLabel = "InActiveLotName"
    } else {
      routeLabel = "ActivateLotName"
    }
    apiClient.put(`Lot/${routeLabel}/${id}`, { id: id }).then(res => {
      ToastComponent("Succes", "Lot name updated", "success", toast)
      fetchLot()
    }).catch(err => {
      console.log(err)
    })
  }

  const searchHandler = (inputValue) => {
    setSearch(inputValue)
  }

  const editHandler = (lot) => {
    setdisableEdit(true)
    openDrawer()
    setValue("formData", {
      id: lot.id,
      lotCategoryId: lot.lotCategoryId,
      sectionName: lot.sectionName,
      modifiedBy: currentUser.userName
    })
  }

  const newLotHandler = () => {
    setdisableEdit(false)
    openDrawer()
    reset()
  }

  return (
    <Flex p={5} w='full' flexDirection='column'>
      <Flex mb={2} justifyContent='space-between'>

        <HStack>
          <InputGroup>
            <InputLeftElement
              pointerEvents='none'
              children={<FaSearch color='gray.300' />}
            />
            <Input type='text' placeholder='Search: LOT Name'
              onChange={(e) => searchHandler(e.target.value)}
              focusBorderColor='accent'
            />
          </InputGroup>
        </HStack>

        <HStack>
          <Text>STATUS: </Text>
          <Select
            onChange={(e) => statusHandler(e.target.value)}
          >
            <option value={true}>Active</option>
            <option value={false}>Inactive</option>
          </Select>
        </HStack>
      </Flex>

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
            <Table variant='striped' size='sm'>
              <Thead>
                <Tr bgColor='secondary'>
                  <Th color='white'>ID</Th>
                  <Th color='white'>LOT Name</Th>
                  <Th color='white'>Section Name</Th>
                  <Th color='white'>Date Added</Th>
                  <Th color='white'>Added By</Th>
                  <Th color='white'>Actions</Th>
                </Tr>
              </Thead>
              <Tbody>
                {lots.lotname?.map(lot =>
                  <Tr
                    key={lot.id}
                  >
                    <Td>{lot.id}</Td>
                    <Td>{lot.lotCategory}</Td>
                    <Td>{lot.sectionName}</Td>
                    <Td>{lot.dateAdded}</Td>
                    <Td>{lot.addedBy}</Td>
                    <Td>
                      <Flex>
                        <HStack>
                          <Button p={0} background='none' color='secondary'
                            onClick={() => editHandler(lot)}
                          >
                            <RiEditBoxFill />
                          </Button>
                          <Popover>
                            <PopoverTrigger>
                              <Button p={0} background='none'><GiChoice /></Button>
                            </PopoverTrigger>
                            <Portal>
                              <PopoverContent>
                                <PopoverArrow />
                                <PopoverCloseButton />
                                <PopoverBody>
                                  <VStack>
                                    {lot.isActive === true ? <Text>Are you sure you want to set this lot name inactive?</Text> : <Text>Are you sure you want to set this lot name active?</Text>}
                                    <Button bgColor='secondary' color='white' _hover={{ bgColor: 'accent' }}
                                      onClick={() => changeStatusHandler(lot.id, lot.isActive)}
                                    >
                                      Yes
                                    </Button>
                                  </VStack>
                                </PopoverBody>
                              </PopoverContent>
                            </Portal>
                          </Popover>
                        </HStack>
                      </Flex>
                    </Td>
                  </Tr>
                )
                }
              </Tbody>
            </Table>
          )
        }
      </PageScroll>

      <Flex justifyContent='space-between' mt={5}>
        <Button leftIcon={<FcAddDatabase color='white' />} bgColor='secondary'
          onClick={newLotHandler}
          _hover={{ bgColor: 'accent' }}
        >
          <Text color='white'>New Lot</Text>
        </Button>

        {
          isDrawerOpen && (
            <DrawerComponent
              isOpen={isDrawerOpen}
              onClose={closeDrawer}
              register={register}
              errors={errors}
              isValid={isValid}
              handleSubmit={handleSubmit}
              fetchLot={fetchLot}
              disableEdit={disableEdit}
            />
          )
        }

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
                <Select
                  onChange={handlePageSizeChange}
                  variant='filled'
                >
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
    </Flex>
  )
};

export default LotManagementPage;

const DrawerComponent = ({ isOpen, onClose, register, errors, isValid, handleSubmit, fetchLot, disableEdit }) => {
  const [lotC, setlotC] = useState([])
  const [isLoading, setisLoading] = useState(false)
  const toast = useToast()

  const submitHandler = (data) => {
    try {
      if (data.formData.id === "") {
        delete data.formData["id"]
        setisLoading(true)
        const res = apiClient.post("Lot/AddNewLotName", data.formData).then((res) => {
          ToastComponent("Success", "New LOT created", "success", toast)
          setisLoading(false)
          fetchLot()
          onClose(onClose)
        }).catch(err => {
          setisLoading(false)
          ToastComponent("Error", err.response.data, "error", toast)
          data.formData.id = "" // add property id to objects for if condition
        })
      } else {
        const res = apiClient.put(`Lot/UpdateLotName/${data.formData.id}`, data.formData).then((res) => {
          ToastComponent("Success", "LOT Updated", "success", toast)
          setisLoading(false)
          fetchLot()
          onClose(onClose)
        }).catch(err => {
          ToastComponent("Update Failed", err.response.data, "warning", toast)
        })
      }
    } catch (err) {
    }
  }

  const fetchLotCategory = async () => {
    try {
      const res = await apiClient.get('Lot/GetAllLotCategories')
      setlotC(res.data)
    } catch (error) {
    }
  }

  useEffect(() => {
    try {
      fetchLotCategory()
    } catch (error) {
    }
  }, []);

  return (
    <Flex>
      <Drawer
        isOpen={isOpen}
        placement='center'
        onClose={onClose}
      >
        <DrawerOverlay />
        <form onSubmit={handleSubmit(submitHandler)}>
          <DrawerContent>
            <DrawerCloseButton />
            <DrawerHeader borderBottomWidth='1px'>
              LOT Form
            </DrawerHeader>
            <DrawerBody>

              <Stack spacing='7px'>

                <Box>
                  <Stack>
                    <Text fontWeight='semibold'>LOT Name:</Text>
                    {
                      lotC.length > 0 ? (<Select
                        {...register("formData.lotCategoryId")}
                        placeholder='Select Lot Name'>
                        {lotC.map(lotcat => (
                          <option key={lotcat.id} value={lotcat.id}>{lotcat.categoryName}</option>
                        ))}

                      </Select>) : "loading"
                    }

                    <Text color="danger" fontSize="xs">{errors.formData?.lotCategoryId?.message}</Text>
                  </Stack>
                </Box>

                <Box>
                  <FormLabel>Section Name:</FormLabel>
                  <Input
                    placeholder='Please enter Item Description'
                    {...register("formData.sectionName")}
                    bgColor={disableEdit ? 'gray.200' : 'none'}
                    disabled={disableEdit}
                    readOnly={disableEdit}
                    title={disableEdit ? 'Lot Name is not editable' : ''}
                  />
                  <Text color="danger" fontSize="xs">{errors.formData?.sectionName?.message}</Text>
                </Box>

              </Stack>

            </DrawerBody>

            <DrawerFooter borderTopWidth='1px'>
              <Button variant='outline' mr={3} onClick={onClose}>
                Cancel
              </Button>
              <Button
                type='submit'
                bgColor='secondary'
                color='white'
                _hover={{ bgColor: 'accent' }}
                disabled={!isValid}
                isLoading={isLoading}
              >
                Submit
              </Button>
            </DrawerFooter>

          </DrawerContent>
        </form>
      </Drawer>
    </Flex>
  )

}
