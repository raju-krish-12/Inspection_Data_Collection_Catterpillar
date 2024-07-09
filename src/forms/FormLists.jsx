import React from 'react';
import {
  Box,
  Heading,
  Flex,
  Text,
  Card,
  CardHeader,
  CardBody,
  Spacer,
} from '@chakra-ui/react';
import { useNavigate, useLocation } from 'react-router-dom';
import GeneratePDF from '../GeneratePDF';

export default function FormLists() {
  const navigate = useNavigate();
  const curPath = useLocation().pathname;
  const inspectionID = curPath.split("/").at(-1);
  function handleClick(path) {
    navigate(curPath + path);
  }

  return (
    <Box p={4}>
      <Heading ml = "450px" as="h1" size="xl" mb={4}>
        Your inspection ID is {inspectionID}
      </Heading>
      <Heading ml="650px" as = "h6" size="md">
      Fill other forms
      </Heading>
      <br/>
      <Flex
      mt="10px"
        ml={200}
        width={"1000px"}
        flexWrap="wrap"
        justifyContent="space-between"
      >
        {/* Grid items */}
        <Card  alignSelf="center" onClick={() => handleClick("/tires")} mb={4} width="30%">
          <CardHeader alignSelf="center">
            <Heading size="md">Tires</Heading>
          </CardHeader>
          <CardBody alignSelf="center">
            <Text>Fill details about tires</Text>
          </CardBody>
        </Card>
        <Card onClick={() => handleClick("/battery")} mb={4} width="30%">
          <CardHeader alignSelf="center">
            <Heading size="md">Battery</Heading>
          </CardHeader>
          <CardBody alignSelf="center">
            <Text>Fill details about Battery</Text>
          </CardBody>
        </Card>
        <Card onClick={() => handleClick("/exterior")} mb={4} width="30%">
          <CardHeader alignSelf="center">
            <Heading size="md">Exterior</Heading>
          </CardHeader>
          <CardBody alignSelf="center">
            <Text>Fill details about Exterior</Text>
          </CardBody>
        </Card>
        <Card onClick={() => handleClick("/brakes")} mb={4} width="30%">
          <CardHeader alignSelf="center">
            <Heading size="md">Brakes</Heading>
          </CardHeader>
          <CardBody alignSelf="center">
            <Text>Fill details about Brakes</Text>
          </CardBody>
        </Card>
        <Card onClick={() => handleClick("/engine")} mb={4} width="30%">
          <CardHeader alignSelf="center">
            <Heading size="md">Engine</Heading>
          </CardHeader>
          <CardBody alignSelf="center">
            <Text>Fill details about Engine</Text>
          </CardBody>
        </Card>
        <Card onClick={() => handleClick("/feedback")} mb={4} width="30%">
          <CardHeader alignSelf="center">
            <Heading size="md">Feedback</Heading>
          </CardHeader>
          <CardBody alignSelf="center">
            <Text>Voice of customer</Text>
          </CardBody>
        </Card>
        <Flex mt="20px" ml="400px" justifyContent="center">
          <GeneratePDF />
        </Flex>
      </Flex>
    </Box>
  );
}
