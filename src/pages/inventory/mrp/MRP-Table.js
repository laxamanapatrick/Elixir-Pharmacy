import React, { useEffect, useRef, useState } from "react";
import * as XLSX from "xlsx";
import {
  Button,
  ButtonGroup,
  Flex,
  HStack,
  Input,
  InputGroup,
  InputLeftElement,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  Stack,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useDisclosure,
} from "@chakra-ui/react";
import {
  Pagination,
  PaginationNext,
  PaginationPage,
  PaginationPrevious,
  PaginationContainer,
  PaginationPageGroup,
} from "@ajna/pagination";
import PageScrollReusable from "../../../components/PageScroll-Reusable";
import { BiRightArrow } from "react-icons/bi";
import { FaSearch } from "react-icons/fa";
import { CgDanger } from "react-icons/cg";
import { AiOutlinePrinter } from "react-icons/ai";
import { useReactToPrint } from "react-to-print";
import apiClient from "../../../services/apiClient";

export const MRPTable = ({
  mrpData,
  setSelectorId,
  selectorId,
  setRawMatsInfo,
  pagesCount,
  pages,
  currentPage,
  setCurrentPage,
  setPageSize,
  setSearch,
  pageTotal,
  sheetData,
}) => {
  const [buttonChanger, setButtonChanger] = useState(false);

  const handleExport = () => {
    var workbook = XLSX.utils.book_new(),
      worksheet = XLSX.utils.json_to_sheet(sheetData);

    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

    XLSX.writeFile(workbook, "Elixir_MRP_ExportFile.xlsx");
  };

  const handlePageChange = (nextPage) => {
    setCurrentPage(nextPage);
  };

  const handlePageSizeChange = (e) => {
    const pageSize = Number(e.target.value);
    setPageSize(pageSize);
  };

  const searchHandler = (inputValue) => {
    setCurrentPage(1);
    setSearch(inputValue);
  };

  const selectorHandler = (
    id,
    { itemCode, itemDescription, soh, bufferLevel, suggestedPo, lastUsed }
  ) => {
    if (id) {
      setSelectorId(id);
      setRawMatsInfo({
        itemCode: itemCode,
        itemDescription: itemDescription,
        soh: soh,
        bufferLevel: bufferLevel,
        suggestedPo: suggestedPo,
        lastUsed: "No data",
      });
    } else {
      setSelectorId("");
      setRawMatsInfo({
        itemCode: "",
        itemDescription: "",
        soh: "",
        bufferLevel: "",
        suggestedPo: "",
        lastUsed: "",
      });
    }
  };

  const {
    isOpen: isPrint,
    onOpen: openPrint,
    onClose: closePrint,
  } = useDisclosure();
  const printMRPHandler = () => {
    openPrint();
  };

  return (
    <Flex w="full" justifyContent="center" flexDirection="column">
      <Flex justifyContent="space-between" mb={1}>
        <InputGroup w="28%">
          <InputLeftElement
            pointerEvents="none"
            children={<FaSearch color="gray.300" />}
          />
          <Input
            onChange={(e) => searchHandler(e.target.value)}
            type="text"
            placeholder="Search: Item Description"
            focusBorderColor="accent"
          />
          <Button
            onClick={printMRPHandler}
            ml={3}
            bgColor="secondary"
            _hover={{ bgColor: "accent" }}
          >
            <AiOutlinePrinter color="white" fontSize="25px" />
          </Button>
          <Button
            onClick={handleExport}
            disabled={!sheetData}
            ml={2}
            px={5}
            _hover={{ bgColor: "accent" }}
          >
            Export
          </Button>
        </InputGroup>

        <Button
          onClick={() => setButtonChanger(!buttonChanger)}
          size="xs"
          px={5}
          colorScheme="blue"
        >
          {buttonChanger ? "<< Previous" : "Next >>"}
        </Button>
      </Flex>

      <PageScrollReusable minHeight="617px" maxHeight="618px">
        <Table size="sm">
          <Thead bgColor="secondary">
            <Tr>
              <Th p={0} color="white"></Th>
              <Th p={0} color="white"></Th>
              <Th color="white">Line</Th>
              <Th color="white">Item Code</Th>
              <Th color="white">Item Description</Th>
              {!buttonChanger ? (
                <>
                  <Th color="white">Item Category</Th>
                  <Th color="white">UOM</Th>
                  <Th color="white">Price</Th>
                  <Th color="white">Total Price</Th>
                  <Th color="white">SOH</Th>
                  <Th color="white">Reserve</Th>
                  <Th color="white">Reserve Usage</Th>
                  <Th color="white">Buffer Level</Th>
                  <Th color="white">Transform From</Th>
                  <Th color="white">Transform To</Th>
                </>
              ) : (
                <>
                  <Th color="white">{`Receive (IN)`}</Th>
                  <Th color="white">{`Receipt (IN)`}</Th>
                  <Th color="white">{`Move Order (OUT)`}</Th>
                  <Th color="white">{`Issue (OUT)`}</Th>
                  <Th color="white">QA Receiving</Th>
                  {/* <Th color='white'>Last Used</Th>
                                        <Th color='white'>Movement Status</Th>
                                        <Th color='white'>Classification ABC</Th> */}
                  <Th color="white">Suggested PO</Th>
                  <Th color="white">Average Issuance</Th>
                  <Th color="white">Days Level</Th>
                </>
              )}
            </Tr>
          </Thead>
          <Tbody>
            {mrpData?.inventory?.map((item, i) => (
              <Tr
                key={i}
                onClick={() => selectorHandler(i + 1, item)}
                bgColor={
                  selectorId === i + 1
                    ? "table_accent"
                    : "none" && item.bufferLevel > item.reserve
                    ? "gray.300"
                    : "none"
                }
                cursor="pointer"
              >
                {selectorId === i + 1 ? (
                  <Td p={0}>
                    <BiRightArrow />
                  </Td>
                ) : (
                  <Td p={0}></Td>
                )}
                <Td>
                  {item.bufferLevel > item.reserve ? (
                    <CgDanger color="red" />
                  ) : (
                    ""
                  )}
                </Td>
                <Td>{i + 1}</Td>
                <Td>{item.itemCode}</Td>
                <Td>{item.itemDescription}</Td>
                {!buttonChanger ? (
                  <>
                    <Td>{item.itemCategory}</Td>
                    <Td>{item.uom}</Td>
                    <Td>
                      {item.price?.toLocaleString(undefined, {
                        maximumFractionDigits: 2,
                        minimumFractionDigits: 2,
                      })}
                    </Td>
                    <Td>
                      {item.totalPrice?.toLocaleString(undefined, {
                        maximumFractionDigits: 2,
                        minimumFractionDigits: 2,
                      })}
                    </Td>
                    <Td>
                      {item.soh?.toLocaleString(undefined, {
                        maximumFractionDigits: 2,
                        minimumFractionDigits: 2,
                      })}
                    </Td>
                    <Td>
                      {item.reserve?.toLocaleString(undefined, {
                        maximumFractionDigits: 2,
                        minimumFractionDigits: 2,
                      })}
                    </Td>
                    <Td>
                      {item.reserveUsage?.toLocaleString(undefined, {
                        maximumFractionDigits: 2,
                        minimumFractionDigits: 2,
                      })}
                    </Td>
                    <Td>
                      {item.bufferLevel?.toLocaleString(undefined, {
                        maximumFractionDigits: 2,
                        minimumFractionDigits: 2,
                      })}
                    </Td>
                    <Td>
                      {item.transformFrom?.toLocaleString(undefined, {
                        maximumFractionDigits: 2,
                        minimumFractionDigits: 2,
                      })}
                    </Td>
                    <Td>
                      {item.transformTo?.toLocaleString(undefined, {
                        maximumFractionDigits: 2,
                        minimumFractionDigits: 2,
                      })}
                    </Td>
                  </>
                ) : (
                  <>
                    <Td>
                      {item.receiveIn?.toLocaleString(undefined, {
                        maximumFractionDigits: 2,
                        minimumFractionDigits: 2,
                      })}
                    </Td>
                    <Td>
                      {item.receiptIn?.toLocaleString(undefined, {
                        maximumFractionDigits: 2,
                        minimumFractionDigits: 2,
                      })}
                    </Td>
                    <Td>
                      {item.moveOrderOut?.toLocaleString(undefined, {
                        maximumFractionDigits: 2,
                        minimumFractionDigits: 2,
                      })}
                    </Td>
                    <Td>
                      {item.issueOut?.toLocaleString(undefined, {
                        maximumFractionDigits: 2,
                        minimumFractionDigits: 2,
                      })}
                    </Td>
                    <Td>
                      {item.qcReceiving?.toLocaleString(undefined, {
                        maximumFractionDigits: 2,
                        minimumFractionDigits: 2,
                      })}
                    </Td>
                    {/* <Td>{`Last Used`}</Td>
                                                <Td>{`Movement Status`}</Td>
                                                <Td>{`Classification ABC`}</Td> */}
                    <Td>
                      {item.suggestedPo?.toLocaleString(undefined, {
                        maximumFractionDigits: 2,
                        minimumFractionDigits: 2,
                      })}
                    </Td>
                    <Td>
                      {item.averageIssuance?.toLocaleString(undefined, {
                        maximumFractionDigits: 2,
                        minimumFractionDigits: 2,
                      })}
                    </Td>
                    <Td>{item.daysLevel?.toLocaleString()}</Td>
                  </>
                )}
              </Tr>
            ))}
          </Tbody>
        </Table>
      </PageScrollReusable>

      <Flex mt={5} justifyContent="end" w="full">
        <Stack>
          <Pagination
            pagesCount={pagesCount}
            currentPage={currentPage}
            onPageChange={handlePageChange}
          >
            <PaginationContainer>
              <PaginationPrevious
                bg="secondary"
                color="white"
                p={1}
                _hover={{ bg: "accent", color: "white" }}
              >
                {"<<"}
              </PaginationPrevious>
              <PaginationPageGroup ml={1} mr={1}>
                {pages.map((page) => (
                  <PaginationPage
                    _hover={{ bg: "accent", color: "white" }}
                    p={3}
                    bg="secondary"
                    color="white"
                    key={`pagination_page_${page}`}
                    page={page}
                  />
                ))}
              </PaginationPageGroup>
              <HStack>
                <PaginationNext
                  bg="secondary"
                  color="white"
                  p={1}
                  _hover={{ bg: "accent", color: "white" }}
                >
                  {">>"}
                </PaginationNext>
                <Select onChange={handlePageSizeChange} variant="filled">
                  {/* <option value={Number(1000)}>ALL</option> */}
                  <option value={Number(50)}>50</option>
                  <option value={Number(5)}>5</option>
                  <option value={Number(10)}>10</option>
                  <option value={Number(25)}>25</option>
                </Select>
              </HStack>
            </PaginationContainer>
          </Pagination>
        </Stack>
      </Flex>

      {isPrint && (
        <PrintModal isOpen={isPrint} onClose={closePrint} mrpData={mrpData} />
      )}
    </Flex>
  );
};

const PrintModal = ({ isOpen, onClose, mrpData }) => {
  const componentRef = useRef();

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  return (
    <>
      <Modal isOpen={isOpen} onClose={() => {}} isCentered size="6xl">
        <ModalContent>
          <ModalHeader>
            <Flex justifyContent="center">Print MRP Data</Flex>
          </ModalHeader>
          <ModalCloseButton onClick={onClose} />

          <ModalBody mt={5}>
            <PageScrollReusable minHeight="617px" maxHeight="618px">
              <Table size="sm" variant="simple" ref={componentRef}>
                <Thead bgColor="secondary">
                  <Tr>
                    {/* <Th p={0} color='white'></Th> */}
                    <Th p={0} color="white"></Th>
                    {/* <Th color='white'>Line</Th> */}
                    <Th color="white">Item Code</Th>
                    <Th color="white">Item Description</Th>
                    <Th color="white">Item Category</Th>
                    <Th color="white">UOM</Th>
                    {/* <Th color='white'>Price</Th> */}
                    {/* <Th color='white'>Total Price</Th> */}
                    <Th color="white">SOH</Th>
                    <Th color="white">Reserve</Th>
                    <Th color="white">Reserve Usage</Th>
                    <Th color="white">Buffer Level</Th>
                    {/* <Th color='white'>Transform From</Th> */}
                    {/* <Th color='white'>Transform To</Th> */}
                    {/* <Th color='white'>{`Receive (IN)`}</Th> */}
                    {/* <Th color='white'>{`Receipt (IN)`}</Th> */}
                    {/* <Th color='white'>{`Move Order (OUT)`}</Th> */}
                    {/* <Th color='white'>{`Issue (OUT)`}</Th> */}
                    {/* <Th color='white'>QA Receiving</Th> */}
                    {/* <Th color='white'>Last Used</Th>
                                        <Th color='white'>Movement Status</Th>
                                        <Th color='white'>Classification ABC</Th> */}
                    {/* <Th color='white'>Suggested PO</Th> */}
                    {/* <Th color='white'>Average Issuance</Th> */}
                    {/* <Th color='white'>Days Level</Th> */}
                  </Tr>
                </Thead>
                <Tbody>
                  {mrpData?.inventory?.map((item, i) => (
                    <Tr key={i}>
                      {/* <Td p={0}></Td> */}
                      <Td>
                        {item.bufferLevel > item.reserve ? (
                          <CgDanger color="red" />
                        ) : (
                          ""
                        )}
                      </Td>
                      {/* <Td>{i + 1}</Td> */}
                      <Td>{item.itemCode}</Td>
                      <Td>{item.itemDescription}</Td>
                      <Td>{item.itemCategory}</Td>
                      <Td>{item.uom}</Td>
                      {/* <Td>{item.price?.toLocaleString(undefined, { maximumFractionDigits: 2, minimumFractionDigits: 2 })}</Td> */}
                      {/* <Td>{item.totalPrice?.toLocaleString(undefined, { maximumFractionDigits: 2, minimumFractionDigits: 2 })}</Td> */}
                      <Td>
                        {item.soh?.toLocaleString(undefined, {
                          maximumFractionDigits: 2,
                          minimumFractionDigits: 2,
                        })}
                      </Td>
                      <Td>
                        {item.reserve?.toLocaleString(undefined, {
                          maximumFractionDigits: 2,
                          minimumFractionDigits: 2,
                        })}
                      </Td>
                      <Td>
                        {item.reserveUsage?.toLocaleString(undefined, {
                          maximumFractionDigits: 2,
                          minimumFractionDigits: 2,
                        })}
                      </Td>
                      <Td>
                        {item.bufferLevel?.toLocaleString(undefined, {
                          maximumFractionDigits: 2,
                          minimumFractionDigits: 2,
                        })}
                      </Td>
                      {/* <Td>{item.transformFrom?.toLocaleString(undefined, { maximumFractionDigits: 2, minimumFractionDigits: 2 })}</Td> */}
                      {/* <Td>{item.transformTo?.toLocaleString(undefined, { maximumFractionDigits: 2, minimumFractionDigits: 2 })}</Td> */}
                      {/* <Td>{item.receiveIn?.toLocaleString(undefined, { maximumFractionDigits: 2, minimumFractionDigits: 2 })}</Td> */}
                      {/* <Td>{item.receiptIn?.toLocaleString(undefined, { maximumFractionDigits: 2, minimumFractionDigits: 2 })}</Td> */}
                      {/* <Td>{item.moveOrderOut?.toLocaleString(undefined, { maximumFractionDigits: 2, minimumFractionDigits: 2 })}</Td> */}
                      {/* <Td>{item.issueOut?.toLocaleString(undefined, { maximumFractionDigits: 2, minimumFractionDigits: 2 })}</Td> */}
                      {/* <Td>{item.qcReceiving?.toLocaleString(undefined, { maximumFractionDigits: 2, minimumFractionDigits: 2 })}</Td> */}
                      {/* <Td>{`Last Used`}</Td>
                                                <Td>{`Movement Status`}</Td>
                                                <Td>{`Classification ABC`}</Td> */}
                      {/* <Td>{item.suggestedPo?.toLocaleString(undefined, { maximumFractionDigits: 2, minimumFractionDigits: 2 })}</Td> */}
                      {/* <Td>{item.averageIssuance?.toLocaleString(undefined, { maximumFractionDigits: 2, minimumFractionDigits: 2 })}</Td> */}
                      {/* <Td>{item.daysLevel?.toLocaleString()}</Td> */}
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </PageScrollReusable>
          </ModalBody>

          <ModalFooter mt={7}>
            <ButtonGroup size="sm">
              <Button colorScheme="blue" onClick={handlePrint}>
                Print
              </Button>
              <Button variant="ghost" onClick={onClose}>
                Close
              </Button>
            </ButtonGroup>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

