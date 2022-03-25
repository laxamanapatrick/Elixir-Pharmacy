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
import React, { useEffect, useState, useCallback } from 'react';
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

const currentUser = decodeUser()

const schema = yup.object().shape({
  formData: yup.object().shape({
    id: yup.string(),
    mainMenuId: yup.string().required("Main Menu is required"),
    subMenuName: yup.string().required("Sub Menu Name is required"),
    moduleName: yup.string().required("Module Name is required"),
  })
})

const fetchModuleApi = async (pageNumber, pageSize, status, search) => {
  const res = await apiClient.get(`Module/GetAllModulesWithPaginationOrig/${status}?pageNumber=${pageNumber}&pageSize=${pageSize}&search=${search}`);
  return res.data
}

const ModuleManagementPage = () => {
  const [modules, setModules] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [status, setStatus] = useState(true);
  const [search, setSearch] = useState("");
  const toast = useToast()
  const [pageTotal, setPageTotal] = useState(undefined);
  const { isOpen: isDrawerOpen, onOpen: openDrawer, onClose: closeDrawer } = useDisclosure()

  const { register, handleSubmit, formState: { errors, isValid }, setValue, reset } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
    defaultValues: {
      formData: {
        id: "",
        mainMenuId: "",
        subMenuName: "",
        moduleName: "",
        addedBy: currentUser.userName,
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

  });

  const fetchModules = () => {
    fetchModuleApi(currentPage, pageSize, status, search).then(res => {
      setIsLoading(false)
      setModules(res)
      setPageTotal(res.totalCount)
    })
  }

  useEffect(() => {
    fetchModules()
  }, [status, pageSize, currentPage, search]);

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
      routeLabel = "InActiveModule"
    } else {
      routeLabel = "ActivateModule"
    }

    apiClient.put(`/Module/${routeLabel}/${id}`, { id: id }).then((res) => {
      ToastComponent("Success", "Status updated", "success", toast)
      fetchModules()
    }).catch(err => {
      console.log(err);
    })
  }

  const searchHandler = (inputValue) => {
    setSearch(inputValue)
  }

  const editHandler = (module) => {
    openDrawer();
    setValue("formData", {
      id: module.id,
      mainMenuId: module.mainMenuId,
      subMenuName: module.subMenuName,
      moduleName: module.moduleName,
      modifiedBy: currentUser.userName
    }, { shouldValidate: true })

  }

  const newModuleHandler = () => {
    openDrawer()
    reset()
  }

  return (
    <Flex p={5} w="full" flexDirection='column'>
      <Flex mb={2} justifyContent='space-between'>
        <HStack>
          <InputGroup>
            <InputLeftElement
              pointerEvents='none'
              children={<FaSearch color='gray.300' />}
            />
            <Input type='text' placeholder='Search: Sub-Menu Name' onChange={(e) => searchHandler(e.target.value)} focusBorderColor='accent' />
          </InputGroup>

        </HStack>
        <HStack>
          <Text>STATUS: </Text>

          <Select onChange={(e) => statusHandler(e.target.value)}>
            <option value={true}>Active</option>
            <option value={false}>Inactive</option>
          </Select>
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
                  <Th color="white">Id</Th>
                  <Th color="white">Menu Name</Th>
                  <Th color="white">Sub-Menu Name</Th>
                  {/* <Th color="white">Module name</Th> */}
                  <Th color="white">Date Added</Th>
                  <Th color="white">Added By</Th>
                  <Th color="white">Actions</Th>
                </Tr>
              </Thead>
              <Tbody>
                {modules.module?.map(module =>
                  <Tr key={module.id}>
                    <Td>{module.id}</Td>
                    <Td>{module.mainMenu}</Td>
                    <Td>{module.subMenuName}</Td>
                    {/* <Td>{module.moduleName}</Td> */}
                    <Td>{module.dateAdded}</Td>
                    <Td>{module.addedBy}</Td>
                    <Td>
                      <HStack>
                        <Button p={0} background='none' color='secondary' onClick={() => editHandler(module)}>
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
                                  {module.isActive === true ? <Text>Are you sure you want to set this module inactive?</Text> : <Text>Are you sure you want to set this module active?</Text>}
                                  <Button bgColor='secondary' color='white' _hover={{ bgColor: 'accent' }} onClick={() => changeStatusHandler(module.id, module.isActive)}>Yes</Button>
                                </VStack>
                              </PopoverBody>
                            </PopoverContent>
                          </Portal>
                        </Popover>
                      </HStack>
                    </Td>
                  </Tr>
                )
                }
              </Tbody>
            </Table>
          )
        }
      </PageScroll>

      {/* Table data end */}

      <Flex justifyContent='space-between' mt={5}>
        <Button leftIcon={<FcAddDatabase color='white' />} bgColor='secondary' onClick={newModuleHandler} _hover={{ bgColor: 'accent' }}>
          <Text color='white'>New Module</Text>
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
              fetchModules={fetchModules}
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
    </Flex >
  )
};

export default ModuleManagementPage;

const DrawerComponent = ({ isOpen, onClose, register, errors, isValid, handleSubmit, fetchModules }) => {
  const [isLoading, setisLoading] = useState(false)
  const [modules, setModules] = useState([])
  const [roles, setRoles] = useState([])
  const toast = useToast()

  const submitHandler = (data) => {
    try {
      if (data.formData.id === "") {
        delete data.formData["id"]
        setisLoading(true)
        const res = apiClient.post("Module/AddNewModule", data.formData).then((res) => {
          ToastComponent("Success", "New module created", "success", toast)
          setisLoading(false)
          fetchModules()
          onClose(onClose)
        }).catch(err => {
          setisLoading(false)
          ToastComponent("Error", err.response.data, "error", toast)
        })
      } else {
        const res = apiClient.put(`Module/UpdateModule/${data.formData.id}`, data.formData).then((res) => {
          ToastComponent("Success", "Module Updated", "success", toast)
          setisLoading(false)
          fetchModules()
          onClose(onClose)
        }).catch(err => {
          ToastComponent("Update Failed", err.response.data, "warning", toast)
        })
      }

    } catch (err) {
    }
  }

  const fetchMainMenu = async () => {
    try {
      const res = await apiClient.get('Module/GetAllMainMenu')
      setModules(res.data)
    } catch (error) {

    }
  }

  useEffect(() => {
    try {
      fetchMainMenu()
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
              Module Form
            </DrawerHeader>
            <DrawerBody>

              <Stack spacing='7px'>

                <Flex mt={1.5}></Flex>

                <Box>
                  <Stack>
                    <Text fontWeight='semibold'>Main Menu:</Text>
                    {
                      modules.length > 0 ? (
                        <Select
                          {...register("formData.mainMenuId")}
                          placeholder='Select'>
                          {modules.map(mod => (
                            <option key={mod.id} value={mod.id}>{mod.moduleName}</option>
                          ))}
                        </Select>
                      ) : "loading"
                    }
                    <Text color="danger" fontSize="xs">{errors.formData?.mainMenuId?.message}</Text>
                  </Stack>
                </Box>

                <Box>
                  <FormLabel>Sub-Menu Name:</FormLabel>
                  <Input
                    placeholder='Please enter Sub-Menu Name'
                    {...register("formData.subMenuName")}
                  />
                  <Text color="danger" fontSize="xs">{errors.formData?.subMenuName?.message}</Text>
                </Box>

                <Box>
                  <FormLabel>Module Path:</FormLabel>
                  <Input
                    placeholder='Please enter Module Name'
                    {...register("formData.moduleName")}
                  />
                  <Text color="danger" fontSize="xs">{errors.formData?.moduleName?.message}</Text>
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