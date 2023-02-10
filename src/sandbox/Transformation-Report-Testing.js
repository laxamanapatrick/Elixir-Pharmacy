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
import moment from "moment";
import apiClient from "../services/apiClient";
import PageScrollReusable from "../components/PageScroll-Reusable";

const fetchTransformationHistoryApi = async (dateFrom, dateTo) => {
  const res = await apiClient.get(
    `Report/TransformationHistoryReport?dateFrom=${dateFrom}&dateTo=${dateTo}`
  );
  return res.data;
};

export const TransformationReportHistoryTesting = ({
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
        setSheetData(
          res?.map((item, i) => {
            return {
              "Line Number": i + 1,
              "Transformation ID": item.transformationId,
              "Planning Date": moment(item.planningDate).format("yyyy-MM-DD"),
              "Item Code (Formula)": item.itemCode_Formula,
              Description: item.itemDescription_Formula,
              Version: item.version,
              Batch: item.batch,
              "Total Quantity": item.formula_Quantity,
              "Item Code (Recipe)": item.itemCode_Recipe,
              Description: item.itemDescription_Recipe,
              Quantity: item.recipe_Quantity,
              "Date Transformed": moment(item.dateTransformed).format(
                "yyyy-MM-DD"
              ),
            };
          })
        );
    });
  };

  const [filtered, setFiltered] = useState([]);

  const fetchFilteredData = () => {
    fetchTransformationHistoryApi(dateFrom, dateTo, sample).then((res) => {
      const unique = [];
      const map = new Map();
      for (const item of res) {
        if (!map.has(item.transformationId)) {
          map.set(item.transformationId, true);
          const requirements = res.filter(
            (s) =>
              s.transformationId === item.transformationId &&
              s.itemCode_Recipe !== item.itemCode_Formula
          );
          unique.push({
            transformationId: item.transformationId,
            itemCode_Formula: item.itemCode_Formula,
            itemDescription_Formula: item.itemDescription_Formula,
            Total_Quantity: item.formula_Quantity,
            Batch: item.batch,
            version: item.version,
            planningDate: item.planningDate,
            dateTransformed: item.dateTransformed,
            requirements: requirements.map((req) => {
              return {
                itemCode_Recipe: req.itemCode_Recipe,
                itemCode_Description: req.itemDescription_Recipe,
                recipe_quantity: req.recipe_Quantity,
              };
            }),
          });
        }
      }
      setFiltered(unique);
    });
  };

  //   console.log(filtered);

  useEffect(() => {
    fetchTransformationHistory();
    fetchFilteredData();

    return () => {
      setTransformationData([]);
      setFiltered([]);
    };
  }, [dateFrom, dateTo, sample]);

  return (
    <Flex w="full" flexDirection="column">
      <Flex border="1px">
        <PageScrollReusable minHeight="800px" maxHeight="820px">
          <Table size="sm">
            <Thead bgColor="secondary">
              <Tr>
                <Th color="white">Transformation ID</Th>
                <Th color="white">Planning Date</Th>
                <Th color="white">Item Code(Formula)</Th>
                <Th color="white">Item Description(Formula)</Th>
                <Th color="white">Version</Th>
                <Th color="white">Batch</Th>
                <Th color="white">Total Quantity</Th>
                <Th color="white">Transformation Date</Th>
                <Th color="white">Used Requirements</Th>
              </Tr>
            </Thead>
            <Tbody>
              {filtered?.map((item, i) => (
                <Tr key={i}>
                  <Td>{item.transformationId}</Td>
                  <Td>{moment(item.planningDate).format("yyyy-MM-DD")}</Td>
                  <Td>{item.itemCode_Formula}</Td>
                  <Td>{item.itemDescription_Formula}</Td>
                  <Td>{item.version}</Td>
                  <Td>{item.Batch}</Td>
                  <Td>{item.Total_Quantity}</Td>
                  <Td>{moment(item.dateTransformed).format("yyyy-MM-DD")}</Td>
                  <Td>
                    <Button
                      size="xs"
                      colorScheme="blue"
                      onClick={() => console.log(item)}
                    >
                      View
                    </Button>
                  </Td>
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
