import React, { useEffect, useState } from "react";
import {
  Flex,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useDisclosure,
  Button,
} from "@chakra-ui/react";
import apiClient from "../../../services/apiClient";
import PageScrollReusable from "../../../components/PageScroll-Reusable";
import moment from "moment";

const fetchMiscellaneousIssueHistoryApi = async (dateFrom, dateTo) => {
  const dayaDate = new Date();
  const dateToDaya = dayaDate.setDate(dayaDate.getDate() + 1);
  const res = await apiClient.get(
    `Report/MiscellaneousIssueReport?dateFrom=${dateFrom}&dateTo=${moment(
      dateToDaya
    ).format("yyyy-MM-DD")}`
  );
  return res.data;
};

export const MiscellaneousIssueHistory = ({
  dateFrom,
  dateTo,
  sample,
  setSheetData,
}) => {
  const [miscIssueData, setMiscIssueData] = useState([]);
  const [buttonChanger, setButtonChanger] = useState(true);

  const fetchMiscellaneousIssueHistory = () => {
    fetchMiscellaneousIssueHistoryApi(dateFrom, dateTo, sample).then((res) => {
      setMiscIssueData(res);
      setSheetData(
        res?.map((item, i) => {
          return {
            "Line Number": i + 1,
            "Issue ID": item.orderId,
            "Customer Code": item.customerCode,
            "Customer Name": item.customerName,
            Remarks: item.remarks ? item.remarks : "",
            Details: item.details ? item.details : "",
            "Item Code": item.itemCode,
            "Item Description": item.itemDescription,
            UOM: item.uom,
            Quantity: item.quantity,
            "Expiration Date": item.expirationDate,
            "Transacted By": item.transactBy,
            "Transaction Date": moment(item.transactDate).format("yyyy-MM-DD"),
          };
        })
      );
    });
  };

  useEffect(() => {
    fetchMiscellaneousIssueHistory();

    return () => {
      setMiscIssueData([]);
    };
  }, [dateFrom, dateTo, sample]);

  return (
    <Flex w="full" flexDirection="column">
      <Flex border="1px">
        <PageScrollReusable minHeight="800px" maxHeight="820px">
          <Table size="sm">
            <Thead bgColor="secondary">
              <Tr>
                <Th color="white">Issue ID</Th>
                <Th color="white">Customer Code</Th>
                <Th color="white">Customer Name</Th>
                {buttonChanger ? (
                  <>
                    <Th color="white">Remarks</Th>
                    <Th color="white">Details</Th>
                    <Th color="white">Item Code</Th>
                    <Th color="white">Item Description</Th>
                    <Th color="white">UOM</Th>
                    {/* <Th color='white'>category</Th>  */}
                    <Th color="white">Quantity</Th>
                  </>
                ) : (
                  <>
                    <Th color="white">Expiration Date</Th>
                    <Th color="white">Date Input</Th>
                    <Th color="white">Transaction Date</Th>
                    <Th color="white">Transact By</Th>
                  </>
                )}
              </Tr>
            </Thead>
            <Tbody>
              {miscIssueData?.map((item, i) => (
                <Tr key={i}>
                  <Td>{item.issueId}</Td>
                  <Td>{item.customerCode}</Td>
                  <Td>{item.customerName}</Td>
                  {buttonChanger ? (
                    <>
                      <Td>{item.remarks ? item.remarks : ""}</Td>
                      <Td>{item.details ? item.details : ""}</Td>
                      <Td>{item.itemCode}</Td>
                      <Td>{item.itemDescription}</Td>
                      <Td>{item.uom}</Td>
                      {/* <Td>Body</Td> */}
                      <Td>{item.quantity}</Td>
                    </>
                  ) : (
                    <>
                      <Td>{item.expirationDate}</Td>
                      <Td>{moment(item.transactDate).format("yyyy-MM-DD")}</Td>
                      <Td>
                        {moment(item.transactionDate).format("yyyy-MM-DD")}
                      </Td>
                      <Td>{item.transactBy}</Td>
                    </>
                  )}
                </Tr>
              ))}
            </Tbody>
          </Table>
        </PageScrollReusable>
      </Flex>

      <Flex justifyContent="end" mt={2}>
        <Button
          size="xs"
          colorScheme="teal"
          onClick={() => setButtonChanger(!buttonChanger)}
        >
          {buttonChanger ? `>>>>` : `<<<<`}
        </Button>
      </Flex>
    </Flex>
  );
};
