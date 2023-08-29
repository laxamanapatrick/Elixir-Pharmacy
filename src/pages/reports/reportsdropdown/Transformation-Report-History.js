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

const fetchTransformationHistoryApi = async (dateFrom, dateTo) => {
  const res = await apiClient.get(
    `Report/TransformationHistoryReport?dateFrom=${dateFrom}&dateTo=${dateTo}`
  );
  return res.data;
};

export const TransformationReportHistory = ({
  dateFrom,
  dateTo,
  sample,
  setSheetData,
}) => {
  const [transformationData, setTransformationData] = useState([]);
  const [buttonChanger, setButtonChanger] = useState(true);

  const fetchTransformationHistory = () => {
    fetchTransformationHistoryApi(dateFrom, dateTo, sample).then((res) => {
      setTransformationData(res);

      const excelData = res.map((item) => {
        const reference = res.find(
          (i) => i.transformId === item.transformId && i.planningDate !== null
        );
        return {
          transformId: item.transformId,
          itemCode: item.itemCode,
          itemDescription: item.itemDescription,
          actualQuantity: item.actualQuantity,
          totalQuantity: item.totalQuantity,
          version: item.version,
          batch: item.batch,
          planningDate:
            item.planningDate !== null
              ? item.planningDate
              : reference.planningDate,
          dateTransformed:
            item.dateTransformed !== null
              ? item.dateTransformed
              : reference.dateTransformed,
          category: item.category,
        };
      });

      setSheetData(
        excelData?.map((item, i) => {
          return {
            "Line Number": i + 1,
            "Transformation ID": item.transformId,
            "Item Code": item.itemCode,
            "Item Description": item.itemDescription,
            "Version": item.version,
            "Batch": item.batch,
            "Actual Quantity": item.actualQuantity,
            "Total Quantity": item.totalQuantity,
            "Planning Date": moment(item.planningDate).format("yyyy-MM-DD"),
            "Date Transformed": moment(item.dateTransformed).format(
              "yyyy-MM-DD"
            ),
            "Category": item.category,
          };
        })
      );
    });
  };

  useEffect(() => {
    fetchTransformationHistory();

    return () => {
      setTransformationData([]);
    };
  }, [dateFrom, dateTo, sample]);

  const newTransformationData = transformationData.map((item) => {
    const reference = transformationData.find(
      (i) => i.transformId === item.transformId && i.planningDate !== null
    );
    return {
      transformId: item.transformId,
      itemCode: item.itemCode,
      itemDescription: item.itemDescription,
      actualQuantity: item.actualQuantity,
      totalQuantity: item.totalQuantity,
      version: item.version,
      batch: item.batch,
      planningDate:
        item.planningDate !== null ? item.planningDate : reference.planningDate,
      dateTransformed:
        item.dateTransformed !== null
          ? item.dateTransformed
          : reference.dateTransformed,
      category: item.category,
    };
  });

  return (
    <Flex w="full" flexDirection="column">
      <Flex border="1px">
        <PageScrollReusable minHeight="800px" maxHeight="820px">
          <Table size="sm">
            <Thead bgColor="secondary">
              <Tr>
                <Th color="white">Transformation ID</Th>
                <Th color="white">Item Code</Th>
                <Th color="white">Item Description</Th>
                <Th color="white">Version</Th>
                <Th color="white">Batch</Th>
                <Th color="white">Total Quantity</Th>
                <Th color="white">Actual Quantity</Th>
                <Th color="white">Planning Date</Th>
                <Th color="white">Date Transformed</Th>
                <Th color="white">Category</Th>
              </Tr>
            </Thead>
            <Tbody>
              {newTransformationData?.map((item, i) => (
                <Tr key={i}>
                  <Td>{item.transformId}</Td>
                  <Td>{item.itemCode}</Td>
                  <Td>{item.itemDescription}</Td>
                  <Td>{item.version}</Td>
                  <Td>{item.batch}</Td>
                  <Td>{item.totalQuantity}</Td>
                  <Td>{item.actualQuantity}</Td>
                  <Td>
                    {item.planningDate
                      ? moment(item.planningDate).format("yyyy-MM-DD")
                      : ""}
                  </Td>
                  <Td>
                    {item.dateTransformed
                      ? moment(item.dateTransformed).format("yyyy-MM-DD")
                      : ""}
                  </Td>
                  <Td>{item.category}</Td>
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
